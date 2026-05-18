import { access } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { ScriptSummary } from "./types.js";

const LOCAL_FILE_TOKEN = /(?:^|\s)(?:node|tsx|ts-node|bash|sh|source|\.\/)\s+((?:\.\.?\/|scripts\/|bin\/)[^\s;&|]+)/g;

export async function summarizeScripts(
  manifestPath: string,
  scripts: Record<string, string> | undefined
): Promise<ScriptSummary[]> {
  if (!scripts) {
    return [];
  }

  const packageDir = dirname(manifestPath);
  const summaries: ScriptSummary[] = [];

  for (const [name, command] of Object.entries(scripts).sort(([a], [b]) => a.localeCompare(b))) {
    const refs = referencedLocalFiles(command);
    const missingLocalFiles: string[] = [];

    for (const ref of refs) {
      if (!(await fileExists(join(packageDir, ref)))) {
        missingLocalFiles.push(ref);
      }
    }

    summaries.push({ name, command, missingLocalFiles });
  }

  return summaries;
}

export function referencedLocalFiles(command: string): string[] {
  const refs = new Set<string>();
  for (const match of command.matchAll(LOCAL_FILE_TOKEN)) {
    refs.add(match[1].replace(/^\.\//, ""));
  }
  return [...refs].sort();
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
