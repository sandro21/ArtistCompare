import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

function formatOgNum(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return n.toString();
}

interface Bar { l: string; a: number; b: number; }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const artistA   = searchParams.get('a') || 'Artist A';
  const artistB   = searchParams.get('b') || 'Artist B';
  const aImg      = searchParams.get('aImg') || null;
  const bImg      = searchParams.get('bImg') || null;
  const title     = searchParams.get('title') || 'Comparison';

  let bars: Bar[] = [];
  try {
    const raw = searchParams.get('bars');
    if (raw) bars = JSON.parse(raw) as Bar[];
  } catch { /* fall through with empty bars */ }

  const PAD = 56;
  const W   = 1200;
  const H   = 630;

  const circleSize = 120;
  const barH       = 46;
  const barGap     = 10;

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: 'linear-gradient(160deg, #0a0e0d 0%, #0d1a15 60%, #081111 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: PAD,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Artist row */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 24 }}>
          {/* Artist A */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
            {aImg ? (
              <img
                src={aImg}
                width={circleSize}
                height={circleSize}
                style={{ borderRadius: '50%', border: '3px solid #5EE9B5', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: circleSize, height: circleSize, borderRadius: '50%',
                  background: '#1e2e29', border: '3px solid #5EE9B5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#5EE9B5', fontSize: 48, fontWeight: 700,
                }}
              >
                {artistA[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700, maxWidth: 300 }}>
                {artistA}
              </span>
            </div>
          </div>

          {/* VS */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#5EE9B5', fontSize: 32, fontWeight: 900,
            padding: '0 24px', opacity: 0.7,
          }}>
            VS
          </div>

          {/* Artist B */}
          <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 16, flex: 1 }}>
            {bImg ? (
              <img
                src={bImg}
                width={circleSize}
                height={circleSize}
                style={{ borderRadius: '50%', border: '3px solid rgba(255,255,255,0.30)', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: circleSize, height: circleSize, borderRadius: '50%',
                  background: '#1e1e1e', border: '3px solid rgba(255,255,255,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 48, fontWeight: 700,
                }}
              >
                {artistB[0]?.toUpperCase() || 'B'}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700, maxWidth: 300, textAlign: 'right' }}>
                {artistB}
              </span>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div style={{
          color: '#5EE9B5', fontSize: 22, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase',
          marginBottom: 18, opacity: 0.85,
        }}>
          {title}
        </div>

        {/* Metric bars */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: barGap, flex: 1 }}>
          {bars.slice(0, 4).map((bar, i) => {
            const total  = bar.a + bar.b;
            const aWins  = bar.a >= bar.b;
            const gradient = aWins
              ? 'linear-gradient(90deg, rgba(94,233,181,0.68) 0%, #081111 58%)'
              : 'linear-gradient(90deg, #081111 42%, rgba(94,233,181,0.68) 100%)';

            return (
              <div
                key={i}
                style={{
                  display: 'flex', flexDirection: 'row',
                  alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', height: barH,
                  borderRadius: 100,
                  border: '1px solid #5EE9B5',
                  background: total === 0
                    ? '#0a0e0d'
                    : gradient,
                  padding: '0 28px',
                }}
              >
                <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 700 }}>
                  {formatOgNum(bar.a)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.70)', fontSize: 16, fontWeight: 500 }}>
                  {bar.l}
                </span>
                <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 700 }}>
                  {formatOgNum(bar.b)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Watermark */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end',
          marginTop: 16,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 15, fontWeight: 500, letterSpacing: 0.5 }}>
            artistcompare.com
          </span>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
