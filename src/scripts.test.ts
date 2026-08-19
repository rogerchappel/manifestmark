import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { referencedLocalFiles, summarizeScripts } from "./scripts.js";

describe("script summaries", () => {
  it("extracts local files from common script commands", () => {
    assert.deepEqual(referencedLocalFiles("node scripts/build.js && bash ./bin/check.sh"), [
      "bin/check.sh",
      "scripts/build.js"
    ]);
  });

  it("ignores package binaries", () => {
    assert.deepEqual(referencedLocalFiles("vitest run && tsc -p tsconfig.json"), []);
  });

  it("extracts quoted entrypoints and entrypoints after runner options", () => {
    const cases = new Map([
      ["node --enable-source-maps scripts/missing.js", "scripts/missing.js"],
      ['node "scripts/missing.js"', "scripts/missing.js"],
      ["tsx --tsconfig tsconfig.json scripts/missing.ts", "scripts/missing.ts"],
      ["bash -e scripts/missing.sh", "scripts/missing.sh"]
    ]);

    for (const [command, expected] of cases) {
      assert.deepEqual(referencedLocalFiles(command), [expected]);
    }
  });

  it("surfaces option-following entrypoints as missing local files", async () => {
    const summaries = await summarizeScripts("/manifestmark-fixture/package.json", {
      node: "node --enable-source-maps scripts/missing.js",
      quoted: 'node "scripts/missing.js"',
      tsx: "tsx --tsconfig tsconfig.json scripts/missing.ts",
      shell: "bash -e scripts/missing.sh"
    });

    assert.deepEqual(summaries.map(({ name, missingLocalFiles }) => [name, missingLocalFiles]), [
      ["node", ["scripts/missing.js"]],
      ["quoted", ["scripts/missing.js"]],
      ["shell", ["scripts/missing.sh"]],
      ["tsx", ["scripts/missing.ts"]]
    ]);
  });
});
