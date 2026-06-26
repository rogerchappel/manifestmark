#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$repo_root"
npm run build >/dev/null
npm pack --dry-run >/dev/null
npm pack --pack-destination "$tmp" >/dev/null

package_tgz="$(find "$tmp" -maxdepth 1 -name 'manifestmark-*.tgz' -print -quit)"
test -n "$package_tgz"

mkdir -p "$tmp/app"
cd "$tmp/app"
npm init -y >/dev/null
npm install "$package_tgz" >/dev/null

./node_modules/.bin/manifestmark --help >/dev/null
./node_modules/.bin/manifestmark --version | grep -q '0.1.0'
./node_modules/.bin/manifestmark scan node_modules/manifestmark/fixtures/single-package --format json >"$tmp/single-package.json"
node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); if (!Array.isArray(data.packages) || data.packages.length !== 1 || !Array.isArray(data.issues)) process.exit(1);" "$tmp/single-package.json"
./node_modules/.bin/manifestmark scripts node_modules/manifestmark/fixtures/workspace --task test >"$tmp/workspace-scripts.md"
grep -q 'test' "$tmp/workspace-scripts.md"

echo 'manifestmark package smoke passed'
