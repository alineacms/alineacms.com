# AGENTS.md

This file is the operational guide for coding agents working in `alineacms.com`.

## Project at a glance

- Stack: Next.js App Router + TypeScript + SCSS + Alinea CMS.
- Purpose: marketing site + docs site for Alinea CMS.
- Content source of truth: JSON files in `content/` (managed by Alinea).
- CMS config: `src/cms.tsx`.

## Key paths

- `src/cms.tsx`: Alinea setup, workspaces, roots, base URLs, dashboard config.
- `src/schema/`: content model types and block definitions.
- `src/page/`: page implementations and block renderers.
- `src/app/`: Next.js routes (App Router).
- `content/main/pages/docs/`: docs tree content files.
- `content/main/pages/docs.json`: docs root (`/docs`).
- `content/main/media/`: media metadata used by docs/site content.

## Run/build commands

- Install deps: `bun install`
- Dev server (with Alinea): `bun run dev`
- Build (with Alinea): `bun run build`
- Start production build: `bun run start`

Notes:
- `package.json` scripts already wrap Next.js with `alinea dev/build`.
- There are no dedicated lint/test scripts in `package.json`.
- TypeScript and ESLint are ignored during Next build (`next.config.ts`), so do not rely on build for correctness checks.

## Docs routing model

- Docs page route is served via `src/page/DocPage.tsx`, re-exported by:
  - `src/app/(web)/docs/page.tsx`
  - `src/app/(web)/docs/[framework]/[[...slug]]/page.tsx`
- Framework-specific docs URLs are rewritten from `/docs:framework/...` to `/docs/framework/...` in `next.config.ts`.
- Currently only `next` framework is enabled (`src/layout/nav/Frameworks.tsx`).

## Docs authoring model

- Docs entries are Alinea documents (`Doc`/`Docs`) with `body` rich text:
  - Schema: `src/schema/Doc.tsx`, `src/schema/Docs.tsx`
  - Body field: `src/schema/fields/BodyField.ts`
- Supported rich blocks in docs body:
  - `CodeBlock`, `CodeVariantsBlock`, `ImageBlock`, `NoticeBlock`, `ChapterLinkBlock`, `ExampleBlock`, `FrameworkBlock`
- Block rendering lives in `src/page/blocks/`.

## Editing docs content safely

- Prefer editing docs through the CMS where possible; JSON files in `content/` are CMS-managed data.
- If directly editing JSON:
  - Preserve `_id`, `_type`, `_index`, and tree placement.
  - Keep valid JSON (no trailing comments/commas).
  - Match existing block shapes used in nearby files.
- For docs structure/navigation changes, edit files under `content/main/pages/docs/` and/or `content/main/pages/docs.json`.
- For new block capabilities, update both:
  - Schema (`src/schema/...`)
  - Renderer (`src/page/blocks/...`)

## Search + LLM export touchpoints

- Docs search API: `src/app/api/search/route.ts`.
- Full text docs export: `src/app/llms-full.txt/route.ts`.
- When changing docs block semantics/shape, validate both still behave correctly.

## Environment and secrets

- `.env` exists and is gitignored; do not commit secret values.
- Backend auth/database config in `src/app/(alinea)/api/cms/route.ts` is currently commented; keep changes deliberate here.

## Agent workflow expectations

- Before editing, scan related schema + renderer + route files to avoid partial changes.
- Validate by running at least `bun run build` for substantial changes.
- If you change URLs/routing/sitemap behavior, also check `src/app/(web)/sitemap.ts`.
- Keep code style aligned with `biome.json` (single quotes, no semicolons, 2-space indent).

## Improvements (docs quality backlog)

Use this section as the default TODO list when improving docs. Prioritize correctness first, then depth, then IA/menu.

### P0 - Correctness and trust

- Fix clear copy errors:
  - `content/main/pages/docs/reference/internationalization.json`: change "internalization" to "internationalization".
  - `content/main/pages/docs/deploy/self-host.json`: normalize product names/casing (`JavaScript`, `MySQL`, `GitHub`).

### P1 - Expand thin pages with practical depth

- Expand very thin pages (currently mostly single-paragraph pages) with concrete examples, gotchas, and related links:
  - `content/main/pages/docs/reference.json`
  - `content/main/pages/docs/reference/internationalization.json`
  - `content/main/pages/docs/deploy/alinea-cloud.json`
  - `content/main/pages/docs/configuration/fields/check.json`
  - `content/main/pages/docs/configuration/fields/code.json`
  - `content/main/pages/docs/configuration/fields/date.json`
  - `content/main/pages/docs/configuration/fields/select.json`
- For every field page under `content/main/pages/docs/configuration/fields/`, standardize structure:
  - "When to use"
  - "Options/reference"
  - "Validation + defaults"
  - "Real-world schema snippet"
  - "Query/selection example"
  - "Common pitfalls"
- Deepen `content/main/pages/docs/content/typescript.json`:
  - cover `Infer`, typed `select`, `Query` helpers with type-safe results, and end-to-end typed example from schema -> query -> page.
- Deepen `content/main/pages/docs/getting-started.json`:
  - add a "what files were generated and why" section
  - add troubleshooting for common setup/runtime issues
  - add a shortest-path "first content published" checklist.

### P1 - Missing conceptual and operational pages

- Add a new "Core concepts" section/page near the top of docs:
  - entries, roots, workspaces, schema types, URLs, generated cache.
- Add a "Troubleshooting" page:
  - common local dev issues, stale generated content, route/auth misconfiguration, deployment gotchas.

### P2 - Menu / information architecture improvements

- Validate and likely adjust top-level order for onboarding flow:
  - Current structure: Introduction -> Getting started -> Content -> Configuration -> Deploy -> Reference
  - Proposed structure: Introduction -> Getting started -> Core concepts -> Configuration -> Content -> Deploy -> Reference -> Troubleshooting
- Move or duplicate `content/main/pages/docs/content/typescript.json`:
  - either keep in Content and add stronger contextual intro
  - or move under Reference as "TypeScript API patterns" and cross-link from Content.
- Reassess `Reference` placement/content:
  - if it stays top-level, ensure it contains API-style docs (CLI, i18n, query helpers, utility APIs), not just two sparse pages.

### P2 - Search + LLM export quality

- Improve `src/app/llms-full.txt/route.ts` output quality:
  - preserve clearer section hierarchy and navigation order (not only URL sort)
  - include better labeling for framework-specific blocks
  - verify all doc block types render meaningfully in plain text output.
