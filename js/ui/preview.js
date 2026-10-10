import { el, replace } from '../util/dom.js';
import { getTemplate, getColorway } from '../templates/registry.js';

const PAGE_WIDTH_PX = 816;
const MIN_SCALE = 0.2;

function renderEmptyState(message) {
  return el('div', { class: 'mailer__empty' }, [
    el('p', { class: 'mailer__empty-title', text: 'Nothing to preview yet' }),
    el('p', { class: 'mailer__empty-body', text: message }),
  ]);
}

export function renderMailer(mailerNode, content) {
  const template = getTemplate(content.templateId);

  if (template === null) {
    replace(mailerNode, renderEmptyState('Choose a layout to start building your mailer.'));
    mailerNode.className = 'mailer';
    return;
  }

  const colorway = getColorway(template, content.colorwayId);
  mailerNode.className = `mailer mailer--${template.id}`;
  mailerNode.classList.toggle('mailer--printer-safe', content.printSettings.safeMargin);
  mailerNode.dataset.colorway = colorway === null ? '' : colorway.id;
  replace(mailerNode, template.render(content, colorway));
  fitMailerContent(mailerNode);
}

function hasOverflow(mailerNode) {
  return [...mailerNode.querySelectorAll('[data-overflow-guard]')].some(
    (guard) => guard.scrollHeight - guard.clientHeight > 1
  );
}

function fitMailerContent(mailerNode) {
  const container = mailerNode.querySelector('[data-content-fit]');
  const message = mailerNode.querySelector('[data-auto-fit-text]');
  if (container === null) {
    return;
  }

  let bestContentScale = 0.65;
  for (let scale = 0.65; scale <= 1.05; scale += 0.01) {
    container.style.setProperty('--mailer-content-scale', String(scale));
    if (hasOverflow(mailerNode)) {
      break;
    }
    bestContentScale = scale;
  }
  container.style.setProperty('--mailer-content-scale', String(bestContentScale));

  if (message === null) {
    return;
  }

  let bestMessageSize = 10;
  for (let size = 10; size <= 20; size += 0.25) {
    message.style.setProperty('--mailer-message-size', `${size}pt`);
    const introduction = message.closest('.banner__introduction');
    if (introduction !== null && introduction.scrollHeight - introduction.clientHeight > 1) {
      break;
    }
    bestMessageSize = size;
  }
  message.style.setProperty('--mailer-message-size', `${bestMessageSize}pt`);
}

export function findOverflow(mailerNode) {
  return hasOverflow(mailerNode);
}

export function createPreviewFitter(previewNode, stageNode) {
  function fit() {
    const styles = window.getComputedStyle(previewNode);
    const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const available = previewNode.clientWidth - horizontalPadding;
    const scale = Math.max(MIN_SCALE, Math.min(1, available / PAGE_WIDTH_PX));
    stageNode.style.setProperty('--preview-scale', String(scale));
  }

  const observer = new ResizeObserver(fit);
  observer.observe(previewNode);
  fit();

  return fit;
}
