/** Convert the canonical position-record schema into the small model the mailer renders. */
export function adaptKnowledge(issues) {
  if (!Array.isArray(issues)) throw new Error('Canonical knowledge base must contain an issues array.');

  const seen = new Set();
  return issues.map((issue) => {
    if (!issue || typeof issue !== 'object') throw new Error('Canonical knowledge base contains an invalid issue.');
    if (issue.status === 'pending') return null;
    if (typeof issue.id !== 'string' || !issue.id) throw new Error('Canonical issue is missing an id.');
    if (seen.has(issue.id)) throw new Error(`Canonical knowledge base repeats issue id "${issue.id}".`);
    seen.add(issue.id);
    if (typeof issue.title !== 'string' || typeof issue.summary !== 'string' || !Array.isArray(issue.points)) {
      throw new Error(`Canonical issue "${issue.id}" is missing mailer-required content.`);
    }
    if (!issue.points.every((point) => typeof point === 'string' && point.trim())) {
      throw new Error(`Canonical issue "${issue.id}" has an invalid talking point.`);
    }
    return {
      id: issue.id,
      title: issue.title,
      eyebrow: typeof issue.eyebrow === 'string' ? issue.eyebrow : '',
      category: typeof issue.category === 'string' ? issue.category : 'Other',
      summary: issue.summary,
      points: issue.points,
      source: issue.source && typeof issue.source === 'object'
        ? {
            label: typeof issue.source.label === 'string' ? issue.source.label : undefined,
            url: typeof issue.source.url === 'string' ? issue.source.url : undefined,
            publisher: typeof issue.source.publisher === 'string' ? issue.source.publisher : undefined,
          }
        : undefined,
      additionalSources: Array.isArray(issue.additionalSources) ? issue.additionalSources : [],
      tags: Array.isArray(issue.tags) ? issue.tags : [],
    };
  }).filter(Boolean);
}
