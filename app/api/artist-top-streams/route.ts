import { NextResponse } from 'next/server';

// Simple in-memory cache (per server instance) to avoid hammering upstream
interface CacheEntry { data: any; expires: number }
const CACHE = new Map<string, CacheEntry>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

interface ScrapedTrack {
  name: string;
  url: string;
  totalStreams: number;
  totalStreamsFormatted: string;
  dailyStreams?: number | null;
  dailyStreamsFormatted?: string | null;
}

function parseNumber(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function extractTopFive(html: string): ScrapedTrack[] {
  // Find tbody after header marker
  const marker = '</tr></thead><tbody>';
  const idx = html.indexOf(marker);
  if (idx === -1) return [];
  const body = html.slice(idx + marker.length);
  // Capture rows until we hit closing tbody or enough rows
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/gm;
  const rows: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = rowRegex.exec(body)) && rows.length < 10) {
    rows.push(m[0]);
  }
  const tracks: ScrapedTrack[] = [];
  for (const row of rows) {
    const linkMatch = row.match(/<a href=\"(https:\/\/open.spotify.com\/track\/[^\"']+)\"[^>]*>([^<]+)<\/a>/);
    if (!linkMatch) continue;
    let title = linkMatch[2].trim();
    title = title.replace(/^\*\s*/, ''); // remove leading asterisk used for artist credit marks
    const url = linkMatch[1];
    // Extract all <td> contents
  const tdMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gm)].map(r => r[1]);
    if (tdMatches.length < 3) continue;
    const totalStreamsRaw = tdMatches[1];
    const dailyStreamsRaw = tdMatches[2];
    const totalStreams = parseNumber(totalStreamsRaw);
    const dailyStreams = dailyStreamsRaw ? parseNumber(dailyStreamsRaw) : null;
    tracks.push({
      name: title,
      url,
      totalStreams,
      totalStreamsFormatted: formatNumber(totalStreams),
      dailyStreams,
      dailyStreamsFormatted: dailyStreams !== null ? formatNumber(dailyStreams) : null,
    });
    if (tracks.length === 5) break;
  }
  return tracks;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get('artistId');
  if (!artistId) {
    return NextResponse.json({ error: 'artistId query param required' }, { status: 400 });
  }
  const cacheKey = artistId;
  const cached = CACHE.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ tracks: cached.data, cached: true });
  }
  const url = `https://kworb.net/spotify/artist/${artistId}_songs.html`;
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'artist-compare/1.0 (+https://example.com)' } });
    if (!resp.ok) {
      return NextResponse.json({ error: `Upstream ${resp.status}` }, { status: 502 });
    }
    const html = await resp.text();
    const tracks = extractTopFive(html);
    CACHE.set(cacheKey, { data: tracks, expires: Date.now() + TTL_MS });
    return NextResponse.json({ tracks, source: 'kworb', cached: false, fetchedAt: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fetch failed' }, { status: 500 });
  }
}
