# Changelog — pey.document-export

All notable changes to `pey.document-export` are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the Bonyan architecture rules.

## [1.1.0] - 1405-08-20

Round-2 through round-21 review fixes (all unpublished; one release). MINOR: a new declared startup code replaces the reused operational one and the git-dependency pins move to exact SHAs.

### Fixed

- **Both git dependencies are pinned to exact commit SHAs**: `pey.markdown` (`b83f15d…`, whose local `v1.2.1` tag names exactly this commit) and `parsneshan` (`cb8f055…`) — a re-pointed tag can never swap dependency code under this package. Pin moves follow requirement 10-4 (the SHA must be pushable first) and every pin move requires a byte-for-byte verification of the installed tree plus a green suite per requirement 10-5; the push-first rule and the initial transitional exception are both recorded in the requirements.
- **Each `prepare()` call owns its cleanup**: the hooks are bound to per-call records, so invoking a superseded context's `onShutdown`/`onDeactivated` releases only THAT call's listener and can no longer tear down the live call's Event Bus listener or dependency reference.
- **Event Bus contract violations are structured**: the two startup failures of `prepare` (missing Event Bus, missing unsubscribe function) and a `subscribe` that registers then throws carry the dedicated `EXPORT_EVENT_BUS_INVALID` (`detail.reason`, original message in `detail.cause`) — never a raw host error or a reused input code.
- Misc: `exportZip` enforces the Markdown dependency like `exportHtml`; stale `events: null` calls and the dead test bullet are gone; `micromark` is an explicit devDependency of the test that imports it; the README structure list matches the sources; the `parsneshan` lockfile entry's version matches the pinned commit; `.npmrc` uses a value npm accepts (54 tests).

## [1.0.1] - 1405-08-15

### Fixed

- `==highlight==` now survives to the final HTML: pey.markdown 1.2.0 allowlists `<mark>`, and the parity test is unskipped; the dependency bumped to `github:peyjs/pey-markdown#v1.2.0`.
- `exportZip` enforces the Markdown dependency like `exportHtml` (`EXPORT_MARKDOWN_UNAVAILABLE`), declared in the manifest per requirement 4-10 ("both methods").
- The `core:service-unavailable` subscription is released on shutdown/deactivation (and on a repeated `prepare()`); the `activate()` missing-dependency failure is a structured startup error; unused `state.events` removed; the theme error message no longer embeds raw host input.

### Fixed (second review pass)

- A non-string `title` in a zip record reads as the default title instead of crashing the whole archive (matching the documented lenient shapes).
- A missing or contract-breaking Event Bus in the prepare context fails loudly at startup instead of silently arming nothing; the ZipWriter closes on failure without masking the original error; the stale `{ markdown, events }` JSDoc/`events: null` references are gone.

### Tests

- Test layout mirrors the sources (`index.test.js`, new `file-names.test.js` / `assemble-document.test.js` / `mark-extension.test.js`), with edge coverage for dot segments, ` (3)` suffixes, lenient zip records, `</title>` escaping, shutdown unsubscribe, the documented highlight divergences (triple-run literal, flanking spaces), the double-prepare listener release and the loud missing-bus startup (51 tests, 0 skipped).

## [1.0.0] - 2026-10-30

Initial pey release: Markdown document export — `exportHtml` renders with Persian (Parsneshan) extensions and a local `==highlight==` extension over `pey.markdown.service` and assembles a standalone RTL document (`lang="fa" dir="rtl"`, light/dark/sepia inline themes); `exportZip` packs `{ markdown, title?, path? }` records into one Markdown zip archive (default `pey-documents.zip`, per-segment sanitizing, `..` collapse, ` (2)` suffix on repeats, input order preserved). Declares its dependencies explicitly (@zip.js/zip.js, parsneshan, micromark-util-*; test-only devDependencies include pey.markdown and CodeMirror for the parity suite). `docs/requirements.md` is the construction source of truth; non-text export (PDF, Office, CSV) is an explicit non-goal for this plugin.

> Incubated in Parsinegar as `parsinegar.export` (0.1.0–0.2.0): generalized to the ecosystem and renamed `pey.export` → `pey.document-export` before this release. That history stays with the source project — the pey release lineage starts here.
