import { readFile } from "node:fs/promises";
import type { PackageManifest } from "./types.js";

export async function readManifest(path: string): Promise<PackageManifest> {
  const raw = await readFile(path, "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Expected object package manifest at ${path}`);
  }

  return parsed as PackageManifest;
}

export function workspacePatterns(manifest: PackageManifest): string[] {
  if (Array.isArray(manifest.workspaces)) {
    return manifest.workspaces;
  }

  if (manifest.workspaces && Array.isArray(manifest.workspaces.packages)) {
    return manifest.workspaces.packages;
  }

  return [];
}
