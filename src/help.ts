export function helpText(): string {
  return [
    "ManifestMark",
    "",
    "Usage:",
    "  manifestmark scan <path> [--format markdown|json]",
    "  manifestmark scripts <path> [--task <name>]",
    "",
    "Examples:",
    "  manifestmark scan .",
    "  manifestmark scan . --format json",
    "  manifestmark scripts . --task test",
    "",
    "Scan boundaries:",
    "  A root package includes only packages matched by its workspaces patterns.",
    "  A path without a root package.json is searched recursively."
  ].join("\n") + "\n";
}
