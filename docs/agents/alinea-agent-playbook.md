# Alinea Agent Playbook

## Purpose & Scope
This document is the operational playbook for developers and agents who work with Alinea content and schemas.

Use it for:
- bootstrapping work in an Alinea project
- creating or updating entries directly in `content/**/*.json`
- enforcing metadata correctness (`_id`, `_index`, `_root`, `_seeded`, nested row metadata)
- validating changes before commit

This playbook is written for deterministic execution, not best-effort guesswork.

## Source of Truth
Derive behavior from the pinned Alinea source code, not memory.

Required resolver commands:

```bash
ALINEA_SOURCE="$(bash scripts/ensure-alinea.sh)"
git -C "${ALINEA_SOURCE}" rev-parse --short HEAD
```

For this repo state, pinned commit is `d4ea77b2` (Alinea `1.6.2`).

Source priority order:
1. `${ALINEA_SOURCE}/src` (implementation)
2. `${ALINEA_SOURCE}/readme.md` and in-repo changelog/docs
3. Installed snapshots (`node_modules/alinea`, lockfiles)
4. Existing site content in this repository

If sources conflict, implementation in `${ALINEA_SOURCE}/src` wins.

## Bootstrap Workflow
Run these steps before editing content:

```bash
bun install
ALINEA_SOURCE="$(bash scripts/ensure-alinea.sh)"
git -C "${ALINEA_SOURCE}" rev-parse --short HEAD
```

Inspect schema and content mapping:

```bash
sed -n '1,220p' src/cms.tsx
rg --files src/schema
rg --files content/main content/demo
```

Read-before-write checklist:
- confirm workspace source roots in `src/cms.tsx` (`content/main`, `content/demo`)
- confirm type names in `src/schema/**` for `_type` alignment
- inspect sibling entries in target directory to compute `_index` correctly
- inspect nested shape expectations (rich text, list, union) before editing nested arrays/blocks

## Entry Metadata Rules (Top-Level Entries)
Top-level content entries are JSON entry records. Required fields and rules:

- `_id`
  - must be a valid Alinea ID from `createId()` (KSUID-style, 27 chars in current implementation)
  - do not invent mnemonic IDs for new entries (for example `tutorial-step-1`)
- `_type`
  - must match a real schema type key from `src/schema/**`
- `_index`
  - must be a valid fractional order key
  - generate from sibling indexes using `generateKeyBetween`, do not hand-pick by eye
- `_root`
  - include for root-level entries
  - value must match root name (`pages`, `media`, etc.)
- `_seeded`
  - use only for entries corresponding to seeded `Config.page(...)` nodes
  - keep stable seeded-path semantics (`/path/to/page.json`)
- `_i18nId`
  - legacy field from older versions
  - ignore it in current workflows
  - never add or generate `_i18nId` in automation/scripts that create content

## Nested Metadata Rules (Rich Text, List, Union)
Nested structures also carry identity/order metadata and must stay stable.

- rich-text block nodes (`CodeBlock`, `ImageBlock`, `NoticeBlock`, etc.) require stable `_id`
- list rows require both `_id` and `_index`
- union rows require `_id` and `_type`
- do not remove metadata identity fields from nested structures; UI/editor diffing and ordering rely on them

Relevant core shapes:
- `src/core/TextDoc.ts`
- `src/core/shape/ListShape.ts`
- `src/core/shape/UnionShape.ts`
- `src/core/shape/RichTextShape.ts`

## How To Generate Correct IDs and Indexes
Use Alinea internals directly from Node in-repo.

Generate a new entry/block/list ID:

```bash
node --input-type=module -e "import {createId} from 'alinea/core/Id'; console.log(createId())"
```

Generate an index between two sibling indexes:

```bash
node --input-type=module -e "import {generateKeyBetween} from 'alinea/core/util/FractionalIndexing'; console.log(generateKeyBetween('Zgl','Zm4'))"
```

Deterministic sibling placement recipe:
1. collect sibling `_index` values and sort lexicographically
2. select placement neighbors:
   - prepend: `prev = null`, `next = firstSiblingIndex`
   - append: `prev = lastSiblingIndex`, `next = null`
   - insert between: `prev = leftSiblingIndex`, `next = rightSiblingIndex`
3. compute `_index = generateKeyBetween(prev, next)`
4. write JSON and keep sibling ordering consistent

Hard rule: never use arbitrary `_id` strings for new entries.

## Fix and Normalization Workflow
Preferred normalization path is Alinea fix mode:

```bash
alinea build --fix
```

In this repo you can run:

```bash
bun run build -- --fix
```

What fix mode does:
- rewrites incorrect or missing properties to canonical defaults through the Alinea indexing/transaction path

After fix mode:
- re-open changed JSON files
- verify `_id`, `_index`, `_root`, `_seeded`, nested metadata fields match expectations

## Validation Checklist Before Commit
- JSON parses successfully
- `_type` values match schema types
- sibling `_index` ordering is valid and intended
- no duplicate `_id` in edited scope
- build succeeds:

```bash
bun run build
```

- diff contains only intended content changes

## Worked Example: Insert New Child Under `content/main/pages/docs`
Goal: add a new child entry under `docs` between existing `getting-started` and `configuration`.

1. Inspect current siblings and indexes:

```bash
node --input-type=module - <<'NODE'
import fs from 'node:fs'
const dir = 'content/main/pages/docs'
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
  const json = JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8'))
  console.log(`${json._index}\t${file}\t${json._type}`)
}
NODE
```

2. Generate new entry `_id`:

```bash
node --input-type=module -e "import {createId} from 'alinea/core/Id'; console.log(createId())"
```

3. Generate `_index` between neighbors:

```bash
node --input-type=module -e "import {generateKeyBetween} from 'alinea/core/util/FractionalIndexing'; console.log(generateKeyBetween('Zgl','Zm4'))"
```

4. Create file (example `content/main/pages/docs/tutorial.json`) with:
- generated `_id`
- `_type` set to `Docs` or `Doc` per schema intent
- generated `_index`
- required content fields (`title`, `body`, etc.)
- include `_root` when creating a root-level seeded-style entry; otherwise preserve existing project conventions for that subtree

5. Run normalization and validation:

```bash
alinea build --fix
bun run build
git diff -- content/main/pages/docs
```

## References
Implementation references (Alinea core source):
- `src/core/Id.ts`
- `src/core/util/FractionalIndexing.ts`
- `src/core/db/EntryTransaction.ts`
- `src/core/db/EntryIndex.ts`
- `src/core/EntryRecord.ts`
- `src/core/shape/ListShape.ts`
- `src/core/shape/UnionShape.ts`
- `src/core/TextDoc.ts`

Operational references (this repository):
- `scripts/ensure-alinea.sh`
- `src/cms.tsx`
- `src/schema/**`
- `content/main/**`
- `content/demo/**`
