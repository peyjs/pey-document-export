# pey.document-export — Reference

Self-contained reference for the `pey.document-export` feature plugin. The manifest (`manifest.json`) is always the authoritative contract; this document explains it.

## Purpose

Markdown document export: renders Markdown (CommonMark + GFM + Persian extensions) over `pey.markdown.service` and assembles either a standalone themed RTL HTML document or a multi-document Markdown zip archive.

## Structure

- `manifest.json` — plugin contract (identity, service, events, config).
- `index.js` — Bonyan two-phase entry point (`prepare` / `activate`), wiring only.
- `lib/export-service.js` — service implementation.
- `lib/file-names.js` — shared file-name rule (path separators to `-`, default title).
- `lib/export-zip.js` — zip archive assembly (`@zip.js/zip.js`, no worker, native `CompressionStream`).
- `lib/persian-extensions.js` — micromark extensions for Parsneshan (admonitions, Persian lists, poetry) and the Persian-footnote option; the only touch point of the `parsneshan` package.
- `lib/mark-extension.js` — the local `==highlight==` extension producing `<mark>` (not CommonMark, not GFM, not Parsneshan), built on the attention mechanism; known divergences: a triple-run stays fully literal, and a space touching the delimiter participates in flanking.
- `lib/assemble-document.js` — pure full-document assembly (`lang="fa" dir="rtl"`) with three inline-CSS themes; the input fragment is already sanitized and is embedded raw — only the title is escaped.
- `tests/` — plugin tests mirroring the source files; two exceptions: `export-parity.test.js` (pipeline contract over real `pey.markdown` output) and `persian-extensions.js`, whose behavior is covered by the parity suite only.
- `docs/reference.md` — this file.
- `CHANGELOG.md` — the plugin's version history.

## Dependencies

- **Required:** `pey.markdown.service` — fragment rendering; both methods fail explicitly with `EXPORT_MARKDOWN_UNAVAILABLE` without it.
- **Optional:** none.

## Public API

Service: `pey.document-export.service`.

### `exportHtml({ markdown, title?, theme? })`

Renders Markdown with the Persian extensions and assembles a standalone document: `{ html, filename, mime: 'text/html' }`. A missing or empty `title` becomes `بدون عنوان` (mirroring zip records); a missing `theme` becomes `'light'` and an unknown theme is rejected with `EXPORT_INVALID_THEME`; a render failure surfaces as `EXPORT_RENDER_FAILED` (original code in `detail.cause`); the filename is sanitized with the same rule as the `.md` download name (`/` and `\` to `-`).

```js
const { html, filename } = await service.exportHtml({ markdown: '# سلام', title: 'یادداشت', theme: 'dark' });
// => { html: '<!DOCTYPE html>…', filename: 'یادداشت.html', mime: 'text/html' }
```

### `exportZip({ documents })`

Packs Markdown documents with their folder paths into one `.md` archive: `{ blob, filename, mime: 'application/zip' }`. Each record is `{ markdown, title?, path? }` (empty `path` means the root); a missing or empty title becomes `بدون عنوان`, and every path segment is sanitized with the same file-name rule (`..` segments are neutralized); a duplicate full path gets the numeric suffix `(2)`. A non-array `documents` is rejected with `EXPORT_INVALID_INPUT` and an assembly failure with `EXPORT_ZIP_FAILED`. The archive name is fixed: `pey-documents.zip`.

```js
const { blob, filename } = await service.exportZip({ documents: [{ markdown: '# سلام', title: 'یادداشت', path: 'آموزش' }] });
// => { blob: Blob(application/zip), filename: 'pey-documents.zip', mime: 'application/zip' }
```

## Events

No domain events are published — the export is a pure computation. During `prepare` the plugin listens to the system event `core:service-unavailable` so that a lost `pey.markdown.service` is reported as a critical error; the subscription is released on shutdown/deactivation and on a repeated `prepare()`.

## Errors Reference

| Code | Situation | Type |
|---|---|---|
| `EXPORT_INVALID_THEME` | An unknown theme name was passed to `exportHtml`. | operational |
| `EXPORT_INVALID_INPUT` | `exportZip` received a non-array `documents`. | operational |
| `EXPORT_MARKDOWN_UNAVAILABLE` | The Markdown dependency was missing at call time (both methods). | operational |
| `EXPORT_RENDER_FAILED` | The Markdown pipeline failed; the original cause is in `detail.cause`. | operational |
| `EXPORT_ZIP_FAILED` | Zip assembly failed. | operational |
| `EXPORT_EVENT_BUS_INVALID` | Prepare-context Event Bus contract broken: missing Event Bus (`detail.reason: 'missing-event-bus'`), missing unsubscribe function (`detail.reason: 'missing-unsubscribe'`), or a `subscribe` that registers and then throws (host message in `detail.cause`). | startup |

In the second and third contract-breaking branches, the host listener registered before the violation is released: the plugin neutralizes the saved context so the orphaned listener can never fire a critical report.

## Config

The manifest declares no config keys; behavior is entirely determined by the method arguments.

## Business Rules

- A missing or empty title reads as the default title `بدون عنوان`, for HTML and zip records alike (a non-string zip title also reads as the default, matching the documented lenient shapes).
- The output filename is derived from the title: path separators become `-`, and the HTML file keeps the `.html` extension.
- Zip paths are sanitized per segment; `..` segments are neutralized; input order is preserved; duplicate full paths get the suffix ` (2)`.
- The standalone document embeds the already-sanitized fragment raw — only the title is escaped — so no second sanitizer runs here.
- `==highlight==` renders to `<mark>`; the upstream pey.markdown sanitizer has allowlisted `mark` since its 1.2.0, so highlights survive in the final output (locked by the parity test).
- Footnote identifiers (`user-content-*`) pass the sanitizer, so footnote navigation works in the exported file.
- Remote images keep their URL (standalone file, no embedding); a non-image `data:` URL drops, keeping the alt text.
- Fenced code renders without syntax highlighting (`<pre><code class="language-x">`) — deliberately out of scope.

## Constraints

- This plugin exports text documents only; PDF, Office and CSV output are explicit non-goals.
- It never stores anything: every request computes and returns its result, persistence stays with the host.
- The renderer runs without a worker (native `CompressionStream`); do not use `exportZip` for unbounded document counts in one call.
- Registered divergences from the editor preview (pinned tests): the editor understands `[^۱]` as a link reference while the export builds a GFM footnote section; lenient-editor poetry renders while strict Parsneshan falls back to text; the exported Persian ordered list numbering starts from `<ol start>` while the editor keeps the source digits for renumbering.
