# ManifestMark PRD

Status: in-progress

## One-liner

ManifestMark audits package manifests across a repo and prints the scripts, engines, package manager hints, dependency ranges, and release metadata an agent should notice first.

## Problem

Agentic coding runs often start by guessing how a repo builds and tests. In poly-package repos, that wastes time and sometimes runs the wrong command. A tiny local scanner can make the repo's operational contract visible in seconds.

## Users

- Developers onboarding to unfamiliar JavaScript/TypeScript repos
- Agents choosing safe local verification commands
- Maintainers checking package metadata before release

## V1 Scope

- Scan for package.json files while respecting common ignored folders.
- Summarize scripts, package manager, engines, bin entries, publish config, files, dependencies, and dev dependencies.
- Highlight mismatches: missing license, missing repository, absent package manager, broad dependency ranges, scripts that reference missing local files, and inconsistent engines across workspaces.
- Emit JSON and Markdown.
- Include fixtures for single-package and workspace repos.

## Non-goals

- Installing dependencies.
- Vulnerability scanning.
- Deep lockfile graph analysis.

## CLI Sketch

    manifestmark scan .
    manifestmark scan . --format json
    manifestmark scripts . --task test

## Differentiation

ManifestMark is a fast local briefing layer for agents and maintainers. It does not replace npm, pnpm, Biome, or release tooling; it makes the repo contract obvious before those tools run.

## Source attribution

Inspired by local-first package managers and toolchains such as uv and Biome, plus Roger's existing OSS factory need for deterministic repo briefing:
https://github.com/astral-sh/uv
https://github.com/biomejs/biome

