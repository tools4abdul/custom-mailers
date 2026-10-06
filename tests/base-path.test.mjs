import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('published entry point and runtime assets are relative to the application root', async () => {
  const [html, photos, logos, qr] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../js/data/photo-source.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/templates/logos.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/templates/qr.js', import.meta.url), 'utf8'),
  ]);
  for (const source of [html, photos, logos, qr]) {
    assert.doesNotMatch(source, /(?:src|href)=["']\//);
    assert.doesNotMatch(source, /['"]\/assets\//);
  }
  assert.match(html, /<base href="\.\/">/);
});
