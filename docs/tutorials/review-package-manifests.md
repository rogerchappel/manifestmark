# Review Package Manifests

This tutorial runs Manifestmark against the checked-in single-package and
workspace fixtures.

## Run the demo

```sh
bash demo/run-manifest-review.sh
```

The demo verifies:

- `fixtures/single-package` renders a Markdown report with no issues;
- `fixtures/workspace` exits `1` in JSON mode because a script file is missing;
- the script-summary command finds the workspace test command.

## Manual commands

```sh
npm run build
node dist/cli.js scan fixtures/single-package
node dist/cli.js scan fixtures/workspace --format json
node dist/cli.js scripts fixtures/workspace --task test
```

## Where it fits

Use Manifestmark before release review or dependency hygiene work to make
package metadata, script references, and workspace tasks easier to inspect.
It does not install packages or contact registries.
