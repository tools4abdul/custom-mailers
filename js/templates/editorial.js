import { el } from '../util/dom.js';
import { candidatePrintSrc, hasCandidatePhoto } from '../data/photo-source.js';
import { getIssue, selectedPoints } from '../data/position-source.js';
import { wideLogoSrc, resolveLogoId } from './logos.js';
import { renderQr } from './qr.js';
import { colorwayStyle, photoOrPlaceholder, textOrPlaceholder } from './render-helpers.js';

function issueBlock(position) {
  const issue = getIssue(position.issueId);
  const points = selectedPoints(position);
  return el('section', { class: 'editorial__issue' }, issue === null
    ? [el('h3', { class: 'editorial__issue-title mailer__placeholder', text: 'Choose a position' })]
    : [
        el('p', { class: 'editorial__issue-eyebrow', text: issue.eyebrow }),
        el('h3', { class: 'editorial__issue-title', text: issue.title }),
        el('p', { class: 'editorial__issue-summary', text: issue.summary }),
        el('ul', { class: 'editorial__points', 'data-overflow-guard': true },
          (points.length ? points : ['Choose a supporting point']).map((point) => el('li', { text: point }))
        ),
      ]);
}

export const editorialTemplate = {
  id: 'editorial', name: 'Editorial', description: 'A large campaign portrait with two detailed issue stories.',
  slots: {
    candidatePhoto: { source: 'gallery', label: 'Candidate photo', hint: 'A tall portrait works best.' },
    positions: { min: 1, max: 2, label: 'Positions', points: { max: 4 } },
    supporter: { optional: true, label: 'Your endorsement', photo: { aspectRatio: 1, exportWidth: 420, label: 'Your photo' }, name: { maxChars: 30, label: 'Your name' }, blurb: { maxChars: 300, label: 'Why you support Abdul', placeholder: 'Share why you are backing Abdul.' } },
    qr: { scale: 1, caption: 'Scan for voting information' },
  },
  colorways: [
    { id: 'navy', name: 'Navy · Editorial', swatch: ['var(--brand-deep-blue)', 'var(--brand-cream)', 'var(--brand-coral)'], headerTone: 'dark', logoOptions: ['light', 'gold'], tokens: { '--mailer-header-bg': 'var(--brand-deep-blue)', '--mailer-header-accent': 'var(--brand-coral)', '--mailer-footer-bg': 'var(--brand-cream)', '--mailer-footer-ink': 'var(--brand-deep-blue)', '--mailer-footer-accent': 'var(--brand-red)', '--mailer-heading': 'var(--brand-deep-blue)', '--mailer-surface': 'var(--brand-white)', '--mailer-ink': 'var(--brand-charcoal)', '--mailer-rule': 'var(--brand-medium-beige)', '--mailer-accent': 'var(--brand-red)' } },
    { id: 'warm', name: 'Warm · Community', swatch: ['var(--brand-cream)', 'var(--brand-red)', 'var(--brand-deep-blue)'], headerTone: 'light', logoOptions: ['duo', 'navy', 'dark'], tokens: { '--mailer-header-bg': 'var(--brand-cream)', '--mailer-header-accent': 'var(--brand-red)', '--mailer-footer-bg': 'var(--brand-deep-blue)', '--mailer-footer-ink': 'var(--brand-white)', '--mailer-footer-accent': 'var(--brand-light-beige)', '--mailer-heading': 'var(--brand-deep-blue)', '--mailer-surface': 'var(--brand-white)', '--mailer-ink': 'var(--brand-charcoal)', '--mailer-rule': 'var(--brand-medium-beige)', '--mailer-accent': 'var(--brand-red)' } },
  ],
  render(content, colorway) {
    const photo = content.candidate.photoId;
    const logoId = resolveLogoId(colorway, content.logoId);
    return el('div', { class: 'editorial', style: colorwayStyle(colorway) }, [
      el('header', { class: 'editorial__header' }, [el('img', { class: 'editorial__logo', src: wideLogoSrc(logoId), alt: 'Abdul for U.S. Senate' })]),
      el('div', { class: 'editorial__hero' }, photo && hasCandidatePhoto(photo)
        ? [el('img', { class: 'editorial__hero-image', src: candidatePrintSrc(photo), alt: '' })]
        : [el('p', { class: 'mailer__placeholder', text: 'Choose a candidate photo' })]),
      el('main', { class: 'editorial__body' }, content.positions.slice(0, 2).map(issueBlock)),
      el('footer', { class: 'editorial__footer' }, [
        renderQr(editorialTemplate.slots.qr, 'editorial__qr'),
        content.supporter.enabled ? el('blockquote', { class: 'editorial__endorsement' }, [textOrPlaceholder('p', 'editorial__blurb', content.supporter.blurb, 'Why I support Abdul.'), textOrPlaceholder('cite', 'editorial__name', content.supporter.name, 'Your name'), photoOrPlaceholder(content.supporter.photo, 'editorial__supporter', 'Your photo')]) : null,
      ]),
    ]);
  },
};
