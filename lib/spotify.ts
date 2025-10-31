// Server-side Spotify API helper (Client Credentials flow)
// Caches the access token in-memory until expiry.

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

let cachedToken: { access_token: string; expires_at: number } | null = null;

export async function fetchAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables');
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify token error ${resp.status}: ${text}`);
  }

  const json: any = await resp.json();
  cachedToken = {
    access_token: json.access_token,
    // expires_in is seconds; subtract a small safety window (10s)
    expires_at: Date.now() + (json.expires_in * 1000) - 10_000,
  };
  return cachedToken.access_token;
}

export async function searchArtists(query: string, limit = 5) {
  if (!query.trim()) return [];
  const token = await fetchAccessToken();
  const params = new URLSearchParams({ q: query, type: 'artist', limit: String(limit) });
  const resp = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify search error ${resp.status}: ${text}`);
  }
  const data: any = await resp.json();
  const artists = data.artists?.items || [];
  return artists.map((a: any) => ({
    id: a.id,
    name: a.name,
    image: a.images?.[0]?.url || null,
    genres: a.genres,
    popularity: a.popularity,
    followers: a.followers?.total
  }));
}

export async function getTrackDetails(trackId: string) {
  const token = await fetchAccessToken();
  const resp = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify track error ${resp.status}: ${text}`);
  }
  const track: any = await resp.json();
  return {
    id: track.id,
    name: track.name,
    albumName: track.album?.name,
    albumImage: track.album?.images?.[0]?.url || null,
    artists: track.artists?.map((a: any) => a.name) || []
  };
}

export async function getArtistReleaseYears(artistId: string): Promise<string | null> {
  try {
    const token = await fetchAccessToken();
    
    // Get all albums for the artist (albums, singles, compilations)
    // We'll use a large limit to get as many releases as possible
    const params = new URLSearchParams({
      include_groups: 'album,single',
      market: 'US',
      limit: '50'
    });
    
    const resp = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      console.error(`Spotify albums error ${resp.status}`);
      return null;
    }

    const data: any = await resp.json();
    const albums = data.items || [];
    
    if (albums.length === 0) {
      return null;
    }

    // Extract release years from all albums
    const releaseYears = albums
      .map((album: any) => {
        const releaseDate = album.release_date;
        if (releaseDate) {
          // Release date can be YYYY, YYYY-MM, or YYYY-MM-DD
          const year = parseInt(releaseDate.split('-')[0]);
          return isNaN(year) ? null : year;
        }
        return null;
      })
      .filter((year: number | null) => year !== null)
      .sort((a: number, b: number) => a - b); // Sort ascending

    if (releaseYears.length === 0) {
      return null;
    }

    const firstYear = releaseYears[0];
    const lastYear = releaseYears[releaseYears.length - 1];
    
    // If same year, just return the year, otherwise return range with duration
    if (firstYear === lastYear) {
      return `${firstYear}`;
    } else {
      const duration = lastYear - firstYear + 1; // +1 to include both start and end years
      return `${firstYear} - ${lastYear} (${duration} Years)`;
    }
  } catch (error) {
    console.error('Error fetching artist release years:', error);
    return null;
  }
}
