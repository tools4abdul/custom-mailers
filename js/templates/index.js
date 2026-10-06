import { registerTemplate } from './registry.js';
import { bannerTemplate } from './banner.js';
import { editorialTemplate } from './editorial.js';
import { rallyTemplate } from './rally.js';

export function registerTemplates() {
  registerTemplate(bannerTemplate);
  registerTemplate(editorialTemplate);
  registerTemplate(rallyTemplate);
}
