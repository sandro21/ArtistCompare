import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache
interface CacheEntry { 
  data: any; 
  expires: number; 
}
const CACHE = new Map<string, CacheEntry>();
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days cache for song/album counts

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spotifyId = searchParams.get('spotifyId');

  if (!spotifyId) {
    return NextResponse.json(
      { error: 'Spotify ID is required' },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = CACHE.get(spotifyId);
    if (cached && cached.expires > Date.now()) {
      const hoursLeft = Math.round((cached.expires - Date.now()) / (1000 * 60 * 60));
      console.log(`Cache hit for artist ${spotifyId} - expires in ${hoursLeft} hours`);
      return NextResponse.json({ ...cached.data, cached: true });
    }

    console.log(`Fetching fresh data for artist ${spotifyId} - will cache for 7 days`);
    const discographyData = await fetchSpotifyDiscography(spotifyId);

    // Cache the result for 7 days
    CACHE.set(spotifyId, { 
      data: { spotifyId, ...discographyData }, 
      expires: Date.now() + TTL_MS 
    });

    console.log(`Successfully cached ${spotifyId} song/album counts for 7 days`);

    return NextResponse.json({
      spotifyId,
      ...discographyData,
      cached: false
    });

  } catch (error) {
    console.error('Error fetching Spotify artist details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify artist details', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Spotify API Functions with rate limiting
let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getSpotifyAccessToken() {
  // Reuse cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!client_id || !client_secret) {
    throw new Error('Missing Spotify credentials');
  }
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Spotify token error: ${response.status}`);
  }

  const data = await response.json();
  
  // Cache token with expiry (subtract 5 minutes for safety)
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in * 1000) - 300000
  };
  
  return cachedToken.access_token;
}

// Add delay function for rate limiting
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced fetch with retry and rate limiting
async function spotifyFetchWithRetry(url: string, headers: any, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers });
      
      if (response.status === 429) {
        // Rate limited - wait before retry
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000 * (i + 1);
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}`);
        await delay(waitTime);
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }
  
  throw new Error('Max retries exceeded');
}

async function fetchSpotifyDiscography(spotifyId: string) {
  const accessToken = await getSpotifyAccessToken();
  const headers = { 'Authorization': `Bearer ${accessToken}` };
  
  // Step 1: Get all releases (albums, singles) with rate limiting
  let allReleases: any[] = [];
  let offset = 0;
  const limit = 50;
  
  while (true) {
    const url = `https://api.spotify.com/v1/artists/${spotifyId}/albums?include_groups=album,single&limit=${limit}&offset=${offset}&market=US`;
    
    const response = await spotifyFetchWithRetry(url, headers);

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    allReleases = [...allReleases, ...data.items];
    
    if (data.items.length < limit) {
      break;
    }
    
    offset += limit;
    // Add small delay between paginated requests
    await delay(100);
  }

  // Step 2: Filter main artist releases only (excludes features)
  const mainArtistReleases = allReleases.filter(release => 
    release.artists.some((artist: any) => artist.id === spotifyId)
  );

  // Step 3: Calculate total tracks using album metadata (much faster!)
  let totalTracks = 0;
  const albums = mainArtistReleases.filter(r => r.album_type === 'album');
  const singles = mainArtistReleases.filter(r => r.album_type === 'single');
  
  // Count tracks from albums and singles using total_tracks field
  totalTracks = mainArtistReleases.reduce((sum, release) => {
    return sum + release.total_tracks;
  }, 0);

  // Simple duplicate estimation: assume ~15% duplicates for popular artists
  const estimatedUniqueTracks = Math.round(totalTracks * 0.85);

  return {
    totalTracks: estimatedUniqueTracks,
    totalAlbums: albums.length,
    totalSingles: singles.length,
    totalReleases: mainArtistReleases.length
  };
}
