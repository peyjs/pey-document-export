// Tests for lib/mark-extension.js — the local `==highlight==` syntax.
// The documented divergences from the editor's plain regex are pinned here
// so an upstream change cannot silently break them.

import assert from 'node:assert/strict';
import test from 'node:test';
import { micromark } from 'micromark';
import { highlight, highlightHtml } from '../lib/mark-extension.js';

/**
 * Renders markdown with the highlight extension pair, like the export
 * service wires it.
 * @param {string} markdown Source text.
 * @returns {string} HTML.
 */
function render(markdown) {
  return micromark(markdown, {
    extensions: [highlight()],
    htmlExtensions: [highlightHtml()],
  });
}

test('should_wrap_double_equals_runs_in_mark_when_flanking_allows', () => {
  assert.equal(render('این ==متن **مهم**== است.'), '<p>این <mark>متن <strong>مهم</strong></mark> است.</p>');
});

test('should_keep_runs_of_three_or_more_signs_fully_literal_when_highlighted', () => {
  // The overlap guard (like GFM ~~~): === === === stays text, never a mark.
  const html = render('=== متن ===');

  assert.ok(!html.includes('<mark>'), 'a triple-sign run must not open a mark');
  assert.ok(html.includes('=== متن ==='), 'the run stays literal');
});

test('should_not_open_a_mark_when_a_delimiter_touches_a_space', () => {
  // Flanking rules: a delimiter run next to whitespace cannot open.
  const html = render('== متن ==');

  assert.ok(!html.includes('<mark>'), 'space-flanked equals stay literal');
});

test('should_escape_raw_html_inside_the_marked_span_like_any_body_text', () => {
  const html = render('==before <script>alert(1)</script> after==');

  assert.ok(!html.includes('<script>'), 'raw script must not ride inside the highlight');
  assert.ok(html.includes('<mark>'), 'the highlight itself still renders');
});
