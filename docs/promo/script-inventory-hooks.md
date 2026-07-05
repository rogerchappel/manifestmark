# ManifestMark Script Inventory Hooks

## Hook options

- "Before an agent runs a repo's tests, it should know which command the
  manifest actually declares. ManifestMark can turn package scripts into a
  reviewable handoff."
- "Manifest review is not only metadata. The build and test scripts tell future
  maintainers how the package expects to be verified."
- "`manifestmark scripts . --task test` is a tiny command, but it prevents a lot
  of guessed CI folklore in handoffs."

## Demo beats

1. Run `bash demo/run-script-inventory.sh`.
2. Open the single-package build inventory and show `node scripts/build.js`.
3. Open the single-package test inventory and show `node --test`.
4. Open the workspace test inventory and show `pnpm -r test`.
5. Connect it back to release review: scan metadata first, then capture the
   declared verification commands.

## Grounding facts

- Commands are `manifestmark scan` and `manifestmark scripts`.
- Output can be Markdown or JSON for scans.
- Script inventory reads local `package.json` data and does not run the package
  scripts it reports.
