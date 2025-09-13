import { NextRequest, NextResponse } from 'next/server';
import { searchArtists } from '../../../lib/spotify';
import { checkRateLimit } from '../../../lib/seo-utils';

// GET /api/spotify-search?q=drake
export async function GET(request: NextRequest) {
  // Rate limiting to prevent scraping
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip, 20, 60000)) { // 20 requests per minute
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : 5;
  
  // Additional validation
  if (q.length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }
  
  if (limit > 10) {
    return NextResponse.json({ error: 'Limit too high' }, { status: 400 });
  }
  
  try {
    const results = await searchArtists(q, limit);
    return NextResponse.json({ results }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
