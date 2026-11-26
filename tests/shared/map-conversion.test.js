import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Buffer } from "node:buffer";
import { PassThrough, Writable } from "node:stream";
import { afterEach, describe, expect, it } from "vitest";
import inquirer from "inquirer";
import sharp from "sharp";
import { convertImage, loadCatalog, runAssistant, slugify, updateMap, verifyAssets } from "../../scripts/convert-maps.mjs";

const temporary = [];
async function workspace() {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "suriel-map-test-"));
    temporary.push(directory);
    return directory;
}
afterEach(async () => {
    for (const directory of temporary.splice(0)) await fs.rm(directory, { recursive: true });
});

async function fixture() {
    const root = await workspace();
    const output = path.join(root, "converted");
    const directory = path.join(output, "world", "old");
    const source = path.join(root, "source.png");
    await sharp({ create: { width: 20, height: 10, channels: 3, background: "blue" } }).png().toFile(source);
    const details = await convertImage(source, directory);
    const page = { ...details, page: 1, url: "world/old/image.webp", thumbnail: "world/old/thumbnail.webp" };
    const catalog = { schema: 1, maps: [{ id: "world", name: "World", regions: [], source: "old.png", pages: [page] }] };
    await fs.writeFile(path.join(output, "catalog.json"), JSON.stringify(catalog));
    await fs.copyFile(path.join(directory, "thumbnail.webp"), path.join(output, "cover.webp"));
    return { root, output, source, catalog };
}

describe("known map conversion", () => {
    it("uses a single WebP for moderate images and tiles larger images without modifying the source", async () => {
        const root = await workspace();
        const input = path.join(root, "source.png");
        const output = path.join(root, "converted");
        const width = 513, height = 513;
        const rgba = Buffer.alloc(width * height * 4);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                rgba[index] = x % 256;
                rgba[index + 1] = y % 256;
                rgba[index + 2] = (x + y) % 256;
                rgba[index + 3] = 128 + (x % 128);
            }
        }
        await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toFile(input);
        const original = await fs.readFile(input);
        const result = await convertImage(input, output);
        expect([result.width, result.height, result.type]).toEqual([width, height, "image"]);
        const single = await sharp(await fs.readFile(path.join(output, "image.webp"))).metadata();
        expect([single.format, single.width, single.height, single.hasAlpha]).toEqual(["webp", width, height, true]);
        const tiled = path.join(root, "tiled");
        const tiledResult = await convertImage(input, tiled, width * height - 1);
        expect(tiledResult.type).toBe("dzi");
        expect(await fs.readFile(path.join(tiled, "tiles.dzi"), "utf8")).toContain('Format="webp"');
        const edge = await sharp(await fs.readFile(path.join(tiled, "tiles_files", "10", "1_1.webp"))).metadata();
        expect([edge.width, edge.height]).toEqual([2, 2]);
        expect((await fs.readFile(input)).equals(original)).toBe(true);
    });

    it("honors image orientation without changing the source", async () => {
        const root = await workspace();
        const input = path.join(root, "rotated.jpg");
        await sharp({ create: { width: 32, height: 16, channels: 3, background: "blue" } })
            .jpeg().withMetadata({ orientation: 6 }).toFile(input);
        const result = await convertImage(input, path.join(root, "converted"));
        expect([result.width, result.height]).toEqual([16, 32]);
        expect((await sharp(await fs.readFile(input)).metadata()).orientation).toBe(6);
    });

    it("adds and replaces one map without old sources, preserving IDs, groups and other assets", async () => {
        const { root, output, source, catalog } = await fixture();
        const regions = [{ id: "iles-brisees", name: "Îles Brisées" }];
        const added = await updateMap(output, { operation: "add", input: source, id: "iles-brisees/lumerive",
            name: "Lumerive", regions, group: "Lumerive" });
        const oldBytes = await fs.readFile(path.join(output, "world", "old", "image.webp"));
        expect((await loadCatalog(output)).maps[0]).toEqual(catalog.maps[0]);
        const newSource = path.join(root, "new-name.png");
        await sharp({ create: { width: 15, height: 12, channels: 3, background: "red" } }).png().toFile(newSource);
        await fs.unlink(source);
        const updated = await updateMap(output, { operation: "replace", input: newSource, id: added.map.id });
        expect([updated.map.id, updated.map.name, updated.map.group, updated.map.regions]).toEqual([
            "iles-brisees/lumerive", "Lumerive", "Lumerive", regions,
        ]);
        expect(updated.oldUrl).toBe(added.map.pages[0].url);
        expect(await fs.readFile(path.join(output, "world", "old", "image.webp"))).toEqual(oldBytes);
        await fs.access(path.join(output, ...updated.oldUrl.split("/")));
        expect((await loadCatalog(output)).maps).toHaveLength(2);
        await expect(updateMap(output, { operation: "add", input: newSource, id: added.map.id, name: "Collision", regions }))
            .rejects.toThrow("Identifiant déjà utilisé");
    });

    it("blocks missing other outputs and supports repairing a damaged replaced map without deleting it", async () => {
        const { output, source } = await fixture();
        const added = await updateMap(output, { operation: "add", input: source, id: "second", name: "Second", regions: [] });
        const image = path.join(output, ...added.map.pages[0].url.split("/"));
        await fs.writeFile(image, "damaged");
        const repaired = await updateMap(output, { operation: "replace", input: source, id: "second" });
        expect(repaired.map.pages[0].url).not.toBe(added.map.pages[0].url);
        expect(await fs.readFile(image, "utf8")).toBe("damaged");
        const catalog = await loadCatalog(output);
        await fs.unlink(path.join(output, "world", "old", "image.webp"));
        await expect(verifyAssets(output, catalog)).rejects.toThrow();
        await expect(updateMap(output, { operation: "replace", input: source, id: "second" })).rejects.toThrow();
        expect(await loadCatalog(output)).toEqual(catalog);
    });

    it("guides creation with normalized IDs and rejects collisions", async () => {
        expect(slugify("Îles Brisées – Cœur d'Ægir")).toBe("iles-brisees-coeur-d-aegir");
        const { output, source } = await fixture();
        const answers = [
            { operation: "add" }, { regionChoice: "__new__" }, { parent: "" }, { name: "Îles Brisées" },
            { regionId: "iles-brisees" }, { name: "L'été" }, { mapId: "l-ete" }, { groupChoice: "__new__" },
            { group: "Lumerive" }, { input: source }, { confirmed: true },
        ];
        const prompt = async ([question]) => {
            if (question.name === "regionId") expect(question.default).toBe("iles-brisees");
            if (question.name === "mapId") {
                expect(question.default).toBe("l-ete");
                expect(question.validate("world")).toBe(true);
            }
            return answers.shift();
        };
        await runAssistant(output, prompt, () => {});
        const added = (await loadCatalog(output)).maps[1];
        expect([added.id, added.name, added.group]).toEqual(["iles-brisees/l-ete", "L'été", "Lumerive"]);
        expect(answers).toHaveLength(0);
    });

    it("runs the real prompts and rejects a duplicate generated ID", async () => {
        const { output, source } = await fixture();
        const input = new PassThrough();
        const outputStream = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
        const realPrompt = inquirer.createPromptModule({ input, output: outputStream });
        const answers = ["\n", "\n", "World\n", "world\n", "\x15autre-carte\n", "\n", `${source}\n`, "y\n"];
        let index = 0;
        const prompt = questions => {
            const result = realPrompt(questions);
            const send = () => input.write(answers[index++]);
            setTimeout(send, 80);
            if (questions[0].name === "mapId") setTimeout(send, 200);
            return result;
        };
        try {
            await runAssistant(output, prompt, () => {});
        } finally {
            input.destroy();
            outputStream.destroy();
        }
        expect((await loadCatalog(output)).maps.map(map => map.id)).toEqual(["world", "autre-carte"]);
    });

    it("updates the world cover when replacing its map", async () => {
        const { root, output } = await fixture();
        const input = path.join(root, "new.png");
        await sharp({ create: { width: 40, height: 20, channels: 3, background: "red" } }).png().toFile(input);
        const result = await updateMap(output, { operation: "replace", input, id: "world" });
        const cover = await fs.readFile(path.join(output, "cover.webp"));
        expect(cover).toEqual(await fs.readFile(path.join(output, ...result.map.pages[0].thumbnail.split("/"))));
        expect(result.map.conversion.sha256).toMatch(/^[a-f0-9]{64}$/);
        const again = await updateMap(output, { operation: "replace", input, id: "world" });
        expect(again.map.pages[0].url).toBe(result.map.pages[0].url);
    });

    it("detects a missing tile in an existing pyramid", async () => {
        const { output, source } = await fixture();
        const tiled = path.join(output, "tiled", "revision");
        const details = await convertImage(source, tiled, 1);
        const catalog = await loadCatalog(output);
        catalog.maps.push({ id: "tiled", name: "Tiled", regions: [], source: "source.png", pages: [{
            ...details, page: 1, url: "tiled/revision/tiles.dzi", thumbnail: "tiled/revision/thumbnail.webp",
        }] });
        await verifyAssets(output, catalog);
        await fs.unlink(path.join(tiled, "tiles_files", "0", "0_0.webp"));
        await expect(verifyAssets(output, catalog)).rejects.toThrow();
    });

    it("replaces a selected map through the interactive prompts", async () => {
        const { root, output } = await fixture();
        const source = path.join(root, "replacement.png");
        await sharp({ create: { width: 15, height: 15, channels: 3, background: "red" } }).png().toFile(source);
        const input = new PassThrough();
        const outputStream = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
        const realPrompt = inquirer.createPromptModule({ input, output: outputStream });
        const answers = ["\x1b[B\n", "\n", `${source}\n`, "y\n"];
        let index = 0;
        const prompt = questions => {
            const result = realPrompt(questions);
            setTimeout(() => input.write(answers[index++]), 80);
            return result;
        };
        try {
            await runAssistant(output, prompt, () => {});
        } finally {
            input.destroy();
            outputStream.destroy();
        }
        const catalog = await loadCatalog(output);
        expect(catalog.maps).toHaveLength(1);
        expect([catalog.maps[0].id, catalog.maps[0].source]).toEqual(["world", "replacement.png"]);
        await fs.access(path.join(output, "world", "old", "image.webp"));
    });
});
