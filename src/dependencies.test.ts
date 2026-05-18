import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isBroadRange, summarizeDependencies } from "./dependencies.js";

describe("dependency summaries", () => {
  it("marks wildcard and latest ranges as broad", () => {
    assert.equal(isBroadRange("*"), true);
    assert.equal(isBroadRange("latest"), true);
    assert.equal(isBroadRange("^1.2.3"), false);
  });

  it("keeps dependency kinds in the output", () => {
    const result = summarizeDependencies({
      dependencies: { zod: "^3.0.0" },
      devDependencies: { typescript: "*" }
    });

    assert.deepEqual(result.map((dep) => dep.kind), ["dependencies", "devDependencies"]);
    assert.equal(result[1].broad, true);
  });
});
