import { useState, useEffect } from 'react';
import type { SpotifyDetails } from '../types';

export interface UseArtistInfoResult {
  details: SpotifyDetails | null;
  releaseYears: string | null;
  loading: boolean;
}

export function useArtistInfo(spotifyId: string | null | undefined): UseArtistInfoResult {
  const [details, setDetails] = useState<SpotifyDetails | null>(null);
  const [releaseYears, setReleaseYears] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!spotifyId) {
      setDetails(null);
      setReleaseYears(null);
      return;
    }

    setLoading(true);

    Promise.all([
      fetch(`/api/spotify-artist-details?spotifyId=${encodeURIComponent(spotifyId)}`).then(res => res.json()),
      fetch(`/api/spotify-release-years?spotifyId=${encodeURIComponent(spotifyId)}`).then(res => res.json()),
    ])
      .then(([detailsData, yearsData]) => {
        if (detailsData?.error) {
          console.error('Error fetching artist details:', detailsData.error);
          setDetails(null);
        } else {
          setDetails(detailsData);
        }

        if (yearsData?.error) {
          console.error('Error fetching artist release years:', yearsData.error);
          setReleaseYears(null);
        } else {
          setReleaseYears(yearsData?.activeYears ?? null);
        }
      })
      .catch(error => {
        console.error('Error fetching artist data:', error);
        setDetails(null);
        setReleaseYears(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [spotifyId]);

  return { details, releaseYears, loading };
}
