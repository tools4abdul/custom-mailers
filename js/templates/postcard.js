import { el } from '../util/dom.js';
import { candidatePrintSrc, hasCandidatePhoto } from '../data/photo-source.js';
import { getIssue, selectedPoints } from '../data/position-source.js';
import { colorwayStyle, photoOrPlaceholder, textOrPlaceholder } from './render-helpers.js';
import { wideLogoSrc, resolveLogoId } from './logos.js';
import { bannerTemplate } from './banner.js';

function renderFront(content) {
  const photoId = content.candidate.photoId;
  const hero = photoId !== null && hasCandidatePhoto(photoId)
    ? el('img', { class: 'postcard__hero-image', src: candidatePrintSrc(photoId), alt: 'Dr. Abdul El-Sayed' })
    : el('p', { class: 'postcard__hero-placeholder mailer__placeholder', text: 'Choose an Abdul photo' });

  return el('section', { class: 'postcard postcard__front', 'aria-label': 'Postcard front' }, [
    el('div', { class: 'postcard__hero' }, [hero]),
    el('blockquote', { class: 'postcard__endorsement' }, [
      textOrPlaceholder('p', 'postcard__quote', content.supporter.blurb, 'Add an author quote.'),
      textOrPlaceholder('cite', 'postcard__author', content.supporter.name, 'Your name'),
      photoOrPlaceholder(content.supporter.photo, 'postcard__author-photo', 'Your photo'),
    ]),
  ]);
}

function renderPriority(position) {
  const issue = getIssue(position.issueId);
  if (issue === null) {
    return el('li', { class: 'postcard__priority' }, [
      el('h3', { class: 'postcard__priority-title mailer__placeholder', text: 'Choose a priority' }),
    ]);
  }
  const points = selectedPoints(position);
  return el('li', { class: 'postcard__priority' }, [
    el('h3', { class: 'postcard__priority-title', text: issue.title }),
    el('p', { class: 'postcard__priority-summary', text: issue.summary }),
    points.length === 0
      ? null
      : el('ul', { class: 'postcard__points' }, points.map((point) => el('li', { text: point }))),
  ]);
}

export function hasSelectedPostcardPriority(content) {
  return content.positions.slice(0, 3).some((position) => getIssue(position.issueId) !== null);
}

function renderBack(content, colorway) {
  const logoId = resolveLogoId(colorway, content.logoId);
  const hasSelectedPriority = hasSelectedPostcardPriority(content);
  return el('section', { class: 'postcard postcard__back', style: colorwayStyle(colorway), 'aria-label': 'Postcard back' }, [
    el('section', { class: 'postcard__message-side' }, [
      el('img', { class: 'postcard__logo', src: wideLogoSrc(logoId), alt: 'Abdul for U.S. Senate' }),
      el('h2', { class: 'postcard__title', text: 'My Reasons for Supporting Abdul' }),
      el('ol', {
        class: 'postcard__priority-list',
        'data-overflow-guard': hasSelectedPriority ? true : null,
      }, content.positions.slice(0, 3).map(renderPriority)),
    ]),
    el('section', { class: 'postcard__address-side', 'aria-label': 'Mailing address area' }, [
      el('div', { class: 'postcard__stamp-box', 'aria-label': 'Place stamp here' }, [
        el('span', { text: 'PLACE\nSTAMP\nHERE' }),
      ]),
      el('div', { class: 'postcard__address-lines', 'aria-label': 'Recipient address lines' }, [
        el('span'), el('span'), el('span'), el('span'),
      ]),
    ]),
  ]);
}

export const postcardTemplate = {
  id: 'postcard',
  name: 'Postcard',
  description: 'A two-sided 6 × 4 inch postcard with an Abdul portrait, author endorsement, priorities, and mailing panel.',
  previewLabel: 'Shown as two true-size postcard sides (6in × 4in each).',
  slots: {
    candidatePhoto: { source: 'gallery', label: 'Abdul photo', hint: 'This fills the front of the postcard.' },
    positions: { min: 1, max: 3, label: 'Priorities', points: { max: 2 } },
    supporter: bannerTemplate.slots.supporter,
  },
  colorways: bannerTemplate.colorways,
  render(content, colorway) {
    return el('div', { class: 'postcard-set' }, [renderFront(content), renderBack(content, colorway)]);
  },
};
