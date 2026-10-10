import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_INTRO_MESSAGE,
  DEFAULT_SUPPORTER_QUOTE,
  createEmptyContent,
  normalizeContent,
} from '../js/state/content-model.js';

test('starts a new mailer with the requested introduction and endorsement copy', () => {
  const content = createEmptyContent();
  assert.equal(content.intro.message, DEFAULT_INTRO_MESSAGE);
  assert.equal(content.supporter.blurb, DEFAULT_SUPPORTER_QUOTE);
  assert.equal(content.supporter.enabled, true);
});

test('backfills requested copy for sessions created before those fields existed', () => {
  const content = normalizeContent({ positions: [] });
  assert.equal(content.intro.message, DEFAULT_INTRO_MESSAGE);
  assert.equal(content.supporter.blurb, DEFAULT_SUPPORTER_QUOTE);
});
