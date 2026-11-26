import process from "node:process";

const basePath = process.env.SITE_BASE_PATH || "/";

if (!/^\/(?:[a-zA-Z0-9._~-]+\/)*$/.test(basePath)) {
    throw new Error("SITE_BASE_PATH must be an absolute path ending in /.");
}

export const BASE_PATH = basePath;
