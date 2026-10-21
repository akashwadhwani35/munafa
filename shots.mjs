// node shots.mjs -> shots2/1.png ... one framed phone per screen, transparent, for the deck and for checking
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
const here = path.dirname(new URL(import.meta.url).pathname);
fs.mkdirSync(path.join(here, 'shots2'), { recursive: true });
const b = await puppeteer.launch({ headless: true });
const p = await b.newPage();
await p.setViewport({ width: 420, height: 800, deviceScaleFactor: 3 });
const n = Number(process.argv[2]) || 13;
for (let i = 1; i <= n; i++) {
  await p.goto(`file://${path.join(here, 'index.html')}?shot=${i}`, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('#ph');
  await el.screenshot({ path: path.join(here, 'shots2', i + '.png'), omitBackground: true });
}
await b.close();
console.log('shots2 done');
