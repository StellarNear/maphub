import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const source = path.dirname(require.resolve("openseadragon"));
const destination = new URL("../dist/vendor/openseadragon/", import.meta.url);
await fs.mkdir(destination, { recursive: true });
await fs.copyFile(path.join(source, "openseadragon.min.js"), new URL("openseadragon.min.js", destination));
await fs.copyFile(path.resolve(source, "..", "..", "LICENSE.txt"), new URL("LICENSE.txt", destination));
