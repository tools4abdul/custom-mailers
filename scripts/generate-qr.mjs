import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import QRCode from 'qrcode';
import { campaignConfig } from '../js/data/campaign-config.js';

const destination = campaignConfig.qr.destination;
if (!/^https:\/\//.test(destination)) throw new Error('QR destination must be an HTTPS URL.');
const output = resolve(import.meta.dirname, '../assets/generated/qr-code.svg');
await mkdir(resolve(import.meta.dirname, '../assets/generated'), { recursive: true });
await writeFile(output, await QRCode.toString(destination, { type: 'svg', errorCorrectionLevel: 'M', margin: 1 }));
console.log(`Generated QR code for ${destination}.`);
