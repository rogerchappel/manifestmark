import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scan } from "./scan.js";

describe("scan", () => {
  it("summarizes a single package fixture", async () => {
    const result = await scan("fixtures/single-package");

    assert.equal(result.packageCount, 1);
    assert.equal(result.packages[0].name, "single-fixture");
    assert.equal(result.packages[0].path, "package.json");
    assert.equal(result.issues.length, 0);
  });

  it("flags workspace inconsistencies and missing script files", async () => {
    const result = await scan("fixtures/workspace");
    const issueIds = result.issues.map((issue) => issue.id);

    assert.equal(result.packageCount, 3);
    assert.deepEqual(
      result.packages.map((pkg) => pkg.path),
      [
        "package.json",
        "packages/api/package.json",
        "packages/web/package.json"
      ]
    );
    assert.equal(result.workspace.detected, true);
    assert.ok(issueIds.includes("missing-script-file"));
    assert.ok(issueIds.includes("inconsistent-package-manager"));
    assert.ok(issueIds.includes("inconsistent-engine"));
    assert.ok(issueIds.includes("broad-dependency-range"));
  });

  it("supports object workspace patterns", async () => {
    const result = await scan("fixtures/object-workspace");

    assert.deepEqual(
      result.packages.map((pkg) => pkg.path),
      [
        "modules/core/package.json",
        "package.json"
      ]
    );
  });

  it("recursively discovers packages when the target has no root manifest", async () => {
    const result = await scan("fixtures/manifest-set");

    assert.deepEqual(
      result.packages.map((pkg) => pkg.path),
      [
        "one/package.json",
        "two/package.json"
      ]
    );
  });
});
