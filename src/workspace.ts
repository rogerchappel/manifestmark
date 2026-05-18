import { relative } from "node:path";
import { workspacePatterns } from "./manifest.js";
import type { PackageManifest, PackageSummary, ScanIssue, ScanResult } from "./types.js";

export function summarizeWorkspace(
  root: string,
  manifests: Array<{ path: string; manifest: PackageManifest }>,
  packages: PackageSummary[]
): ScanResult["workspace"] {
  const rootManifest = manifests.find((entry) => relative(root, entry.path) === "package.json");
  const patterns = rootManifest ? workspacePatterns(rootManifest.manifest) : [];
  const packageManagers = unique(packages.map((pkg) => pkg.packageManager).filter(Boolean) as string[]);
  const engines: Record<string, string[]> = {};

  for (const pkg of packages) {
    for (const [name, range] of Object.entries(pkg.engines)) {
      const key = `${name}@${range}`;
      engines[key] = [...(engines[key] ?? []), pkg.path];
    }
  }

  return {
    detected: patterns.length > 0 || packages.length > 1,
    rootPackage: rootManifest ? "package.json" : undefined,
    patterns,
    packageManagers,
    engines
  };
}

export function workspaceIssues(workspace: ScanResult["workspace"]): ScanIssue[] {
  const issues: ScanIssue[] = [];

  if (workspace.packageManagers.length > 1) {
    issues.push({
      id: "inconsistent-package-manager",
      severity: "warning",
      message: `Workspace declares multiple package managers: ${workspace.packageManagers.join(", ")}.`
    });
  }

  const engineNames = new Map<string, Set<string>>();
  for (const engineKey of Object.keys(workspace.engines)) {
    const [name, range] = splitEngineKey(engineKey);
    const ranges = engineNames.get(name) ?? new Set<string>();
    ranges.add(range);
    engineNames.set(name, ranges);
  }

  for (const [name, ranges] of engineNames) {
    if (ranges.size > 1) {
      issues.push({
        id: "inconsistent-engine",
        severity: "warning",
        message: `Workspace has inconsistent ${name} engine ranges: ${[...ranges].join(", ")}.`
      });
    }
  }

  return issues;
}

function unique(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function splitEngineKey(key: string): [string, string] {
  const index = key.indexOf("@");
  return [key.slice(0, index), key.slice(index + 1)];
}
