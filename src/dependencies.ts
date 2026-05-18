import type { DependencySummary, PackageManifest } from "./types.js";

const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
] as const;

type DependencyField = (typeof DEPENDENCY_FIELDS)[number];

export function summarizeDependencies(manifest: PackageManifest): DependencySummary[] {
  const summaries: DependencySummary[] = [];

  for (const kind of DEPENDENCY_FIELDS) {
    const dependencies = manifest[kind];
    if (!dependencies) {
      continue;
    }

    for (const [name, range] of Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b))) {
      summaries.push({
        name,
        range,
        kind: kind as DependencyField,
        broad: isBroadRange(range)
      });
    }
  }

  return summaries;
}

export function isBroadRange(range: string): boolean {
  const trimmed = range.trim();
  return trimmed === "*" || trimmed === "latest" || trimmed === "" || /^[xX](\.x)?$/.test(trimmed);
}
