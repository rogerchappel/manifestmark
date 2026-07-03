#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d "/tmp/manifestmark-demo.XXXXXX")"
trap 'rm -rf "$tmp_dir"' EXIT

cd "$repo_root"
npm run build >/dev/null

node dist/cli.js scan fixtures/single-package >"$tmp_dir/single-package.md"
grep -q "No issues found" "$tmp_dir/single-package.md"

set +e
node dist/cli.js scan fixtures/workspace --format json >"$tmp_dir/workspace.json"
workspace_status=$?
set -e
test "$workspace_status" -eq 1

node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!data.issues.some((issue) => issue.id === 'missing-script-file')) process.exit(1);" "$tmp_dir/workspace.json"

node dist/cli.js scripts fixtures/workspace --task test >"$tmp_dir/workspace-scripts.md"
grep -q "pnpm -r test" "$tmp_dir/workspace-scripts.md"

echo "Clean package report: $tmp_dir/single-package.md"
echo "Workspace JSON:       $tmp_dir/workspace.json"
echo "Workspace scripts:    $tmp_dir/workspace-scripts.md"
