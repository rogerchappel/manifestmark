# Manifestmark Social Hooks

Use these with `demo/run-manifest-review.sh`.

## Short posts

1. Manifestmark turns package manifest review into a local CLI pass: scan a
   package, catch missing script files, and summarize workspace commands without
   installing anything.

2. The new demo runs one clean fixture and one workspace fixture with a real
   missing-script-file error, then prints the test command summary reviewers
   usually need first.

3. Package reviews are easier when script paths, workspace tasks, and metadata
   issues are visible before the release checklist starts.

## Video angle

- Run `bash demo/run-manifest-review.sh`.
- Open the clean Markdown report.
- Open the workspace JSON and highlight `missing-script-file`.
- Show the script summary for `pnpm -r test`.
