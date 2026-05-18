import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseArgs } from "./args.js";

describe("parseArgs", () => {
  it("parses scan json target", () => {
    assert.deepEqual(parseArgs(["scan", "fixtures/workspace", "--format", "json"]), {
      command: "scan",
      target: "fixtures/workspace",
      format: "json"
    });
  });

  it("parses scripts task", () => {
    assert.deepEqual(parseArgs(["scripts", ".", "--task=test"]), {
      command: "scripts",
      target: ".",
      format: "markdown",
      task: "test"
    });
  });
});
