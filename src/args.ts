import type { OutputFormat } from "./types.js";

export interface ParsedArgs {
  command: "scan" | "scripts" | "help" | "version";
  target: string;
  format: OutputFormat;
  task?: string;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const [rawCommand, ...rest] = argv;
  const command = normalizeCommand(rawCommand);
  const parsed: ParsedArgs = { command, target: ".", format: "markdown" };

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "--format") {
      parsed.format = parseFormat(requiredValue(rest, index, "--format"));
      index += 1;
    } else if (arg.startsWith("--format=")) {
      parsed.format = parseFormat(arg.slice("--format=".length));
    } else if (arg === "--task") {
      parsed.task = requiredValue(rest, index, "--task");
      index += 1;
    } else if (arg.startsWith("--task=")) {
      parsed.task = arg.slice("--task=".length);
    } else if (arg === "--help" || arg === "-h") {
      parsed.command = "help";
    } else if (arg === "--version" || arg === "-v") {
      parsed.command = "version";
    } else if (!arg.startsWith("-")) {
      parsed.target = arg;
    } else {
      throw new Error("Unknown option: " + arg);
    }
  }

  return parsed;
}

function normalizeCommand(command: string | undefined): ParsedArgs["command"] {
  if (!command || command === "--help" || command === "-h") return "help";
  if (command === "--version" || command === "-v") return "version";
  if (command === "scan" || command === "scripts") return command;
  throw new Error("Unknown command: " + command);
}

function parseFormat(value: string): OutputFormat {
  if (value === "markdown" || value === "json") return value;
  throw new Error("Unsupported format: " + value);
}

function requiredValue(args: string[], index: number, option: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(option + " requires a value");
  }
  return value;
}
