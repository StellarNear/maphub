import { spawnSync } from "node:child_process";
import process from "node:process";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

function loadConfig(basePath) {
    const env = { ...process.env };
    if (basePath === undefined) delete env.SITE_BASE_PATH;
    else env.SITE_BASE_PATH = basePath;

    return spawnSync(process.execPath, [
        "--input-type=module",
        "-e",
        `import { PAGES } from "./pages.config.mjs";
         import { TAGS } from "./static.config.mjs";
         console.log(JSON.stringify({ base: TAGS.BASE_PATH, routes: PAGES.mfcg.embedParameters.routes }));`,
    ], { cwd: process.cwd(), env, encoding: "utf8" });
}

describe("site base path", () => {
    it.each([
        [undefined, "/"],
        ["/suriel/", "/suriel/"],
    ])("generates local routes under the configured base", (input, expected) => {
        const result = loadConfig(input);
        expect(result.status, result.stderr).toBe(0);
        const config = JSON.parse(result.stdout);
        expect(config.base).toBe(expected);
        expect(config.routes.homepage.url).toBe(expected);
        for (const page of ["cave", "dwellings", "mfcg", "village", "viewer"]) {
            expect(config.routes[page].url).toBe(`${expected}to/${page}/`);
        }
    });

    describe("map asset caching", () => {
        it("leaves all map assets outside the unbounded service-worker caches", () => {
            const handlers = {};
            const source = readFileSync(new URL("../../public/sw.js", import.meta.url), "utf8")
                .replaceAll("{{BASE_PATH}}", "/suriel/")
                .replace("{{PAGES_ARR}}", "[]");
            runInNewContext(source, {
                URL,
                self: {
                    location: { origin: "https://example.test" },
                    addEventListener(name, callback) { handlers[name] = callback; },
                },
            });
            for (const asset of ["catalog.json", "map/image.webp", "map/tiles.dzi", "map/tiles_files/4/0_0.webp"]) {
                let intercepted = false;
                handlers.fetch({
                    request: { method: "GET", url: `https://example.test/suriel/maps_converted/${asset}` },
                    respondWith() { intercepted = true; },
                });
                expect(intercepted).toBe(false);
            }
        });
    });

    it("rejects malformed base paths", () => {
        const result = loadConfig("/suriel");
        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain("SITE_BASE_PATH must be an absolute path ending in /");
    });
});
