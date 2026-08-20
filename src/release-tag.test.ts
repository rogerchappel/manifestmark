import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = new URL("../scripts/check-release-tag.mjs", import.meta.url);

test("release tag preflight accepts the package version tag", () => {
  const result = spawnSync(process.execPath, [script.pathname, "v0.1.0"], { encoding: "utf8" });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /v0\.1\.0 matches package version 0\.1\.0/);
});

test("release tag preflight rejects a mismatched tag", () => {
  const result = spawnSync(process.execPath, [script.pathname, "v0.2.0"], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /v0\.2\.0 does not match package version 0\.1\.0/);
});
