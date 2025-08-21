import React, { useState, useEffect } from 'react';
import ArtistCard from './ArtistCard';

interface InfoProps {
  artistA?: any;
  artistB?: any;
}

interface SpotifyDetails {
  totalTracks: number;
  totalAlbums: number;
  totalSingles: number;
  totalReleases: number;
}

// Empty fallback object for missing artist data
const emptyArtist = {
  artistName: '',
  name: '',
  spotifyId: null,
  spotifyImageUrl: '',
  activeYears: '',
  songsCount: 0,
  albumsCount: 0,
  streams: {
    spotifyRank: 0,
    monthlyListeners: 0,
    totalStreams: 0,
  }
};

const Info: React.FC<InfoProps> = ({ artistA, artistB }) => {
  const a = artistA || emptyArtist;
  const b = artistB || emptyArtist;

  const [aSpotifyDetails, setASpotifyDetails] = useState<SpotifyDetails | null>(null);
  const [bSpotifyDetails, setBSpotifyDetails] = useState<SpotifyDetails | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  // Fetch Spotify details for Artist A
  useEffect(() => {
    if (!a?.spotifyId) return;
    
    setLoadingA(true);
    fetch(`/api/spotify-artist-details?spotifyId=${encodeURIComponent(a.spotifyId)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching artist A details:', data.error);
          setASpotifyDetails(null);
        } else {
          setASpotifyDetails(data);
        }
      })
      .catch(error => {
        console.error('Error fetching artist A details:', error);
        setASpotifyDetails(null);
      })
      .finally(() => {
        setLoadingA(false);
      });
  }, [a?.spotifyId]);

  // Fetch Spotify details for Artist B
  useEffect(() => {
    if (!b?.spotifyId) return;
    
    setLoadingB(true);
    fetch(`/api/spotify-artist-details?spotifyId=${encodeURIComponent(b.spotifyId)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching artist B details:', data.error);
          setBSpotifyDetails(null);
        } else {
          setBSpotifyDetails(data);
        }
      })
      .catch(error => {
        console.error('Error fetching artist B details:', error);
        setBSpotifyDetails(null);
      })
      .finally(() => {
        setLoadingB(false);
      });
  }, [b?.spotifyId]);
  return (
    <div
      style={{
        width: '40rem',
        height: '24rem',
        flexShrink: 0,
        borderRadius: '1.5rem',
        border: '1px solid #4BE295',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 53.85%, rgba(65, 147, 105, 0.28) 100%)',
        boxShadow: '0 0 18.3px -3px #419369 inset, 0 0 20.6px 2px #419369'
      }}
      className="flex justify-between items-center p-10"
    >
      {/* Artist 1 */}
      {a && (
        <ArtistCard
          artistName={a.artistName || a.name}
          spotifyImageUrl={a.spotifyImageUrl || a.image || a.spotifyImage}
          activeYears={a.activeYears}
          songsCount={loadingA ? undefined : aSpotifyDetails?.totalTracks}
          albumsCount={loadingA ? undefined : aSpotifyDetails?.totalAlbums}
        />
      )}
      {/* Artist 2 */}
      {b && (
        <ArtistCard
          artistName={b.artistName || b.name}
          spotifyImageUrl={b.spotifyImageUrl || b.image || b.spotifyImage}
          activeYears={b.activeYears}
          songsCount={loadingB ? undefined : bSpotifyDetails?.totalTracks}
          albumsCount={loadingB ? undefined : bSpotifyDetails?.totalAlbums}
        />
      )}
    </div>
  );
};

export default Info; 