# ManifestMark Tasks

## MVP Complete

- [x] Scan package.json files while skipping common generated folders.
- [x] Summarize scripts, engines, package manager, bin, publish config, files, dependencies, and dev dependencies.
- [x] Flag missing license, repository, package manager, files metadata, broad dependency ranges, missing local script files, and workspace inconsistencies.
- [x] Emit Markdown and JSON reports.
- [x] Provide manifestmark scripts for task-focused script discovery.
- [x] Include single-package and workspace fixtures.
- [x] Cover scanner, formatter, parser, and fixture behavior with Node test runner tests.
- [x] Document install, usage, safety, contribution, and examples.

## Follow-up Candidates

- [ ] Add glob-aware workspace membership validation.
- [ ] Support JSON schema output for downstream agent tooling.
- [ ] Add optional lockfile/package-manager hint detection.
- [ ] Add SARIF output for CI annotation.
