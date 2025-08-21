import { NextRequest, NextResponse } from 'next/server';
import { getArtistReleaseYears } from '../../../lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spotifyId = searchParams.get('spotifyId');

    if (!spotifyId) {
      return NextResponse.json({ error: 'spotifyId parameter is required' }, { status: 400 });
    }

    const activeYears = await getArtistReleaseYears(spotifyId);
    
    return NextResponse.json({ 
      spotifyId,
      activeYears
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist release years' }, 
      { status: 500 }
    );
  }
}
