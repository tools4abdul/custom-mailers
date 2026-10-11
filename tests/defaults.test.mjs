import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_INTRO_MESSAGE,
  DEFAULT_SUPPORTER_QUOTE,
  createEmptyContent,
  normalizeContent,
} from '../js/state/content-model.js';
import { candidatePhotos } from '../js/data/candidate-photos.js';
import { editorialObjectPosition } from '../js/data/photo-source.js';
import { positions } from '../js/data/position-source.js';
import { hasSelectedPostcardPriority } from '../js/templates/postcard.js';

test('starts a new mailer with the requested introduction and endorsement copy', () => {
  const content = createEmptyContent();
  assert.equal(content.intro.message, DEFAULT_INTRO_MESSAGE);
  assert.equal(content.supporter.blurb, DEFAULT_SUPPORTER_QUOTE);
  assert.equal(content.supporter.enabled, true);
  assert.equal(content.printSettings.safeMargin, false);
});

test('backfills requested copy for sessions created before those fields existed', () => {
  const content = normalizeContent({ positions: [] });
  assert.equal(content.intro.message, DEFAULT_INTRO_MESSAGE);
  assert.equal(content.supporter.blurb, DEFAULT_SUPPORTER_QUOTE);
  assert.equal(content.printSettings.safeMargin, false);
});

test('uses the supplied editorial crop positions in gallery order', () => {
  assert.equal(candidatePhotos.length, 38);
  assert.equal(editorialObjectPosition(candidatePhotos[0].id), 'center 44%');
  assert.equal(editorialObjectPosition(candidatePhotos[20].id), 'center 7%');
  assert.equal(editorialObjectPosition(candidatePhotos[37].id), 'center 31%');
});

test('does not guard an empty postcard priority placeholder for overflow', () => {
  const content = createEmptyContent();
  assert.equal(hasSelectedPostcardPriority(content), false);

  content.positions[0].issueId = positions[0].id;
  assert.equal(hasSelectedPostcardPriority(content), true);
});
