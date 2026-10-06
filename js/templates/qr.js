import { el } from '../util/dom.js';
import { campaignConfig } from '../data/campaign-config.js';

const QR_SOURCE = 'assets/generated/qr-code.svg';

export function renderQr(qrSlot, className) {
  return el('figure', { class: className, style: { '--qr-scale': String(qrSlot.scale) } }, [
    el('img', {
      class: 'mailer__qr',
      src: QR_SOURCE,
      alt: `QR code: ${campaignConfig.qr.destinationLabel}`,
    }),
    qrSlot.caption === undefined
      ? null
      : el('figcaption', { class: `${className}-caption`, text: qrSlot.caption }),
  ]);
}
