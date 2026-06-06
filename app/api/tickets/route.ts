import { NextRequest, NextResponse } from 'next/server';
import { wrapSeatGeekUrl } from '../../../lib/affiliate';
import { getCachedTickets, saveCachedTickets } from '../../../lib/db/tickets';
import { normalizeForComparison } from '../../../lib/utils/normalize';
import type { TicketInfo } from '../../../types';

const SEATGEEK_CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
const SEATGEEK_CLIENT_SECRET = process.env.SEATGEEK_CLIENT_SECRET;

// Fast in-memory layer in front of the Neon cache (per warm serverless instance).
const MEMORY_TTL_MS = 60 * 60 * 1000; // 1 hour
const memoryCache = new Map<string, { data: TicketInfo; expires: number }>();

const NOT_TOURING: TicketInfo = { onTour: false, url: null, eventCount: 0, performerName: null };

interface SeatGeekPerformer {
  name: string;
  url: string;
  score: number;
  num_upcoming_events?: number;
  has_upcoming_events?: boolean;
}

async function fetchFromSeatGeek(artistName: string): Promise<TicketInfo> {
  if (!SEATGEEK_CLIENT_ID) {
    // Feature not configured — degrade silently.
    return NOT_TOURING;
  }

  const params = new URLSearchParams({
    q: artistName,
    // Search wide: tribute/cover acts often rank above the real artist, so a small
    // page size can push the exact match off the list (e.g. "Drake" landed at #12).
    per_page: '25',
    client_id: SEATGEEK_CLIENT_ID,
  });
  if (SEATGEEK_CLIENT_SECRET) params.set('client_secret', SEATGEEK_CLIENT_SECRET);

  const response = await fetch(`https://api.seatgeek.com/2/performers?${params.toString()}`, {
    headers: { 'User-Agent': 'artist-compare/1.0' },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`SeatGeek HTTP ${response.status}`);
  }

  const json = await response.json();
  const performers: SeatGeekPerformer[] = json.performers || [];
  if (performers.length === 0) return NOT_TOURING;

  const target = normalizeForComparison(artistName);

  // Only trust an exact normalized-name match. SeatGeek search surfaces tribute /
  // cover acts (e.g. "Metallica Tribute") above the real artist, so falling back
  // to the first result would produce false positives.
  const exactMatches = performers.filter(
    (p) => normalizeForComparison(p.name) === target,
  );
  if (exactMatches.length === 0) return NOT_TOURING;

  // Among exact matches, pick the one with the most upcoming events.
  const best = exactMatches.reduce((acc, p) =>
    (p.num_upcoming_events || 0) > (acc.num_upcoming_events || 0) ? p : acc,
  );

  const eventCount = best.num_upcoming_events || 0;
  if (eventCount === 0) return { ...NOT_TOURING, performerName: best.name };

  return {
    onTour: true,
    url: wrapSeatGeekUrl(best.url),
    eventCount,
    performerName: best.name,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spotifyId = searchParams.get('spotifyId');
  const artistName = searchParams.get('artistName');

  if (!spotifyId || !artistName) {
    return NextResponse.json(
      { error: 'spotifyId and artistName are required' },
      { status: 400 },
    );
  }

  // 1) In-memory cache
  const mem = memoryCache.get(spotifyId);
  if (mem && mem.expires > Date.now()) {
    return NextResponse.json(mem.data);
  }

  // 2) Neon cache (24h TTL)
  const cached = await getCachedTickets(spotifyId);
  if (cached) {
    memoryCache.set(spotifyId, { data: cached, expires: Date.now() + MEMORY_TTL_MS });
    return NextResponse.json(cached);
  }

  // 3) Live SeatGeek lookup
  try {
    const data = await fetchFromSeatGeek(artistName);
    memoryCache.set(spotifyId, { data, expires: Date.now() + MEMORY_TTL_MS });
    // Persist non-error results (including "not touring") so we don't re-hit the API.
    await saveCachedTickets(spotifyId, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('tickets route error:', error);
    // Degrade silently — the UI renders nothing when onTour is false.
    return NextResponse.json(NOT_TOURING);
  }
}
