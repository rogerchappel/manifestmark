# ManifestMark Orchestration

ManifestMark is designed as a local briefing command for humans and coding agents before they choose build, test, or release commands.

## Inputs

- A repository or workspace directory.
- Any package.json files under that directory, excluding generated folders such as node_modules, dist, build, coverage, and .git.

## Outputs

- Markdown report for fast terminal review.
- JSON report for agent/tool ingestion.
- Scripts-only report for choosing task commands.

## Recommended Agent Flow

1. Run manifestmark scan .
2. Review issues before running package scripts.
3. Run manifestmark scripts . --task test when selecting test commands.
4. Prefer package-manager and engine metadata from the report over guesses.
5. Treat error-level findings, especially missing script files, as blockers until reviewed.

## Local Verification

- npm test
- npm run check
- npm run smoke
- bash scripts/validate.sh

## Release Notes

The package is local-first and does not install dependencies in scanned repositories. It reads package manifests and local file presence only.
