import { useState, useEffect } from 'react';
import type { MusicMetrics } from '../types';

export interface UseMusicMetricsResult {
  metrics: MusicMetrics | null;
  loading: boolean;
  error: string | null;
}

export function useMusicMetrics(
  artistName: string | undefined,
  spotifyId: string | null | undefined,
): UseMusicMetricsResult {
  const [metrics, setMetrics] = useState<MusicMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistName || !spotifyId) {
      setMetrics(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/music-metrics?artistName=${encodeURIComponent(artistName)}&spotifyId=${encodeURIComponent(spotifyId)}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        setMetrics(data);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        setMetrics(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [artistName, spotifyId]);

  return { metrics, loading, error };
}
