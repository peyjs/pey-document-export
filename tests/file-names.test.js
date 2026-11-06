// Tests for lib/file-names.js — the download-menu file name rule.

import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_TITLE, sanitizeFileName } from '../lib/file-names.js';

test('should_replace_path_separators_with_dashes_when_sanitizing_titles', () => {
  assert.equal(sanitizeFileName('a/b'), 'a-b');
  assert.equal(sanitizeFileName('a\\b'), 'a-b');
  assert.equal(sanitizeFileName('پوشه/زیر/عنوان'), 'پوشه-زیر-عنوان');
});

test('should_trim_surrounding_spaces_when_sanitizing_titles', () => {
  assert.equal(sanitizeFileName('  عنوان  '), 'عنوان');
});

test('should_fall_back_to_default_title_when_name_empties', () => {
  // Separators become dashes; only an empty/whitespace result falls back.
  assert.equal(sanitizeFileName('///'), '---');
  assert.equal(sanitizeFileName('   '), DEFAULT_TITLE);
  assert.equal(sanitizeFileName(''), DEFAULT_TITLE);
  assert.equal(DEFAULT_TITLE, 'بدون عنوان');
});
