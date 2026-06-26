#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$repo_root"
npm run build >/dev/null

node dist/cli.js scan fixtures/single-package >"$tmp/single-package.md"
grep -q 'No issues found' "$tmp/single-package.md"

set +e
node dist/cli.js scan fixtures/workspace --format json >"$tmp/workspace.json"
workspace_status=$?
set -e

test "$workspace_status" -eq 1
node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!data.issues.some((issue) => issue.id === 'missing-script-file' && issue.severity === 'error')) process.exit(1);" "$tmp/workspace.json"

node dist/cli.js scripts fixtures/workspace --task test >"$tmp/workspace-scripts.md"
grep -q 'pnpm -r test' "$tmp/workspace-scripts.md"

echo 'manifestmark smoke passed'
