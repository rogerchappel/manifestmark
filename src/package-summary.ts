import { dirname, relative } from "node:path";
import { summarizeDependencies } from "./dependencies.js";
import { summarizeScripts } from "./scripts.js";
import type { PackageManifest, PackageSummary } from "./types.js";

export async function summarizePackage(
  root: string,
  manifestPath: string,
  manifest: PackageManifest
): Promise<PackageSummary> {
  const relativePath = relative(root, manifestPath) || "package.json";
  const relativeDir = dirname(relativePath) === "." ? "." : dirname(relativePath);

  return {
    path: relativePath,
    relativeDir,
    name: manifest.name ?? relativeDir,
    version: manifest.version,
    private: manifest.private === true,
    packageManager: manifest.packageManager,
    engines: manifest.engines ?? {},
    scripts: await summarizeScripts(manifestPath, manifest.scripts),
    bin: normalizeBin(manifest.bin),
    publishConfig: manifest.publishConfig ?? {},
    files: manifest.files ?? [],
    dependencies: summarizeDependencies(manifest),
    issueIds: []
  };
}

export function normalizeBin(bin: PackageManifest["bin"]): Record<string, string> {
  if (!bin) {
    return {};
  }

  if (typeof bin === "string") {
    return { default: bin };
  }

  return bin;
}
