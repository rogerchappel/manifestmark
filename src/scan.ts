import { resolve } from "node:path";
import { findPackageJsonFiles } from "./walk.js";
import { readManifest } from "./manifest.js";
import { packageIssues, requiredMetadataIssues } from "./issues.js";
import { summarizePackage } from "./package-summary.js";
import { summarizeWorkspace, workspaceIssues } from "./workspace.js";
import type { PackageManifest, ScanOptions, ScanResult } from "./types.js";

export async function scan(target: string, options: ScanOptions = {}): Promise<ScanResult> {
  const root = resolve(options.cwd ?? process.cwd(), target);
  const paths = await findPackageJsonFiles(root);
  const manifests: Array<{ path: string; manifest: PackageManifest }> = [];

  for (const path of paths) {
    manifests.push({ path, manifest: await readManifest(path) });
  }

  const packages = await Promise.all(
    manifests.map((entry) => summarizePackage(root, entry.path, entry.manifest))
  );

  const issues = packages.flatMap((pkg, index) => [
    ...requiredMetadataIssues(pkg, Boolean(manifests[index].manifest.license), Boolean(manifests[index].manifest.repository)),
    ...packageIssues(pkg)
  ]);

  const workspace = summarizeWorkspace(root, manifests, packages);
  issues.push(...workspaceIssues(workspace));

  for (const pkg of packages) {
    pkg.issueIds = issues
      .filter((issue) => issue.packagePath === pkg.path)
      .map((issue) => issue.id);
  }

  return {
    root,
    packageCount: packages.length,
    packages,
    issues,
    workspace
  };
}
