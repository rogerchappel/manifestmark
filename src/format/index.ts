import { renderJson } from "./json.js";
import { renderMarkdown } from "./markdown.js";
import type { OutputFormat, ScanResult } from "../types.js";

export function renderResult(result: ScanResult, format: OutputFormat): string {
  if (format === "json") {
    return renderJson(result);
  }

  return renderMarkdown(result);
}
