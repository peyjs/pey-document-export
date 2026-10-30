# Changelog — pey.document-export

All notable changes to `pey.document-export` are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the Bonyan architecture rules.

## [1.0.0] - 2026-10-30

Initial pey release: Markdown document export — `exportHtml` renders with Persian (Parsneshan) extensions and a local `==highlight==` extension over `pey.markdown.service` and assembles a standalone RTL document (`lang="fa" dir="rtl"`, light/dark/sepia inline themes); `exportZip` packs `{ markdown, title?, path? }` records into one Markdown zip archive (default `pey-documents.zip`, per-segment sanitizing, `..` collapse, ` (2)` suffix on repeats, input order preserved). Declares its dependencies explicitly (@zip.js/zip.js, parsneshan, micromark-util-*; test-only devDependencies include pey.markdown and CodeMirror for the parity suite). `docs/requirements.md` is the construction source of truth; non-text export (PDF, Office, CSV) is an explicit non-goal for this plugin.

> Incubated in Parsinegar as `parsinegar.export` (0.1.0–0.2.0): generalized to the ecosystem and renamed `pey.export` → `pey.document-export` before this release. That history stays with the source project — the pey release lineage starts here.
