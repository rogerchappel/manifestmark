# manifestmark
Local-first package.json manifest scanner for scripts, metadata, and workspace consistency.
## Status

This is a v0.1.0 local-first developer tool. Treat the CLI and output formats as early-stage, pin versions in automation, and run the verification commands below before relying on it in CI.
## What it helps with

- Work with cli, package-json, workspace, audit, metadata workflows from a local checkout.
- Keep generated artifacts and reports inspectable on disk instead of sending project data to a service.
- Add a repeatable smoke command that maintainers can run before review or release.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/manifestmark.git
cd manifestmark
npm install
npm run build
```
## Quickstart

Start with the built CLI help so the examples match the checked-out version:

```sh
node dist/cli.js --help
```

Scan the clean single-package fixture and render the workspace script plan:

```sh
node dist/cli.js scan fixtures/single-package
node dist/cli.js scripts fixtures/workspace --task test
```

To exercise the main workflow end to end, run the maintained smoke fixture:

```sh
npm run smoke
```

The smoke command currently expands to:

```sh
bash scripts/smoke.sh
```

It checks a clean single-package fixture, asserts the expected workspace fixture
error, and exercises the script-summary view.

The package smoke builds a real tarball, installs it into a temporary app, then
checks the installed `manifestmark` binary against the packaged fixtures.
## Verification

```sh
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

## Limitations

- The project is intentionally local-first; it does not manage remote credentials or upload repository contents.
- Output schemas and CLI flags may change before a stable 1.0 release.
- Review generated files before committing them, especially when they summarize logs, diffs, or dependency metadata.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small, include a fixture or smoke case when behavior changes, and paste verification output into the pull request.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting. Do not paste secrets, private tokens, or proprietary logs into issues or examples.

## License

MIT
