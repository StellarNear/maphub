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
        expect(app.surielTranslateMenu("New city")).toBe("Nouvelle ville");
        expect(app.surielTranslateMenu("PROTO")).toBe("PROTO");
        expect(app.surielDistrictNoun("quarter")).toBe("quartier");
    });

    it("uses the saved language unless a query explicitly overrides it", () => {
        expect(controls("", "en").surielTranslateMenu("New city")).toBe("New city");
        expect(controls("?lang=fr", "en").surielTranslateMenu("New city")).toBe("Nouvelle ville");
        expect(controls("?lang=en", "fr").surielDistrictNoun("quarter")).toBe("quarter");
    });

    it("ignores unsupported languages and falls back to a supported preference or French", () => {
        expect(controls("", "it").surielTranslateMenu("New city")).toBe("Nouvelle ville");
        expect(controls("?lang=zh", "en").surielTranslateMenu("New city")).toBe("New city");
        expect(controls("?lang=pt", "uk").surielTranslateMenu("New city")).toBe("Nouvelle ville");
    });

    it("keeps the language when a generator rewrites its URL", () => {
        const app = controls("?lang=en", "fr");
        app.location.search = "?seed=42";
        expect(app.surielTranslateMenu("New city")).toBe("New city");
    });

    it("uses French grammar for new districts but retains the original grammar in English", () => {
        const english = { city: ["original"], centralDistrict: ["old #districtNoun#"] };
        expect(controls("?lang=en").surielCityGrammar(english)).toBe(english);
        expect(english.centralDistrict[0]).toBe("old #districtNoun#");

        const french = controls("?lang=fr").surielCityGrammar({ city: ["original"] });
        expect(french.centralDistrict).toContain("vieux #districtNoun#");
        expect(french.north).toBe("nord");
    });

    it("translates rooms and navigation labels without changing English abbreviations", () => {
        const fr = controls("?lang=fr");
        const en = controls("?lang=en");
        expect(fr.surielRoomName("workshop")).toBe("atelier");
        expect(fr.surielRoomName("La chambre de Jeanne")).toBe("La chambre de Jeanne");
        expect(fr.surielFloorLabel(-1, 2)).toBe("Sous-sol");
        expect(fr.surielFloorLabel(1, 2)).toBe("1er");
        expect(fr.surielSideLabel("F")).toBe("Devant");
        expect(fr.surielModeLabel("E")).toBe("Façade");
        expect(en.surielRoomShort("bathroom", "BTH")).toBe("BTH");
        expect(en.surielFloorLabel(1, 2)).toBe("1F");
        expect(en.surielSideLabel("F")).toBe("F");
    });

    it("uses French naming rules only when French is selected", () => {
        for (const [method, key] of [
            ["surielVillageGrammar", "village"],
            ["surielDwellingGrammar", "title"],
            ["surielCaveGrammar", "name"],
        ]) {
            const original = { [key]: "original" };
            expect(controls("?lang=en")[method](original)).toBe(original);
            expect(original[key]).toBe("original");
            expect(controls("?lang=fr")[method]({ [key]: "original" })[key]).not.toBe("original");
        }
    });

    it("requires confirmation before returning and provides no child language selector", () => {
        const app = controls();
        const container = { children: [], appendChild(element) { this.children.push(element); } };
        app.document = {
            documentElement: {},
            createElement(tag) {
                return {
                    tag, children: [], events: {},
                    appendChild(element) { this.children.push(element); },
                    setAttribute() {},
                    addEventListener(event, callback) { this.events[event] = callback; },
                };
            },
            getElementById: () => container,
        };
        let destination;
        app.location.assign = (url) => { destination = url; };
        app.confirm = () => false;
        app.surielAddControls();
        const buttons = container.children[0].children;
        expect(buttons.map((element) => element.tag)).toEqual(["button", "button"]);
        buttons[0].events.click();
        expect(destination).toBeUndefined();
        app.confirm = () => true;
        buttons[0].events.click();
        expect(destination).toBe("/");
    });
});
