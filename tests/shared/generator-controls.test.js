import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const script = readFileSync(new URL("../../public/js/generator-controls.js", import.meta.url), "utf8");

function controls(search = "", saved = null) {
    const context = {
        URLSearchParams,
        location: { search },
        localStorage: { getItem: () => saved },
        console,
    };
    runInNewContext(script, context);
    return context;
}

describe("generator language", () => {
    it("defaults to French and translates menu captions without changing unknown values", () => {
        const app = controls();
        expect(app.mapHubTranslateMenu("New city")).toBe("Nouvelle ville");
        expect(app.mapHubTranslateMenu("PROTO")).toBe("PROTO");
        expect(app.mapHubDistrictNoun("quarter")).toBe("quartier");
    });

    it("uses the saved language unless a query explicitly overrides it", () => {
        expect(controls("", "en").mapHubTranslateMenu("New city")).toBe("New city");
        expect(controls("?lang=fr", "en").mapHubTranslateMenu("New city")).toBe("Nouvelle ville");
        expect(controls("?lang=en", "fr").mapHubDistrictNoun("quarter")).toBe("quarter");
    });

    it("keeps the language when a generator rewrites its URL", () => {
        const app = controls("?lang=en", "fr");
        app.location.search = "?seed=42";
        expect(app.mapHubTranslateMenu("New city")).toBe("New city");
    });

    it("uses French grammar for new districts but retains the original grammar in English", () => {
        const english = { city: ["original"], centralDistrict: ["old #districtNoun#"] };
        expect(controls("?lang=en").mapHubCityGrammar(english)).toBe(english);
        expect(english.centralDistrict[0]).toBe("old #districtNoun#");

        const french = controls("?lang=fr").mapHubCityGrammar({ city: ["original"] });
        expect(french.centralDistrict).toContain("vieux #districtNoun#");
        expect(french.north).toBe("nord");
    });
});
