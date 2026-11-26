import { createRequire } from "node:module";
import { BASE_PATH } from "./site.config.mjs";
const require = createRequire(import.meta.url);

const pkg = require("./package.json");


export const TAGS = {
    "BASE_PATH": BASE_PATH,
    "AZGAAR_ARMORIA": "https://azgaar.github.io/Armoria",
    "AZGAAR_ARMORIA_PUBLIC": "https://armoria.herokuapp.com",
    "AZGAAR_FMG": "https://azgaar.github.io/Fantasy-Map-Generator/",

    "NAME_SHORT": pkg.name,
    "NAME_FULL": pkg.name_full,
    "VERSION": pkg.version,
    "DESCRIPTION": pkg.description,
    "LICENSE": pkg.license,
    "HOMEPAGE": pkg.homepage,
    "GITHUB": pkg.github,
    "PRIMARY_SOURCE": pkg.primary_source,

    "STYLE_COLOR_BACKGROUND": "#0b0f14",
    "STYLE_COLOR_THEME": "#0b0f14",

    "LOCALSTORAGE_TOWN_BUF": "_toy_town_buf_",
};
