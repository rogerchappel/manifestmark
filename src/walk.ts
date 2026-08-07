import { readFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { shouldSkipDir } from "./ignore.js";
import { workspacePatterns } from "./manifest.js";
import type { PackageManifest } from "./types.js";

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
  const rootPackage = found.find((path) => relative(root, path) === "package.json");
  if (!rootPackage) {
    return found.sort();
  }

  const manifest = JSON.parse(await readFile(rootPackage, "utf8")) as PackageManifest;
  const patterns = workspacePatterns(manifest);
  if (patterns.length === 0) {
    return [rootPackage];
  }

  return found
    .filter((path) => path === rootPackage || matchesWorkspace(root, path, patterns))
    .sort();
}

function matchesWorkspace(root: string, manifestPath: string, patterns: string[]): boolean {
  const packageDir = relative(root, manifestPath)
    .split(sep)
    .slice(0, -1)
    .join("/");
  const included = patterns
    .filter((pattern) => !pattern.startsWith("!"))
    .some((pattern) => globMatcher(pattern).test(packageDir));
  const excluded = patterns
    .filter((pattern) => pattern.startsWith("!"))
    .some((pattern) => globMatcher(pattern.slice(1)).test(packageDir));

  return included && !excluded;
}

function globMatcher(pattern: string): RegExp {
  const normalized = pattern
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/\/+$/, "");
  const expanded = expandBraces(normalized);

  return new RegExp(`^(?:${expanded.map(globSource).join("|")})$`);
}

function globSource(pattern: string): string {
  let source = "";

  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === "*" && pattern[index + 1] === "*") {
      if (pattern[index + 2] === "/") {
        source += "(?:.*/)?";
        index += 2;
      } else {
        source += ".*";
        index += 1;
      }
    } else if (char === "*") {
      source += "[^/]*";
    } else if (char === "?") {
      source += "[^/]";
    } else {
      source += char.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    }
  }

  return source;
}

function expandBraces(pattern: string): string[] {
  const opening = pattern.indexOf("{");
  if (opening === -1) {
    return [pattern];
  }

  let depth = 0;
  for (let index = opening; index < pattern.length; index += 1) {
    if (pattern[index] === "{") {
      depth += 1;
    } else if (pattern[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        const alternatives = splitBraceAlternatives(pattern.slice(opening + 1, index));
        if (alternatives.length < 2) {
          return [pattern];
        }
        const prefix = pattern.slice(0, opening);
        const suffix = pattern.slice(index + 1);
        return alternatives.flatMap((alternative) => expandBraces(`${prefix}${alternative}${suffix}`));
      }
    }
  }

  return [pattern];
}

function splitBraceAlternatives(value: string): string[] {
  const alternatives: string[] = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "{") {
      depth += 1;
    } else if (value[index] === "}") {
      depth -= 1;
    } else if (value[index] === "," && depth === 0) {
      alternatives.push(value.slice(start, index));
      start = index + 1;
    }
  }

  alternatives.push(value.slice(start));
  return alternatives;
}
