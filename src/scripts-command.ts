import type { ScanResult } from "./types.js";

export function renderScripts(result: ScanResult, task?: string): string {
  const tick = String.fromCharCode(96);
  const lines: string[] = [];
  lines.push("# ManifestMark Scripts", "");

  for (const pkg of result.packages) {
    const scripts = task ? pkg.scripts.filter((script) => script.name === task) : pkg.scripts;
    if (!scripts.length) {
      continue;
    }

    lines.push("## " + pkg.name, "");
    lines.push("Path: " + tick + pkg.path + tick, "");
    for (const script of scripts) {
      lines.push("- " + tick + script.name + tick + ": " + tick + script.command + tick);
    }
    lines.push("");
  }

  if (lines.length === 2) {
    lines.push(task ? "No matching " + tick + task + tick + " scripts found." : "No scripts found.", "");
  }

  return lines.join("\n").trimEnd() + "\n";
}
