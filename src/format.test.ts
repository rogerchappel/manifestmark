import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderResult } from "./format/index.js";
import { scan } from "./scan.js";

describe("formatters", () => {
  it("renders markdown report headings", async () => {
    const report = renderResult(await scan("fixtures/single-package"), "markdown");
    assert.match(report, /# ManifestMark Report/);
    assert.match(report, /single-fixture/);
  });

  it("renders parseable json reports", async () => {
    const report = renderResult(await scan("fixtures/workspace"), "json");
    const parsed = JSON.parse(report);
    assert.equal(parsed.packageCount, 3);
  });
});
