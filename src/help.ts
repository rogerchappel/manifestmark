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
    "  manifestmark scripts . --task test"
  ].join("\n") + "\n";
}
