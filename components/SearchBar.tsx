"use client";
import React, { useState, useEffect, useRef } from 'react';
// staticArtists import removed; both sides now use live Spotify search

interface ArtistOption {
  id: string;
  name: string;
  image?: string;
}

interface SelectedArtist extends Record<string, any> {
  artistName: string;
  spotifyImageUrl: string;
  spotifyId: string; // keep original Spotify artist id
}

interface SearchBarProps {
  onSelectPair: (artistA: SelectedArtist, artistB: SelectedArtist) => void;
}

// Temporary local search over static list; will be replaced with API search later
const SearchBar: React.FC<SearchBarProps> = ({ onSelectPair }) => {
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [resultsA, setResultsA] = useState<ArtistOption[]>([]);
  const [resultsB, setResultsB] = useState<ArtistOption[]>([]);
  const [selectedA, setSelectedA] = useState<SelectedArtist | null>(null);
  const [selectedB, setSelectedB] = useState<SelectedArtist | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [loadingB, setLoadingB] = useState(false);
  const [errorB, setErrorB] = useState<string | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const fetchAbortRefB = useRef<AbortController | null>(null);

  // Live Spotify search (debounced) for Artist A
  useEffect(() => {
    const q = queryA.trim();
    if (!q) {
      setResultsA([]);
      setErrorA(null);
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
      return;
    }
    setLoadingA(true);
    setErrorA(null);
    const handle = setTimeout(async () => {
      try {
        if (fetchAbortRef.current) fetchAbortRef.current.abort();
        const controller = new AbortController();
        fetchAbortRef.current = controller;
  const resp = await fetch(`/api/spotify-search?q=${encodeURIComponent(q)}&limit=3`, { signal: controller.signal });
        if (!resp.ok) {
          const text = await resp.text();
            throw new Error(text || `HTTP ${resp.status}`);
        }
        const json = await resp.json();
        const mapped = (json.results || []).map((a: any): ArtistOption => ({
          id: a.id,
          name: a.name,
          image: a.image || undefined,
        }));
        setResultsA(mapped);
      } catch (e: any) {
        if (e?.name === 'AbortError') return; // ignore aborted
        setErrorA(e.message || 'Search failed');
        setResultsA([]);
      } finally {
        setLoadingA(false);
      }
    }, 350); // debounce ms
    return () => clearTimeout(handle);
  }, [queryA]);

  // Live Spotify search (debounced) for Artist B
  useEffect(() => {
    const q = queryB.trim();
    if (!q) {
      setResultsB([]);
      setErrorB(null);
      if (fetchAbortRefB.current) fetchAbortRefB.current.abort();
      return;
    }
    setLoadingB(true);
    setErrorB(null);
    const handle = setTimeout(async () => {
      try {
        if (fetchAbortRefB.current) fetchAbortRefB.current.abort();
        const controller = new AbortController();
        fetchAbortRefB.current = controller;
        const resp = await fetch(`/api/spotify-search?q=${encodeURIComponent(q)}&limit=3`, { signal: controller.signal });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || `HTTP ${resp.status}`);
        }
        const json = await resp.json();
        const mapped = (json.results || []).map((a: any): ArtistOption => ({
          id: a.id,
          name: a.name,
          image: a.image || undefined,
        }));
        setResultsB(mapped);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setErrorB(e.message || 'Search failed');
        setResultsB([]);
      } finally {
        setLoadingB(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [queryB]);

  useEffect(() => {
    if (selectedA && selectedB) {
      onSelectPair(selectedA, selectedB);
    }
  }, [selectedA, selectedB, onSelectPair]);

  const baseInputClasses = "w-full rounded-lg bg-transparent border border-emerald-400 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300";
  const listClasses = "absolute z-20 mt-1 w-full max-h-40 overflow-auto rounded-lg border border-emerald-400 bg-black/80 backdrop-blur-sm";

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Artist A */}
        <div className="relative">
          <label className="block mb-1 text-xs tracking-wide text-emerald-300 uppercase">Artist One</label>
          {selectedA ? (
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-emerald-400 bg-gradient-to-b from-transparent to-emerald-600/20">
              <div className="flex items-center gap-3">
                <img src={selectedA.spotifyImageUrl} alt={selectedA.artistName} className="w-12 h-12 rounded-full object-cover border border-emerald-400/50" />
                <span className="font-semibold">{selectedA.artistName}</span>
              </div>
              <button onClick={() => { setSelectedA(null); setQueryA(""); }} className="text-xs text-emerald-300 hover:text-white">Change</button>
            </div>
          ) : (
            <div>
              <input
                className={baseInputClasses}
                placeholder="Search artist (live Spotify)..."
                value={queryA}
                onChange={e => setQueryA(e.target.value)}
              />
              {(loadingA || errorA || resultsA.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {loadingA && (
                      <li className="px-3 py-2 text-xs text-emerald-300/70">Searching...</li>
                    )}
                    {errorA && !loadingA && (
                      <li className="px-3 py-2 text-xs text-red-400">{errorA}</li>
                    )}
                    {!loadingA && !errorA && resultsA.map(r => (
                      <li key={r.id}>
                        <button
                          className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-emerald-500/20"
                          onClick={() => {
                            // Build a minimal SelectedArtist object from API result
                            setSelectedA({
                              artistName: r.name,
                              spotifyImageUrl: r.image || 'https://via.placeholder.com/64?text=?',
                              spotifyId: r.id,
                            } as SelectedArtist);
                            setResultsA([]);
                          }}
                        >
                          {r.image && <img src={r.image} className="w-8 h-8 rounded-full object-cover border border-emerald-400/40" />}
                          {!r.image && <div className="w-8 h-8 rounded-full border border-emerald-400/40 flex items-center justify-center text-[10px] text-emerald-300">N/A</div>}
                          <span className="text-sm">{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!loadingA && !errorA && resultsA.length === 0 && queryA.trim() && (
                      <li className="px-3 py-2 text-xs text-emerald-300/60">No results</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Artist B */}
        <div className="relative">
          <label className="block mb-1 text-xs tracking-wide text-emerald-300 uppercase">Artist Two</label>
          {selectedB ? (
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-emerald-400 bg-gradient-to-b from-transparent to-emerald-600/20">
              <div className="flex items-center gap-3">
                <img src={selectedB.spotifyImageUrl} alt={selectedB.artistName} className="w-12 h-12 rounded-full object-cover border border-emerald-400/50" />
                <span className="font-semibold">{selectedB.artistName}</span>
              </div>
              <button onClick={() => { setSelectedB(null); setQueryB(""); }} className="text-xs text-emerald-300 hover:text-white">Change</button>
            </div>
          ) : (
            <div>
              <input
                className={baseInputClasses}
                placeholder="Search artist (live Spotify)..."
                value={queryB}
                onChange={e => setQueryB(e.target.value)}
              />
              {(loadingB || errorB || resultsB.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {loadingB && (
                      <li className="px-3 py-2 text-xs text-emerald-300/70">Searching...</li>
                    )}
                    {errorB && !loadingB && (
                      <li className="px-3 py-2 text-xs text-red-400">{errorB}</li>
                    )}
                    {!loadingB && !errorB && resultsB.map(r => (
                      <li key={r.id}>
                        <button
                          className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-emerald-500/20"
                          onClick={() => {
                            setSelectedB({
                              artistName: r.name,
                              spotifyImageUrl: r.image || 'https://via.placeholder.com/64?text=?',
                              spotifyId: r.id,
                            } as SelectedArtist);
                            setResultsB([]);
                          }}
                        >
                          {r.image && <img src={r.image} className="w-8 h-8 rounded-full object-cover border border-emerald-400/40" />}
                          {!r.image && <div className="w-8 h-8 rounded-full border border-emerald-400/40 flex items-center justify-center text-[10px] text-emerald-300">N/A</div>}
                          <span className="text-sm">{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!loadingB && !errorB && resultsB.length === 0 && queryB.trim() && (
                      <li className="px-3 py-2 text-xs text-emerald-300/60">No results</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
