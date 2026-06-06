import { useState, useEffect } from 'react';
import type { TicketInfo } from '../types';

export interface UseTicketsResult {
  tickets: TicketInfo | null;
  loading: boolean;
  error: string | null;
}

export function useTickets(
  spotifyId: string | null | undefined,
  artistName: string | undefined,
): UseTicketsResult {
  const [tickets, setTickets] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spotifyId || !artistName) {
      setTickets(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/tickets?spotifyId=${encodeURIComponent(spotifyId)}&artistName=${encodeURIComponent(artistName)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: TicketInfo) => {
        if (!cancelled) setTickets(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
          setTickets(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [spotifyId, artistName]);

  return { tickets, loading, error };
}
