import { NextResponse } from 'next/server';
import { searchArtists } from '../../../lib/spotify';

// GET /api/spotify-search?q=drake
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : 5;
  try {
    const results = await searchArtists(q, limit);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
