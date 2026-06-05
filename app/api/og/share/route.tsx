import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

function formatOgNum(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 10_000) return (n / 1_000).toFixed(0) + 'K';
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
  } catch { /* empty bars */ }

  const W = 1200;
  const H = 630;
  const PX = 60; // horizontal padding
  const PY = 48; // vertical padding
  const PHOTO = 62;
  const BAR_H = 46;
  const BAR_GAP = 10;

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          padding: `${PY}px ${PX}px`,
          fontFamily: 'system-ui, -apple-system, Arial, sans-serif',
        }}
      >
        {/* ── Artist row ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left: photo + name */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            {aImg ? (
              <img
                src={aImg}
                width={PHOTO}
                height={PHOTO}
                style={{
                  borderRadius: '50%',
                  border: '2.5px solid #5EE9B5',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: PHOTO, height: PHOTO, borderRadius: '50%',
                  background: '#111', border: '2.5px solid #5EE9B5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#5EE9B5', fontSize: 28, fontWeight: 800,
                }}
              >
                {artistA[0]?.toUpperCase()}
              </div>
            )}
            <span style={{ color: '#ffffff', fontSize: 50, fontWeight: 800, letterSpacing: '-0.5px' }}>
              {artistA.toUpperCase()}
            </span>
          </div>

          {/* Right: name + photo */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <span style={{ color: '#ffffff', fontSize: 50, fontWeight: 800, letterSpacing: '-0.5px' }}>
              {artistB.toUpperCase()}
            </span>
            {bImg ? (
              <img
                src={bImg}
                width={PHOTO}
                height={PHOTO}
                style={{
                  borderRadius: '50%',
                  border: '2.5px solid rgba(255,255,255,0.35)',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: PHOTO, height: PHOTO, borderRadius: '50%',
                  background: '#111', border: '2.5px solid rgba(255,255,255,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 28, fontWeight: 800,
                }}
              >
                {artistB[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* ── Section title ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 26,
            marginBottom: 18,
          }}
        >
          <span style={{ color: '#ffffff', fontSize: 30, fontWeight: 600 }}>
            {title}
          </span>
        </div>

        {/* ── Metric bars ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: BAR_GAP,
            flex: 1,
          }}
        >
          {bars.slice(0, 4).map((bar, i) => {
            const total  = bar.a + bar.b;
            const aWins  = bar.a >= bar.b;
            const bg     = total === 0
              ? '#0a0a0a'
              : aWins
                ? 'linear-gradient(90deg, rgba(94,233,181,0.70) 0%, #081111 55%)'
                : 'linear-gradient(90deg, #081111 45%, rgba(94,233,181,0.70) 100%)';

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: BAR_H,
                  borderRadius: 100,
                  border: '1px solid #5EE9B5',
                  background: bg,
                  padding: '0 26px',
                }}
              >
                <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, minWidth: 40 }}>
                  {formatOgNum(bar.a)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.70)', fontSize: 16, fontWeight: 500 }}>
                  {bar.l}
                </span>
                <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, minWidth: 40, textAlign: 'right' }}>
                  {formatOgNum(bar.b)}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 14,
          }}
        >
          <span style={{ color: '#5EE9B5', fontSize: 13, fontWeight: 500 }}>
            {source || ''}
          </span>
          <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 500 }}>
            Artistcompare.com
          </span>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
