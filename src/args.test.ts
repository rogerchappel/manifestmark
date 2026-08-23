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

  it("rejects multiple positional targets", () => {
    assert.throws(
      () => parseArgs(["scan", "first", "second"]),
      /Only one target path may be provided/
    );
  });

  it("rejects task filtering for scan", () => {
    assert.throws(
      () => parseArgs(["scan", ".", "--task", "test"]),
      /--task is only supported by the scripts command/
    );
  });

  it("rejects output formatting for scripts", () => {
    assert.throws(
      () => parseArgs(["scripts", ".", "--format", "json"]),
      /--format is only supported by the scan command/
    );
  });

  it("rejects an empty inline task", () => {
    assert.throws(() => parseArgs(["scripts", ".", "--task="]), /--task requires a value/);
  });
});
