import { registerTemplate } from './registry.js';
import { bannerTemplate } from './banner.js';
import { editorialTemplate } from './editorial.js';
import { rallyTemplate } from './rally.js';
import { postcardTemplate } from './postcard.js';

export function registerTemplates() {
  registerTemplate(bannerTemplate);
  registerTemplate(editorialTemplate);
  registerTemplate(rallyTemplate);
  registerTemplate(postcardTemplate);
}
