# Changelog — pey.document-export

All notable changes to `pey.document-export` are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the Bonyan architecture rules.

## [1.1.0] - 1405-08-20

Round-2 through round-9 review fixes (all unpublished; one release). MINOR: a new declared startup code replaces the reused operational one and the git-dependency pins move to exact SHAs.

### Fixed (third review pass)

- Each `prepare()` call owns its cleanup (round 8): the hooks are bound to per-call records, so invoking a superseded context's `onShutdown`/`onDeactivated` after a second `prepare()` releases only THAT call's listener and can no longer tear down the live call's Event Bus listener or dependency reference (the network used to fall over silently); a regression test drives the superseded-hook scenario. The duplicate byte-for-byte verification bullet in this entry is folded into the pin bullet it belonged to, and the two mixed-up structure lines of the README (`export-zip` vs `file-names` responsibilities) are corrected to match the reference.
- The two startup failures of `prepare` (missing Event Bus, missing unsubscribe function) carry the dedicated `EXPORT_EVENT_BUS_INVALID` instead of reusing the operational `EXPORT_INVALID_INPUT` — a host error is no longer indistinguishable from a bad `exportZip` input; registered in the reference (tests updated, missing-unsubscribe test added).
- The last two stale `events: null` test calls are gone (the second-pass CHANGELOG claim is now literally true); `micromark` is an explicit devDependency of the test that imports it (no ghost transitive reliance); the README structure list matches the actual sources and test files; requirement 8 now documents the `core:service-unavailable` listener.
- The `parsneshan` lockfile entry's `version` field — hand-edited to `1.0.0` in an old commit while the pinned commit's real `package.json` says `0.2.0` — is corrected back to the actual resolved version: `npm ls` is clean again (the `ELSPROBLEMS` error is gone) and the lock no longer claims a version the dependency tree never had. Content identity of the installed `parsneshan` tree against `cb8f055…` could not be re-verified locally (no clone of that repository exists here); a fresh `npm ci` after pushing the pinned SHAs remains the definitive check.
- Both git dependencies are pinned to exact commit SHAs: `pey.markdown` (`62a2765…`, the renderer's 1.2.1 with its round-8/round-9/round-10 fixes) and `parsneshan` (`cb8f055…`) — a re-pointed tag can never swap dependency code under this package again. The renderer pin moved with the renderer's own round-8/round-9/round-10 fixes (the single-pass heading rewrite and its round-10 throttles) and the installed `pey.markdown` tree was re-verified byte-for-byte against the new SHA over its PUBLISHED files (zero diffs; the hidden npm lockfile was aligned to the same SHA in the same commit — the verification itself covers the published files) with the whole suite — including the parity tests — green on it. Publishing note: a fresh `npm ci` re-resolves from GitHub, so the pinned SHAs must be pushed there first; the verification documented here is the local content comparison, not a remote install.
- The third Event Bus contract-violation shape is covered: a `subscribe` that registers the listener and then throws disarms the saved context and crosses the boundary as the same structured `EXPORT_EVENT_BUS_INVALID` (`detail.reason: 'subscribe-threw'`, original message in `detail.cause`) — never a raw host error (test added).
- The broken `missing-unsubscribe` startup path no longer leaves an armed safety net: the cleanup hooks are armed before any failible step and the saved context is disarmed before the throw, so the orphaned listener the host may keep can never report a critical dependency loss (documented in the reference); `.npmrc` uses a value npm actually accepts (`allow-git=all`) and the git-host policy lives in the requirements (10-3); the reference events section now documents the `core:service-unavailable` listener.

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
