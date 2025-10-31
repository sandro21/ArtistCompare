import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { deobfuscateArtistNames } from '../../../../lib/seo-utils';
import { fetchAccessToken } from '../../../../lib/spotify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decoded = deobfuscateArtistNames(slug);

    if (!decoded) {
      return new Response('Invalid slug', { status: 404 });
    }

    const { artist1, artist2 } = decoded;

    // Fetch artist images from Spotify
    const token = await fetchAccessToken();
    const [artist1Data, artist2Data] = await Promise.all([
      fetchSpotifyArtist(artist1, token),
      fetchSpotifyArtist(artist2, token),
    ]);

    const artist1Image = artist1Data?.images?.[0]?.url || null;
    const artist2Image = artist2Data?.images?.[0]?.url || null;

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            padding: '60px',
          }}
        >
          {/* Artist 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              flex: 1,
            }}
          >
            {artist1Image ? (
              <img
                src={artist1Image}
                alt={artist1}
                width={280}
                height={280}
                style={{
                  borderRadius: '50%',
                  border: '4px solid #5EE9B5',
                  boxShadow: '0 0 20px #5EE9B5',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  backgroundColor: '#333',
                  border: '4px solid #5EE9B5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 72,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                {artist1[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <div
              style={{
                color: '#fff',
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {artist1.toUpperCase()}
            </div>
          </div>

          {/* VS Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5EE9B5',
              fontSize: 48,
              fontWeight: 'bold',
              textShadow: '0 0 10px #5EE9B5',
            }}
          >
            VS
          </div>

          {/* Artist 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              flex: 1,
            }}
          >
            {artist2Image ? (
              <img
                src={artist2Image}
                alt={artist2}
                width={280}
                height={280}
                style={{
                  borderRadius: '50%',
                  border: '4px solid #5EE9B5',
                  boxShadow: '0 0 20px #5EE9B5',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  backgroundColor: '#333',
                  border: '4px solid #5EE9B5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 72,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                {artist2[0]?.toUpperCase() || 'B'}
              </div>
            )}
            <div
              style={{
                color: '#fff',
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {artist2.toUpperCase()}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    // Return a default image on error
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              color: '#5EE9B5',
              fontSize: 48,
              fontWeight: 'bold',
            }}
          >
            Artist Compare
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

async function fetchSpotifyArtist(artistName: string, token: string) {
  try {
    const searchParams = new URLSearchParams({
      q: artistName,
      type: 'artist',
      limit: '1',
    });
    const response = await fetch(
      `https://api.spotify.com/v1/search?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.artists?.items?.[0] || null;
  } catch {
    return null;
  }
}
