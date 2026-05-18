import type { DependencySummary, PackageSummary, ScanResult } from "../types.js";

export function renderMarkdown(result: ScanResult): string {
  const lines: string[] = [];
  lines.push("# ManifestMark Report", "");
  lines.push("Root: " + code(result.root));
  lines.push("Packages: **" + result.packageCount + "**");
  lines.push("Issues: **" + result.issues.length + "**", "");
  lines.push("## Workspace", "");
  lines.push("Detected: " + (result.workspace.detected ? "yes" : "no"));
  lines.push("Patterns: " + (result.workspace.patterns.length ? result.workspace.patterns.map(code).join(", ") : "none"));
  lines.push("Package managers: " + (result.workspace.packageManagers.length ? result.workspace.packageManagers.map(code).join(", ") : "none"), "");
  lines.push("## Packages", "");

  for (const pkg of result.packages) {
    renderPackage(lines, pkg);
  }

  lines.push("## Issues", "");
  if (result.issues.length === 0) {
    lines.push("No issues found.", "");
  } else {
    for (const issue of result.issues) {
      lines.push("- **" + issue.severity + "** " + code(issue.id) + (issue.packagePath ? " in " + code(issue.packagePath) : "") + ": " + issue.message);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function renderPackage(lines: string[], pkg: PackageSummary): void {
  lines.push("### " + pkg.name, "");
  lines.push("Path: " + code(pkg.path));
  if (pkg.version) lines.push("Version: " + code(pkg.version));
  lines.push("Private: " + (pkg.private ? "yes" : "no"));
  if (pkg.packageManager) lines.push("Package manager: " + code(pkg.packageManager));
  if (Object.keys(pkg.engines).length) lines.push("Engines: " + inlineRecord(pkg.engines));
  if (Object.keys(pkg.bin).length) lines.push("Bin: " + inlineRecord(pkg.bin));
  if (Object.keys(pkg.publishConfig).length) lines.push("Publish config: " + inlineRecord(pkg.publishConfig));
  if (pkg.files.length) lines.push("Files: " + pkg.files.map(code).join(", "));
  renderScripts(lines, pkg);
  renderDependencies(lines, pkg.dependencies);
  lines.push("");
}

function renderScripts(lines: string[], pkg: PackageSummary): void {
  if (!pkg.scripts.length) {
    lines.push("Scripts: none");
    return;
  }

  lines.push("Scripts:");
  for (const script of pkg.scripts) {
    const missing = script.missingLocalFiles.length ? " (missing: " + script.missingLocalFiles.map(code).join(", ") + ")" : "";
    lines.push("- " + code(script.name) + ": " + code(script.command) + missing);
  }
}

function renderDependencies(lines: string[], dependencies: DependencySummary[]): void {
  if (!dependencies.length) {
    lines.push("Dependencies: none");
    return;
  }

  lines.push("Dependencies:");
  for (const dependency of dependencies) {
    const broad = dependency.broad ? " broad" : "";
    lines.push("- " + dependency.kind + " " + code(dependency.name) + " " + code(dependency.range) + broad);
  }
}

function inlineRecord(record: Record<string, unknown>): string {
  return Object.entries(record)
    .map(([key, value]) => key + "=" + JSON.stringify(value))
    .map(code)
    .join(", ");
}

function code(value: unknown): string {
  return "`" + String(value).replaceAll("`", "\\`") + "`";
}
