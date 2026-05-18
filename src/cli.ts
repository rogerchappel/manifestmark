#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./args.js";
import { renderResult, scan } from "./index.js";
import { helpText } from "./help.js";
import { renderScripts } from "./scripts-command.js";

async function main(argv: string[]): Promise<number> {
  const args = parseArgs(argv);

  if (args.command === "help") {
    process.stdout.write(helpText());
    return 0;
  }

  if (args.command === "version") {
    process.stdout.write((await packageVersion()) + "\n");
    return 0;
  }

  const result = await scan(args.target);
  if (args.command === "scripts") {
    process.stdout.write(renderScripts(result, args.task));
    return 0;
  }

  process.stdout.write(renderResult(result, args.format));
  return result.issues.some((issue) => issue.severity === "error") ? 1 : 0;
}

async function packageVersion(): Promise<string> {
  const cliDir = dirname(fileURLToPath(import.meta.url));
  const raw = await readFile(join(cliDir, "../package.json"), "utf8");
  return JSON.parse(raw).version;
}

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    process.stderr.write((error instanceof Error ? error.message : String(error)) + "\n");
    process.exitCode = 1;
  }
);
