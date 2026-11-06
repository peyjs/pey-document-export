// Tests for lib/assemble-document.js — the standalone RTL document shell.

import assert from 'node:assert/strict';
import test from 'node:test';
import { assembleDocument, outputThemes } from '../lib/assemble-document.js';

test('should_assemble_standalone_rtl_document_when_called', () => {
  const html = assembleDocument({ title: 'یادداشت', bodyHtml: '<p>متن</p>', theme: 'light' });

  assert.ok(html.startsWith('<!DOCTYPE html>'));
  assert.ok(html.includes('<html lang="fa" dir="rtl">'));
  assert.ok(html.includes('<title>یادداشت</title>'));
  assert.ok(html.includes('<p>متن</p>'), 'the sanitized fragment is embedded as-is');
  assert.ok(html.includes('</html>'));
});

test('should_escape_title_against_tag_injection_when_title_is_hostile', () => {
  const html = assembleDocument({ title: '</title><script>alert(1)</script>', bodyHtml: '', theme: 'light' });

  assert.ok(!html.includes('</title><script'), 'the title must not break out of <title>');
  assert.ok(html.includes('<title>&lt;/title&gt;&lt;script&gt;'), 'the hostile title is escaped');
  assert.ok(html.match(/<title>.*<\/title>/)[0].includes('&lt;script&gt;'));
});

test('should_accept_only_known_themes_when_assembling', () => {
  assert.deepEqual(outputThemes(), ['light', 'dark', 'sepia']);
  // An unknown theme falls back to light instead of injecting CSS.
  assert.ok(assembleDocument({ title: 't', bodyHtml: '', theme: 'neon' }).includes(themeCss('light')));
});

function themeCss(theme) {
  const html = assembleDocument({ title: 't', bodyHtml: '', theme });
  return html.match(/<style>(.*)<\/style>/)[1];
}
