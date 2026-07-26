import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { helpText } from "./help.js";

describe("helpText", () => {
  it("describes package discovery boundaries", () => {
    const help = helpText();

    assert.match(help, /only packages matched by its workspaces patterns/);
    assert.match(help, /without a root package\.json is searched recursively/);
  });
});
