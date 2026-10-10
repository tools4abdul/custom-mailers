import { bannerTemplate } from './banner.js';

/** A concise, rally-style alternative to Banner, with space for one stronger issue. */
export const rallyTemplate = {
  ...bannerTemplate,
  id: 'rally',
  name: 'Rally',
  description: 'A concise high-contrast layout for up to three campaign priorities.',
  slots: { ...bannerTemplate.slots, positions: { min: 1, max: 3, label: 'Positions', points: { max: 4 } } },
  render(content, colorway) {
    const rendered = bannerTemplate.render(content, colorway);
    rendered.classList.add('rally');
    if (colorway?.id === 'cream') {
      rendered.style.setProperty('--mailer-surface', 'var(--brand-cream)');
    }
    return rendered;
  },
};
