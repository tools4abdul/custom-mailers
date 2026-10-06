import assert from 'node:assert/strict';
import test from 'node:test';
import { adaptKnowledge } from '../scripts/knowledge-adapter.mjs';

test('adapts approved canonical fields without rewriting policy copy', () => {
  const [issue] = adaptKnowledge([{
    id: 'care', title: 'Care', eyebrow: 'For all', category: 'Healthcare', summary: 'Approved summary.',
    points: ['Approved point.'], tags: ['care'], source: { label: 'Source', url: 'https://example.com' },
  }]);
  assert.deepEqual(issue.points, ['Approved point.']);
  assert.equal(issue.source.url, 'https://example.com');
});

test('does not publish pending issues and fails malformed campaign content loudly', () => {
  assert.deepEqual(adaptKnowledge([{ id: 'hold', status: 'pending' }]), []);
  assert.throws(() => adaptKnowledge([{ id: 'bad', title: 'Bad', summary: 'No points' }]), /mailer-required/);
});
