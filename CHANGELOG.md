# Changelog — pey.document-export

All notable changes to `pey.document-export` are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the Bonyan architecture rules.

## [1.1.0] - 1405-08-17

Round-2 and round-3 review fixes. MINOR: a new declared startup code replaces the reused operational one and the pey.markdown pin moves.

### Fixed (third review pass)

- The two startup failures of `prepare` (missing Event Bus, missing unsubscribe function) carry the dedicated `EXPORT_EVENT_BUS_INVALID` instead of reusing the operational `EXPORT_INVALID_INPUT` — a host error is no longer indistinguishable from a bad `exportZip` input; registered in the reference (tests updated, missing-unsubscribe test added).
- The last two stale `events: null` test calls are gone (the second-pass CHANGELOG claim is now literally true); `micromark` is an explicit devDependency of the test that imports it (no ghost transitive reliance); the README structure list matches the actual sources and test files; requirement 8 now documents the `core:service-unavailable` listener.
- `pey.markdown` pin moves to `#v1.2.1` (the review-fixed release of the renderer).

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
