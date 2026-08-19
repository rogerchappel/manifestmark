import { access } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { ScriptSummary } from "./types.js";

const RUNNERS = new Set(["node", "tsx", "ts-node", "bash", "sh", "source"]);
const OPTIONS_WITH_VALUES = new Set(["--require", "-r", "--loader", "--import", "--conditions", "--env-file", "--inspect-port", "--title", "--tsconfig"]);
const LOCAL_PATH = /^(?:\.\.?\/|scripts\/|bin\/)/;

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
  const tokens = shellTokens(command);

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.startsWith("./")) refs.add(token.slice(2));
    if (!RUNNERS.has(token)) continue;

    for (index += 1; index < tokens.length; index += 1) {
      const candidate = tokens[index];
      if (["&&", "||", ";", "|"].includes(candidate)) {
        index -= 1;
        break;
      }
      if (candidate === "--") continue;
      if (candidate.startsWith("-")) {
        if (!candidate.includes("=") && OPTIONS_WITH_VALUES.has(candidate)) index += 1;
        continue;
      }
      if (LOCAL_PATH.test(candidate)) refs.add(candidate.replace(/^\.\//, ""));
      break;
    }
  }
  return [...refs].sort();
}

function shellTokens(command: string): string[] {
  const tokens: string[] = [];
  const pattern = /"((?:\\.|[^"\\])*)"|'([^']*)'|(&&|\|\||[;|])|([^\s;&|]+)/g;
  for (const match of command.matchAll(pattern)) {
    tokens.push(match[1] ?? match[2] ?? match[3] ?? match[4]);
  }
  return tokens;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
