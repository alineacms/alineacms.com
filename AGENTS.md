# AGENTS.md

## Scope

These defaults apply to any coding/documentation agent working in this repository.

## Mission

- Keep `alineacms.com` docs and examples aligned with the pinned upstream `alinea` source.
- Prioritize correctness over assumptions when describing `alinea` APIs and behavior.

## Tutorial

When making changes to the tutorial documentation pages, make sure you keep the tutorial subsites in sync and vica versa.

## Project playbook (required)

For this repository specifically, consult and follow:

- `docs/agents/alinea-agent-playbook.md`

When tasks involve bootstrapping Alinea, generating entries, or writing/updating content metadata, the playbook rules are required.

## Canonical source resolution (required)

Agents must resolve the `alinea` source with the repository script, not local assumptions:

- Run: `ALINEA_SOURCE="$(bash scripts/ensure-alinea.sh)"`
- Version source: `package.json` (`dependencies.alinea` or `devDependencies.alinea`)

Behavior of `scripts/ensure-alinea.sh`:

- Otherwise clones/fetches `https://github.com/alineacms/alinea.git` into `.cache/alinea`
- Resolves `alinea` version from `package.json` and checks out tag `v<version>` in detached mode
- Prints the resolved path to stdout

This guarantees every user/agent can access the same source code, even with only this repository cloned.

## Source-of-truth order

When documenting `alinea` behavior, use this order:

1. `${ALINEA_SOURCE}/src` (implementation)
2. `${ALINEA_SOURCE}/readme.md` and in-repo docs/changelog
3. Installed package snapshots in this repo (`node_modules/alinea`, lockfiles)
4. Existing site copy in this repo

If sources conflict, prefer `${ALINEA_SOURCE}` and update site docs accordingly.

## Working defaults

- Before substantial doc/API updates, run resolver and capture commit:
  - `ALINEA_SOURCE="$(bash scripts/ensure-alinea.sh)"`
  - `git -C "${ALINEA_SOURCE}" rev-parse --short HEAD`
- Quote APIs from code, not memory.
- Include concrete file references for important claims.
- Keep changes scoped; avoid unrelated refactors.
- Run relevant checks before finishing (build/lint/typecheck or targeted command for touched area).

## Suggested commands

- `ALINEA_SOURCE="$(bash scripts/ensure-alinea.sh)"`
- `git -C "${ALINEA_SOURCE}" log -1 --oneline`
- `rg "<symbol-or-api>" "${ALINEA_SOURCE}/src"`
- `bun run build` (in this repo, when docs/examples may affect build output)

## Updating the pinned upstream version

When intentionally moving docs to a newer upstream version:

1. Edit `package.json` (`dependencies.alinea`)
2. Re-run `bash scripts/ensure-alinea.sh`
3. Verify docs/examples against the new source

## Guardrails

- Do not invent undocumented `alinea` API behavior.
- Mark uncertainty explicitly and inspect upstream code until resolved.
- Do not silently switch refs while editing docs; update `package.json` in the same change when needed.
