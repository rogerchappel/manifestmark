import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { referencedLocalFiles } from "./scripts.js";

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
});
