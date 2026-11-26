import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createHash, randomUUID } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import inquirer from "inquirer";
import sharp from "sharp";

export const TILE_OPTIONS = { size: 512, overlap: 1, layout: "dz", container: "fs" };
const SETTINGS = { revision: 2, tileSize: 512, overlap: 1, format: "webp", quality: 90, maxImagePixels: 16000000 };
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(name) {
    return name.toLowerCase().replace(/[æœøłđðþß]/g, character => ({
        æ: "ae", œ: "oe", ø: "o", ł: "l", đ: "d", ð: "d", þ: "th", ß: "ss",
    })[character]).normalize("NFKD").replace(/\p{M}/gu, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function label(value, description) {
    if (typeof value !== "string" || !value.trim() || /[/\\]/.test(value) || value === "." || value === "..") {
        throw new Error(`${description} invalide : ${value}`);
    }
    return value.trim();
}

function regionsOf(catalog) {
    const regions = new Map([["", []]]);
    for (const map of catalog.maps) {
        map.regions.forEach((region, index) => {
            const parts = map.regions.slice(0, index + 1);
            const key = parts.map(part => part.id).join("/");
            const existing = regions.get(key);
            if (existing && existing[index].name !== region.name) throw new Error(`Région incohérente : ${key}`);
            regions.set(key, parts);
        });
    }
    return regions;
}

function assetPath(root, relative) {
    if (typeof relative !== "string" || relative.includes("\\") ||
        relative.split("/").some(part => !part || part === "." || part === "..")) {
        throw new Error(`Chemin de carte invalide : ${relative}`);
    }
    return path.join(root, ...relative.split("/"));
}

export async function loadCatalog(outputRoot) {
    const catalog = JSON.parse(await fs.readFile(path.join(outputRoot, "catalog.json"), "utf8"));
    if (catalog.schema !== 1 || !Array.isArray(catalog.maps) || !catalog.maps.length) {
        throw new Error("Catalogue des cartes invalide ou vide.");
    }
    const ids = new Set();
    for (const map of catalog.maps) {
        if (!Array.isArray(map.regions) || map.regions.some(region => !ID.test(region.id)) ||
            typeof map.id !== "string" || !map.id.split("/").every(part => ID.test(part)) ||
            map.id.split("/").slice(0, -1).join("/") !== map.regions.map(region => region.id).join("/") ||
            ids.has(map.id) || !Array.isArray(map.pages) || map.pages.length !== 1) {
            throw new Error(`Entrée de carte invalide ou dupliquée : ${map.id}`);
        }
        ids.add(map.id);
        label(map.name, "Nom de carte");
        for (const region of map.regions) label(region.name, "Nom de région");
        if (map.group !== undefined) label(map.group, "Nom de dossier");
    }
    regionsOf(catalog);
    return catalog;
}

export async function verifyAssets(outputRoot, catalog) {
    for (const map of catalog.maps) {
        const page = map.pages[0];
        const url = assetPath(outputRoot, page.url);
        await fs.access(assetPath(outputRoot, page.thumbnail));
        if (page.type === "image") {
            await fs.access(url);
        } else if (page.type === "dzi") {
            const xml = await fs.readFile(url, "utf8");
            const get = name => xml.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
            const width = Number(get("Width")), height = Number(get("Height")), size = Number(get("TileSize"));
            const format = get("Format");
            if (!Number.isInteger(width) || width !== page.width || !Number.isInteger(height) ||
                height !== page.height || !Number.isInteger(size) || size < 1 || format !== "webp" ||
                !page.url.endsWith(".dzi")) throw new Error(`Descripteur Deep Zoom invalide : ${map.id}`);
            const level = Math.ceil(Math.log2(Math.max(width, height)));
            const tilesRoot = url.slice(0, -4) + "_files";
            for (let n = 0; n <= level; n++) {
                const columns = Math.ceil(width / (2 ** (level - n) * size));
                const rows = Math.ceil(height / (2 ** (level - n) * size));
                for (let x = 0; x < columns; x++) {
                    for (let y = 0; y < rows; y++) await fs.access(path.join(tilesRoot, String(n), `${x}_${y}.webp`));
                }
            }
        } else throw new Error(`Format de carte inconnu : ${map.id}`);
    }
}

async function fileStats(directory) {
    let bytes = 0, files = 0;
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            const nested = await fileStats(full);
            bytes += nested.bytes;
            files += nested.files;
        } else {
            bytes += (await fs.stat(full)).size;
            files++;
        }
    }
    return { bytes, files };
}

export async function convertImage(input, directory, maxImagePixels = SETTINGS.maxImagePixels) {
    await fs.mkdir(directory, { recursive: true });
    const metadata = await sharp(input).metadata();
    if (!["jpeg", "png"].includes(metadata.format)) throw new Error("La source doit être une image JPG ou PNG.");
    const { width, height } = metadata.autoOrient;
    const tiled = width * height > maxImagePixels || Math.max(width, height) > 16383;
    const image = () => sharp(input).rotate().toColourspace("srgb");
    if (tiled) {
        await image().webp({ quality: SETTINGS.quality }).tile(TILE_OPTIONS).toFile(path.join(directory, "tiles.dz"));
    } else {
        await image().webp({ quality: SETTINGS.quality }).toFile(path.join(directory, "image.webp"));
    }
    await image().resize({ width: 480, height: 320, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 }).toFile(path.join(directory, "thumbnail.webp"));
    return { width, height, type: tiled ? "dzi" : "image", ...await fileStats(directory) };
}

async function filesIn(root, relative = "") {
    const files = [];
    for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
        const name = path.join(relative, entry.name);
        if (entry.isDirectory()) files.push(...await filesIn(root, name));
        else if (entry.isFile() && entry.name !== "vips-properties.xml") files.push(name);
        else if (!entry.isFile()) throw new Error(`Sortie inattendue : ${name}`);
    }
    return files.sort();
}

async function sameRevision(first, second) {
    const names = await filesIn(first);
    const other = await filesIn(second);
    if (JSON.stringify(names) !== JSON.stringify(other)) return false;
    for (const name of names) {
        const a = await fs.readFile(path.join(first, name));
        const b = await fs.readFile(path.join(second, name));
        if (!a.equals(b)) return false;
    }
    return true;
}

async function replaceFile(target, content) {
    const directory = await fs.mkdtemp(path.join(path.dirname(target), ".map-update-"));
    try {
        const temporary = path.join(directory, path.basename(target));
        await fs.writeFile(temporary, content);
        await fs.rename(temporary, target);
    } finally {
        await fs.rm(directory, { recursive: true, force: true });
    }
}

export async function updateMap(outputRoot, { operation, input, id, name, regions, group }) {
    const catalogFile = path.join(outputRoot, "catalog.json");
    const originalCatalog = await fs.readFile(catalogFile);
    const catalog = await loadCatalog(outputRoot);
    const existing = catalog.maps.find(map => map.id === id);
    if (operation === "replace") {
        if (!existing) throw new Error(`Carte inconnue : ${id}`);
        name = existing.name;
        regions = existing.regions;
        group = existing.group;
    } else if (operation === "add") {
        if (existing) throw new Error(`Identifiant déjà utilisé : ${id}`);
        label(name, "Nom de carte");
        if (!Array.isArray(regions) || regions.some(region => !ID.test(region.id))) throw new Error("Région invalide.");
        const prefix = regions.map(region => region.id).join("/");
        if (id.split("/").slice(0, -1).join("/") !== prefix || !id.split("/").every(part => ID.test(part))) {
            throw new Error(`Identifiant invalide : ${id}`);
        }
        for (const region of regions) label(region.name, "Nom de région");
        if (group !== undefined) label(group, "Nom de dossier");
        const known = regionsOf(catalog);
        regions.forEach((region, index) => {
            const key = regions.slice(0, index + 1).map(part => part.id).join("/");
            if (known.has(key) && known.get(key)[index].name !== region.name) throw new Error(`Région incohérente : ${key}`);
        });
    } else throw new Error(`Opération inconnue : ${operation}`);
    await verifyAssets(outputRoot, { maps: catalog.maps.filter(map => map !== existing) });
    if (!/\.(jpe?g|png)$/i.test(input)) throw new Error("Choisissez une image JPG ou PNG.");
    const sourceBytes = await fs.readFile(input);
    const sha256 = createHash("sha256").update(sourceBytes).digest("hex");
    const revision = createHash("sha256").update(sha256).update(JSON.stringify(SETTINGS))
        .update(JSON.stringify(sharp.versions)).digest("hex").slice(0, 16);
    const staging = await fs.mkdtemp(path.join(outputRoot, ".map-conversion-"));
    try {
        const details = await convertImage(sourceBytes, staging);
        const file = details.type === "dzi" ? "tiles.dzi" : "image.webp";
        await verifyAssets(staging, { maps: [{ id, pages: [{ ...details, url: file, thumbnail: "thumbnail.webp" }] }] });
        let base = `${id}/${revision}`;
        let destination = assetPath(outputRoot, base);
        await fs.mkdir(path.dirname(destination), { recursive: true });
        let create = true;
        try {
            await fs.mkdir(destination);
        } catch (error) {
            if (error.code !== "EEXIST") throw error;
            if (await sameRevision(staging, destination)) create = false;
            else {
                base = `${id}/${revision}-${randomUUID()}`;
                destination = assetPath(outputRoot, base);
                await fs.mkdir(destination);
            }
        }
        if (create) {
            for (const entry of await fs.readdir(staging)) {
                await fs.cp(path.join(staging, entry), path.join(destination, entry),
                    { recursive: true, force: false, errorOnExist: true });
            }
        }
        const page = { ...details, page: 1, url: `${base}/${file}`, thumbnail: `${base}/thumbnail.webp` };
        const map = { id, name, regions, source: path.basename(input),
            ...(group !== undefined ? { group } : {}), pages: [page],
            conversion: { sha256, sourceBytes: sourceBytes.length, settings: SETTINGS, sharp: sharp.versions } };
        if (!(await fs.readFile(catalogFile)).equals(originalCatalog)) throw new Error("Le catalogue a changé pendant la conversion ; recommencez.");
        if (existing) catalog.maps[catalog.maps.indexOf(existing)] = map;
        else catalog.maps.push(map);
        if (existing === catalog.maps[0] || id === catalog.maps[0].id) {
            await replaceFile(path.join(outputRoot, "cover.webp"), await fs.readFile(assetPath(outputRoot, page.thumbnail)));
        }
        await replaceFile(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
        return { map, oldUrl: existing?.pages[0].url };
    } finally {
        await fs.rm(staging, { recursive: true, force: true });
    }
}

export async function runAssistant(outputRoot, prompt = inquirer.prompt, log = console.log) {
    const catalog = await loadCatalog(outputRoot);
    const { operation } = await prompt([{ type: "select", name: "operation", message: "Que souhaitez-vous faire ?",
        choices: [{ name: "Ajouter une carte", value: "add" }, { name: "Remplacer une carte", value: "replace" }] }]);
    let id, name, regions, group;
    if (operation === "replace") {
        ({ id } = await prompt([{ type: "select", name: "id", message: "Carte à remplacer :",
            choices: catalog.maps.map(map => ({ name: `${map.name} (${map.id})`, value: map.id })) }]));
    } else {
        const known = regionsOf(catalog);
        const choices = [...known].map(([value, parts]) => ({ name: parts.length ? parts.map(part => part.name).join(" > ") : "Monde", value }));
        const { regionChoice } = await prompt([{ type: "select", name: "regionChoice", message: "Région :",
            choices: [...choices, { name: "Créer une région ou sous-région", value: "__new__" }] }]);
        if (regionChoice === "__new__") {
            const { parent } = await prompt([{ type: "select", name: "parent", message: "Région parente :", choices }]);
            const answer = await prompt([{ type: "input", name: "name", message: "Nom de la nouvelle région :",
                validate: value => value.trim() ? true : "Le nom est obligatoire." }]);
            const regionName = label(answer.name, "Nom de région");
            const { regionId } = await prompt([{ type: "input", name: "regionId", message: "Identifiant de la région :",
                default: slugify(regionName), validate: value => ID.test(value) && !known.has([parent, value].filter(Boolean).join("/"))
                    ? true : "Identifiant invalide ou déjà utilisé." }]);
            regions = [...known.get(parent), { id: regionId, name: regionName }];
        } else regions = known.get(regionChoice);
        ({ name } = await prompt([{ type: "input", name: "name", message: "Nom affiché de la carte :",
            validate: value => value.trim() ? true : "Le nom est obligatoire." }]));
        name = label(name, "Nom de carte");
        const prefix = regions.map(region => region.id).join("/");
        const { mapId } = await prompt([{ type: "input", name: "mapId", message: "Identifiant de la carte :",
            default: slugify(name), validate: value => ID.test(value) && !catalog.maps.some(map => map.id === [prefix, value].filter(Boolean).join("/"))
                ? true : "Identifiant invalide ou déjà utilisé ; choisissez-en un autre." }]);
        id = [prefix, mapId].filter(Boolean).join("/");
        const groups = [...new Set(catalog.maps.filter(map => map.regions.map(part => part.id).join("/") === prefix && map.group).map(map => map.group))];
        const { groupChoice } = await prompt([{ type: "select", name: "groupChoice", message: "Dossier d'affichage :",
            choices: [{ name: "Aucun", value: "" }, ...groups.map(value => ({ name: value, value: `existing:${value}` })),
                { name: "Créer un dossier", value: "__new__" }] }]);
        if (groupChoice === "__new__") {
            const answer = await prompt([{ type: "input", name: "group", message: "Nom du dossier :",
                validate: value => value.trim() ? true : "Le nom est obligatoire." }]);
            group = label(answer.group, "Nom de dossier");
        } else if (groupChoice) group = groupChoice.slice("existing:".length);
    }
    const answer = await prompt([{ type: "input", name: "input", message: "Chemin de l'image JPG ou PNG (dans maps ou ailleurs) :",
        validate: value => value.trim() ? true : "Le chemin est obligatoire." }]);
    const input = path.resolve(answer.input.trim().replace(/^["'](.*)["']$/, "$1"));
    const { confirmed } = await prompt([{ type: "confirm", name: "confirmed",
        message: `${operation === "add" ? "Ajouter" : "Remplacer"} ${id} avec ${path.basename(input)} ?`, default: false }]);
    if (!confirmed) { log("Annulé : aucune carte modifiée."); return; }
    const result = await updateMap(outputRoot, { operation, input, id, name, regions, group });
    log(`Carte enregistrée : ${result.map.id} → ${result.map.pages[0].url}`);
    if (result.oldUrl && result.oldUrl !== result.map.pages[0].url) log(`Ancienne sortie conservée : ${path.posix.dirname(result.oldUrl)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    sharp.concurrency(2);
    const root = fileURLToPath(new URL("../", import.meta.url));
    await runAssistant(path.join(root, "public", "maps_converted"));
}
