#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="${1:-"$repo_root/.manifestmark-script-inventory"}"

cd "$repo_root"
npm run build >/dev/null
mkdir -p "$out_dir"

node dist/cli.js scripts fixtures/single-package --task build >"$out_dir/single-build.md"
node dist/cli.js scripts fixtures/single-package --task test >"$out_dir/single-test.md"
node dist/cli.js scripts fixtures/workspace --task test >"$out_dir/workspace-test.md"

grep -q "node scripts/build.js" "$out_dir/single-build.md"
grep -q "node --test" "$out_dir/single-test.md"
grep -q "pnpm -r test" "$out_dir/workspace-test.md"

echo "manifestmark script inventory wrote $out_dir"
