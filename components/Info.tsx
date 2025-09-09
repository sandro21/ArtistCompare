import React, { useState, useEffect } from 'react';
import ArtistCard from './ArtistCard';
import type { Artist } from '../types';

interface InfoProps {
  artistA?: Artist | null;
  artistB?: Artist | null;
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
  const [aReleaseYears, setAReleaseYears] = useState<string | null>(null);
  const [bReleaseYears, setBReleaseYears] = useState<string | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  // Fetch Spotify details for Artist A
  useEffect(() => {
    if (!a?.spotifyId) return;
    
    setLoadingA(true);
    
    // Fetch both song/album details and release years in parallel
    Promise.all([
      fetch(`/api/spotify-artist-details?spotifyId=${encodeURIComponent(a.spotifyId)}`).then(res => res.json()),
      fetch(`/api/spotify-release-years?spotifyId=${encodeURIComponent(a.spotifyId)}`).then(res => res.json())
    ])
      .then(([detailsData, yearsData]) => {
        if (detailsData.error) {
          console.error('Error fetching artist A details:', detailsData.error);
          setASpotifyDetails(null);
        } else {
          setASpotifyDetails(detailsData);
        }
        
        if (yearsData.error) {
          console.error('Error fetching artist A release years:', yearsData.error);
          setAReleaseYears(null);
        } else {
          setAReleaseYears(yearsData.activeYears);
        }
      })
      .catch(error => {
        console.error('Error fetching artist A data:', error);
        setASpotifyDetails(null);
        setAReleaseYears(null);
      })
      .finally(() => {
        setLoadingA(false);
      });
  }, [a?.spotifyId]);

  // Fetch Spotify details for Artist B
  useEffect(() => {
    if (!b?.spotifyId) return;
    
    setLoadingB(true);
    
    // Fetch both song/album details and release years in parallel
    Promise.all([
      fetch(`/api/spotify-artist-details?spotifyId=${encodeURIComponent(b.spotifyId)}`).then(res => res.json()),
      fetch(`/api/spotify-release-years?spotifyId=${encodeURIComponent(b.spotifyId)}`).then(res => res.json())
    ])
      .then(([detailsData, yearsData]) => {
        if (detailsData.error) {
          console.error('Error fetching artist B details:', detailsData.error);
          setBSpotifyDetails(null);
        } else {
          setBSpotifyDetails(detailsData);
        }
        
        if (yearsData.error) {
          console.error('Error fetching artist B release years:', yearsData.error);
          setBReleaseYears(null);
        } else {
          setBReleaseYears(yearsData.activeYears);
        }
      })
      .catch(error => {
        console.error('Error fetching artist B data:', error);
        setBSpotifyDetails(null);
        setBReleaseYears(null);
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
        borderRadius: '3rem',
        border: '1px solid #4BE295',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 53.85%, rgba(65, 147, 105, 0.28) 100%)',
        boxShadow: '0 0 18.3px -3px #419369 inset, 0 0 20.6px 2px #419369'
      }}
      className="flex justify-between items-center p-10"
    >
      {/* Artist 1 */}
      {a && (
        <ArtistCard
          artistName={(a.artistName || a.name) || ''}
          spotifyImageUrl={a.spotifyImageUrl || ''}
          activeYears={aReleaseYears || a.activeYears}
          songsCount={loadingA ? undefined : aSpotifyDetails?.totalTracks}
          albumsCount={loadingA ? undefined : aSpotifyDetails?.totalAlbums}
        />
      )}
      {/* Artist 2 */}
      {b && (
        <ArtistCard
          artistName={(b.artistName || b.name) || ''}
          spotifyImageUrl={b.spotifyImageUrl || ''}
          activeYears={bReleaseYears || b.activeYears}
          songsCount={loadingB ? undefined : bSpotifyDetails?.totalTracks}
          albumsCount={loadingB ? undefined : bSpotifyDetails?.totalAlbums}
        />
      )}
    </div>
  );
};

export default Info; 