import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { shouldSkipDir } from "./ignore.js";

export async function findPackageJsonFiles(root: string): Promise<string[]> {
  const found: string[] = [];

  async function visit(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!shouldSkipDir(entry.name)) {
          await visit(join(dir, entry.name));
        }
        continue;
      }

      if (entry.isFile() && entry.name === "package.json") {
        found.push(join(dir, entry.name));
      }
    }
  }

  await visit(root);
  return found.sort();
}
