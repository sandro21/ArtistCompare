/**
 * Downloads Plus Jakarta Sans TTF files (weights 700, 800) from Google Fonts
 * and saves them to public/fonts/ for use in the OG image route.
 * Run once: node scripts/download-og-fonts.js
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)';

async function downloadWeight(weight) {
  console.log(`Fetching CSS for weight ${weight}...`);
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': UA } }
  ).then(r => r.text());

  const match = css.match(/url\((['"]?)([^'")\s]+)\1\)/);
  const url = match?.[2];
  if (!url) throw new Error(`No font URL found for weight ${weight}.\nCSS:\n${css.slice(0, 400)}`);

  console.log(`Downloading ${url}`);
  const buf = await fetch(url).then(r => r.arrayBuffer());
  const dest = path.join(OUT_DIR, `pjs-${weight}.ttf`);
  fs.writeFileSync(dest, Buffer.from(buf));
  console.log(`✓ Saved ${dest} (${(buf.byteLength / 1024).toFixed(1)} KB)`);
}

(async () => {
  await downloadWeight(700);
  await downloadWeight(800);
  console.log('\nDone. Commit public/fonts/pjs-700.ttf and public/fonts/pjs-800.ttf.');
})().catch(e => { console.error(e); process.exit(1); });
