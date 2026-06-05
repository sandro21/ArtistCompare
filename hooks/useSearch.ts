import { useState, useEffect, useRef } from 'react';

export interface ArtistOption {
  id: string;
  name: string;
  image?: string;
}

export interface UseSearchResult {
  results: ArtistOption[];
  loading: boolean;
  error: string | null;
}

export function useSearch(query: string): UseSearchResult {
  const [results, setResults] = useState<ArtistOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setError(null);
      setLoading(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    setLoading(true);
    setError(null);

    const handle = setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const resp = await fetch(`/api/spotify-search?q=${encodeURIComponent(q)}&limit=3`, { signal: controller.signal });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || `HTTP ${resp.status}`);
        }
        const json = await resp.json();
        const mapped: ArtistOption[] = (json.results || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          image: a.image || undefined,
        }));
        setResults(mapped);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setError(e?.message || 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(handle);
  }, [query]);

  return { results, loading, error };
}
