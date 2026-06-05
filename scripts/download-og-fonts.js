/**
 * Downloads genuine Plus Jakarta Sans static TTF files (weights 700, 800)
 * from the official GitHub repo and saves them to public/fonts/ for the OG route.
 *
 * NOTE: Google Fonts' css2 "kit=" URLs serve obfuscated/transformed subsets
 * whose binary header is NOT a valid OpenType signature — Satori rejects them
 * with "Unsupported OpenType signature". The static TTFs below are real fonts.
 *
 * Run once: node scripts/download-og-fonts.js
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SOURCES = [
  {
    weight: 700,
    url: 'https://raw.githubusercontent.com/tokotype/PlusJakartaSans/master/fonts/ttf/PlusJakartaSans-Bold.ttf',
  },
  {
    weight: 800,
    url: 'https://raw.githubusercontent.com/tokotype/PlusJakartaSans/master/fonts/ttf/PlusJakartaSans-ExtraBold.ttf',
  },
];

function assertValidTtf(buf, label) {
  const sig = buf.subarray(0, 4).toString('hex');
  // Valid sfnt signatures: 00010000 (TrueType), 4f54544f ("OTTO"), 74727565 ("true")
  const ok = sig === '00010000' || sig === '4f54544f' || sig === '74727565';
  if (!ok) {
    throw new Error(`${label}: invalid font signature 0x${sig} — not a usable TTF/OTF`);
  }
}

(async () => {
  for (const { weight, url } of SOURCES) {
    console.log(`Downloading weight ${weight} from ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    assertValidTtf(buf, `weight ${weight}`);
    const dest = path.join(OUT_DIR, `pjs-${weight}.ttf`);
    fs.writeFileSync(dest, buf);
    console.log(`✓ Saved ${dest} (${(buf.length / 1024).toFixed(1)} KB, sig OK)`);
  }
  console.log('\nDone. Both fonts have valid OpenType signatures.');
})().catch(e => { console.error('\nFAILED:', e.message); process.exit(1); });
