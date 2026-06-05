import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

type FontDef = { name: string; data: ArrayBuffer; weight: 700 | 800; style: 'normal' };

// Loaded once at module evaluation — synchronous disk read, zero network.
function loadFonts(): FontDef[] {
  try {
    const base = join(process.cwd(), 'public', 'fonts');
    const f700 = readFileSync(join(base, 'pjs-700.ttf'));
    const f800 = readFileSync(join(base, 'pjs-800.ttf'));
    return [
      { name: 'PJS', data: f700.buffer.slice(f700.byteOffset, f700.byteOffset + f700.byteLength), weight: 700, style: 'normal' },
      { name: 'PJS', data: f800.buffer.slice(f800.byteOffset, f800.byteOffset + f800.byteLength), weight: 800, style: 'normal' },
    ];
  } catch {
    return [];
  }
}

const FONTS = loadFonts();

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 10_000)        return (n / 1_000).toFixed(0) + 'K';
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface Bar { l: string; a: number; b: number; }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const artistA = searchParams.get('a') || 'Artist A';
  const artistB = searchParams.get('b') || 'Artist B';
  const aImg    = searchParams.get('aImg') || null;
  const bImg    = searchParams.get('bImg') || null;
  const title   = searchParams.get('title') || 'Comparison';
  const source  = searchParams.get('source') || null;

  let bars: Bar[] = [];
  try {
    const raw = searchParams.get('bars');
    if (raw) bars = JSON.parse(raw) as Bar[];
  } catch { /* empty */ }

  // Load all three weights in parallel
  // Cached — instant after first cold start
  const fonts = FONTS;

  const F  = fonts.length ? "'PJS', system-ui, sans-serif" : 'system-ui, sans-serif';
  const W  = 1200;
  const H  = 630;
  const PX = 60;   // horizontal padding
  const PY = 38;   // vertical padding
  const PH = 96;   // artist photo diameter
  const BG = 14;   // gap between bars
  // bar height scales down so 4 bars + footer always fit within H
  const n  = Math.min(bars.length || 1, 4);
  const BH = Math.min(84, Math.floor((H - PY * 2 - 96 - 20 - 36 - 20 - 36 - BG * (n - 1)) / n));

  // Exact background from globals.css
  const BG_COLOR = '#0a0a0a';
  // Exact ComparisonBar gradient stops
  const GREEN = 'rgba(94,233,181,0.70)';
  const DARK  = '#081111';

  return new ImageResponse(
    (
      <div
        style={{
          width: W, height: H,
          background: BG_COLOR,
          display: 'flex',
          flexDirection: 'column',
          padding: `${PY}px ${PX}px`,
          fontFamily: F,
        }}
      >
        {/* ── Artist row ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>

          {/* Left: photo + name */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: PH, height: PH,
              borderRadius: '50%',
              border: '2px solid #5EE9B5',
              boxShadow: '0 0 10px 1px #5EE9B5',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {aImg
                ? <img src={aImg} width={PH} height={PH} style={{ objectFit: 'cover' }} />
                : <div style={{ width: PH, height: PH, background: '#1a2e25', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5EE9B5', fontSize: 36, fontWeight: 800, fontFamily: F }}>
                    {artistA[0]}
                  </div>
              }
            </div>
            <span style={{ color: '#ffffff', fontSize: 40, fontWeight: 800, fontFamily: F, letterSpacing: '-0.5px' }}>
              {artistA}
            </span>
          </div>

          {/* Right: name + photo (mirrored) */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <span style={{ color: '#ffffff', fontSize: 40, fontWeight: 800, fontFamily: F, letterSpacing: '-0.5px' }}>
              {artistB}
            </span>
            <div style={{
              width: PH, height: PH,
              borderRadius: '50%',
              border: '2px solid #5EE9B5',
              boxShadow: '0 0 10px 1px #5EE9B5',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {bImg
                ? <img src={bImg} width={PH} height={PH} style={{ objectFit: 'cover' }} />
                : <div style={{ width: PH, height: PH, background: '#1a2e25', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5EE9B5', fontSize: 36, fontWeight: 800, fontFamily: F }}>
                    {artistB[0]}
                  </div>
              }
            </div>
          </div>
        </div>

        {/* ── Section title — matches SectionWrapper header: font-bold text-2xl text-white text-center ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
          <span style={{ color: '#ffffff', fontSize: 36, fontWeight: 800, fontFamily: F }}>
            {title}
          </span>
        </div>

        {/* ── Bars — exact ComparisonBar styling ── */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: BG, flex: 1 }}>
          {bars.slice(0, 4).map((bar, i) => {
            const total  = bar.a + bar.b;
            const aWins  = bar.a > bar.b;
            const isEqual = bar.a === bar.b;

            const bg = (total === 0)
              ? `linear-gradient(90deg, ${DARK} 0%, ${DARK} 100%)`
              : isEqual
                ? `linear-gradient(90deg, ${DARK} 0%, ${GREEN} 50%, ${DARK} 100%)`
                : aWins
                  ? `linear-gradient(90deg, ${GREEN} 0%, ${DARK} 50%)`
                  : `linear-gradient(90deg, ${DARK} 50%, ${GREEN} 100%)`;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: BH,
                  // matches ComparisonBar: borderRadius '4.4375rem' ≈ 71px, border '1px solid #5EE9B5'
                  borderRadius: 71,
                  border: '1px solid #5EE9B5',
                  background: bg,
                  padding: '0 24px',
                }}
              >
                {/* artist1Value — font-bold text-base sm:text-lg text-white */}
                <span style={{ color: '#ffffff', fontSize: 30, fontWeight: 800, fontFamily: F }}>
                  {fmt(bar.a)}
                </span>
                {/* metric label — text-white text-m font-medium */}
                <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 700, fontFamily: F }}>
                  {bar.l}
                </span>
                {/* artist2Value */}
                <span style={{ color: '#ffffff', fontSize: 30, fontWeight: 800, fontFamily: F }}>
                  {fmt(bar.b)}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 16,
        }}>
          <span style={{ color: '#5EE9B5', fontSize: 13, fontWeight: 700, fontFamily: F }}>
            {source ?? ''}
          </span>
          <span style={{ color: '#ffffff', fontSize: 26, fontWeight: 800, fontFamily: F }}>
            ArtistCompare.com
          </span>
        </div>
      </div>
    ),
    { width: W, height: H, fonts },
  );
}
