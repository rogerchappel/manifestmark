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

tar -tzf "$package_tgz" >"$tmp/tarball-files.txt"

# Check the package contract, not only the absence of test artifacts.
for required in package/package.json package/README.md package/LICENSE package/dist/cli.js package/dist/index.js package/dist/index.d.ts package/fixtures/single-package/package.json package/fixtures/workspace/package.json; do
  if ! grep -Fxq "$required" "$tmp/tarball-files.txt"; then
    echo "packed manifestmark tarball is missing $required" >&2
    exit 1
  fi
done

if grep -Eq '(^|/)dist/.*\.test\.(js|d\.ts)$' "$tmp/tarball-files.txt"; then
  echo 'packed manifestmark tarball contains compiled test artifacts' >&2
  exit 1
fi

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
