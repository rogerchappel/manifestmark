import assert from "node:assert/strict";
import { mkdtemp, mkdir, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { it } from "node:test";
import { findPackageJsonFiles } from "./walk.js";

async function withTempDir(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "manifestmark-walk-"));
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function supportsSymlinks(root: string): Promise<boolean> {
  const target = join(root, "symlink-target");
  await mkdir(target);
  try {
    await symlink(target, join(root, "symlink-probe"), "dir");
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM" || (error as NodeJS.ErrnoException).code === "ENOTSUP") {
      return false;
    }
    throw error;
  }
}

it("ignores symlinked package manifests and does not traverse directory symlinks", async (t) => {
  await withTempDir(async (root) => {
    if (!(await supportsSymlinks(root))) {
      t.skip("symlinks are not supported by this platform or filesystem");
      return;
    }
    const outside = join(root, "outside");
    const inside = join(root, "inside");
    await mkdir(outside);
    await mkdir(inside);
    await writeFile(join(outside, "package.json"), JSON.stringify({ name: "outside" }));
    await writeFile(join(inside, "package.json"), JSON.stringify({ name: "inside" }));
    await symlink(join(outside, "package.json"), join(inside, "linked-package.json"));
    await symlink(outside, join(inside, "linked-directory"), "dir");

    const found = await findPackageJsonFiles(inside);
    assert.deepEqual(found, [join(inside, "package.json")]);
    assert.deepEqual(await readdir(inside), ["linked-directory", "linked-package.json", "package.json"]);
  });
});
