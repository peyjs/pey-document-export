# Changelog — pey.document-export

All notable changes to `pey.document-export` are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the Bonyan architecture rules.

## [1.0.1] - 1405-08-15

### Fixed

- `==highlight==` now survives to the final HTML: pey.markdown 1.2.0 allowlists `<mark>`, and the parity test is unskipped; the dependency bumped to `github:peyjs/pey-markdown#v1.2.0`.
- `exportZip` enforces the Markdown dependency like `exportHtml` (`EXPORT_MARKDOWN_UNAVAILABLE`), declared in the manifest per requirement 4-10 ("both methods").
- The `core:service-unavailable` subscription is released on shutdown/deactivation (and on a repeated `prepare()`); the `activate()` missing-dependency failure is a structured startup error; unused `state.events` removed; the theme error message no longer embeds raw host input.

### Tests

- Test layout mirrors the sources (`index.test.js`, new `file-names.test.js` / `assemble-document.test.js`), with edge coverage for dot segments, ` (3)` suffixes, lenient zip records, `</title>` escaping, and shutdown unsubscribe; the highlight parity skip is gone (45 tests, 0 skipped).

## [1.0.0] - 2026-10-30

Initial pey release: Markdown document export — `exportHtml` renders with Persian (Parsneshan) extensions and a local `==highlight==` extension over `pey.markdown.service` and assembles a standalone RTL document (`lang="fa" dir="rtl"`, light/dark/sepia inline themes); `exportZip` packs `{ markdown, title?, path? }` records into one Markdown zip archive (default `pey-documents.zip`, per-segment sanitizing, `..` collapse, ` (2)` suffix on repeats, input order preserved). Declares its dependencies explicitly (@zip.js/zip.js, parsneshan, micromark-util-*; test-only devDependencies include pey.markdown and CodeMirror for the parity suite). `docs/requirements.md` is the construction source of truth; non-text export (PDF, Office, CSV) is an explicit non-goal for this plugin.

> Incubated in Parsinegar as `parsinegar.export` (0.1.0–0.2.0): generalized to the ecosystem and renamed `pey.export` → `pey.document-export` before this release. That history stays with the source project — the pey release lineage starts here.
