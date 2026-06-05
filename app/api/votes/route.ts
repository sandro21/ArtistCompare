import { NextRequest, NextResponse } from 'next/server';
import { getVotes, castVote } from '@/lib/db/votes';

// GET /api/votes?a=Drake&b=Jay+Z
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const a = searchParams.get('a')?.trim();
  const b = searchParams.get('b')?.trim();

  if (!a || !b) {
    return NextResponse.json({ error: 'a and b are required' }, { status: 400 });
  }

  try {
    const votes = await getVotes(a, b);
    return NextResponse.json({ ok: true, votes });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

// POST /api/votes  body: { a: string, b: string, vote: 'a' | 'b' }
// vote 'a' = alphabetically-first artist, vote 'b' = alphabetically-second artist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { a, b, vote } = body;

    if (!a || !b || (vote !== 'a' && vote !== 'b')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const votes = await castVote(String(a).trim(), String(b).trim(), vote);
    return NextResponse.json({ ok: true, votes });
  } catch {
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 });
  }
}
