import { readFile } from "node:fs/promises";

const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;
const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const expected = `v${manifest.version}`;

if (!tag) {
  console.error(`Release tag is required; expected ${expected}.`);
  process.exit(1);
}

if (tag !== expected) {
  console.error(`Release tag ${tag} does not match package version ${manifest.version}; expected ${expected}.`);
  process.exit(1);
}

console.log(`Release tag ${tag} matches package version ${manifest.version}.`);
