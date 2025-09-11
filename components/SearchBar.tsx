"use client";
import React, { useState, useEffect, useRef } from 'react';
import type { Artist } from '../types';
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
  showStats?: boolean;
}

interface SearchBarRef {
  setSelectedArtists: (artistA: SelectedArtist, artistB: SelectedArtist) => void;
}

// Temporary local search over static list; will be replaced with API search later
const SearchBar = React.forwardRef<SearchBarRef, SearchBarProps>(({ onSelectPair, showStats = false }, ref) => {
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

  // Expose function to set selected artists from parent
  React.useImperativeHandle(ref, () => ({
    setSelectedArtists: (artistA: SelectedArtist, artistB: SelectedArtist) => {
      setSelectedA(artistA);
      setSelectedB(artistB);
      setQueryA("");
      setQueryB("");
    }
  }));

  const baseInputClasses = showStats 
    ? "w-full h-12 sm:h-16 rounded-full bg-transparent border border-emerald-400 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg font-medium outline-none focus:ring-2 focus:ring-emerald-300"
    : "w-full h-14 sm:h-16 rounded-full bg-transparent border border-emerald-400 px-4 sm:px-4 py-3 sm:py-3 text-lg sm:text-lg font-medium outline-none focus:ring-2 focus:ring-emerald-300";
  const listClasses = showStats
    ? "absolute z-20 mt-1 sm:mt-2 w-[calc(100%-0.5rem)] ml-1 max-h-60 sm:max-h-80 overflow-hidden rounded-2xl border border-emerald-400 bg-black/80 backdrop-blur-sm"
    : "absolute z-20 mt-1 sm:mt-2 w-[calc(100%-0.5rem)] ml-1 max-h-60 sm:max-h-80 overflow-hidden rounded-2xl border border-emerald-400 bg-black/80 backdrop-blur-md sm:backdrop-blur-sm";

  return (
    <div className="flex flex-col gap-2 sm:gap-6 w-full max-w-3xl mx-auto">
      {!showStats && <h2 className="sm:hidden text-white text-xl font-extrabold text-center mb-1">Choose Two Artists</h2>}
      <div className={`grid gap-2 sm:gap-16 ${showStats ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {/* Artist A */}
        <div className="relative">
          <label className={`${showStats ? 'block' : 'hidden sm:block'} mb-1 sm:mb-2 text-xs sm:text-sm text-center sm:text-left tracking-wide text-emerald-300 uppercase font-semibold`}>Artist One</label>
          {selectedA ? (
            <div className={`flex items-center justify-between gap-2 sm:gap-4 rounded-full border border-emerald-400 bg-gradient-to-b from-transparent to-emerald-800/30 ${showStats ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-4 sm:px-4 py-3 sm:py-3'}`}>
              <div className="flex items-center gap-2 sm:gap-4">
                <img src={selectedA.spotifyImageUrl} alt={selectedA.artistName} className={`rounded-full object-cover border border-emerald-400/50 ${showStats ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12 sm:w-14 sm:h-14'}`} />
                <span className={`font-bold text-white ${showStats ? 'text-sm sm:text-2xl' : 'text-lg sm:text-2xl'}`}>{selectedA.artistName}</span>
              </div>
              <button onClick={() => { setSelectedA(null); setQueryA(""); }} className="text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-500/20 transition-colors" title="Change artist">
                <svg className="w-10 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <input
                className={baseInputClasses}
                placeholder={showStats ? "Search for an artist..." : "Search Artist 1"}
                value={queryA}
                onChange={e => setQueryA(e.target.value)}
              />
              {(loadingA || errorA || resultsA.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {loadingA && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-emerald-300/70 font-medium`}>Searching...</li>
                    )}
                    {errorA && !loadingA && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-red-400 font-medium`}>{errorA}</li>
                    )}
                    {!loadingA && !errorA && resultsA.map(r => (
                      <li key={r.id}>
                        <button
                          className={`flex items-center w-full text-left hover:bg-emerald-500/20 rounded-xl ${showStats ? 'gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3' : 'gap-3 sm:gap-4 px-4 sm:px-4 py-3 sm:py-3'}`}
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
                          {r.image && <img src={r.image} className={`rounded-full object-cover border border-emerald-400/40 ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-10 sm:h-10'}`} />}
                          {!r.image && <div className={`rounded-full border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-medium ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10 text-xs' : 'w-10 h-10 sm:w-10 sm:h-10 text-base'}`}>N/A</div>}
                          <span className={`font-medium text-white ${showStats ? 'text-sm sm:text-base' : 'text-lg sm:text-base'}`}>{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!loadingA && !errorA && resultsA.length === 0 && queryA.trim() && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-emerald-300/60 font-medium`}>No results</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Artist B */}
        <div className="relative">
          <label className={`${showStats ? 'block' : 'hidden sm:block'} mb-1 sm:mb-2 text-xs sm:text-sm text-center sm:text-left tracking-wide text-emerald-300 uppercase font-semibold`}>Artist Two</label>
          {selectedB ? (
            <div className={`flex items-center justify-between gap-2 sm:gap-4 rounded-full border border-emerald-400 bg-gradient-to-b from-transparent to-emerald-800/30 ${showStats ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-4 sm:px-4 py-3 sm:py-3'}`}>
              <div className="flex items-center gap-2 sm:gap-4">
                <img src={selectedB.spotifyImageUrl} alt={selectedB.artistName} className={`rounded-full object-cover border border-emerald-400/50 ${showStats ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12 sm:w-14 sm:h-14'}`} />
                <span className={`font-bold text-white ${showStats ? 'text-sm sm:text-2xl' : 'text-lg sm:text-2xl'}`}>{selectedB.artistName}</span>
              </div>
              <button onClick={() => { setSelectedB(null); setQueryB(""); }} className="text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-500/20 transition-colors" title="Change artist">
                <svg className="w-10 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <input
                className={baseInputClasses}
                placeholder={showStats ? "Search for an artist..." : "Search Artist 2"}
                value={queryB}
                onChange={e => setQueryB(e.target.value)}
              />
              {(loadingB || errorB || resultsB.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {loadingB && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-emerald-300/70 font-medium`}>Searching...</li>
                    )}
                    {errorB && !loadingB && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-red-400 font-medium`}>{errorB}</li>
                    )}
                    {!loadingB && !errorB && resultsB.map(r => (
                      <li key={r.id}>
                        <button
                          className={`flex items-center w-full text-left hover:bg-emerald-500/20 rounded-xl ${showStats ? 'gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3' : 'gap-3 sm:gap-4 px-4 sm:px-4 py-3 sm:py-3'}`}
                          onClick={() => {
                            setSelectedB({
                              artistName: r.name,
                              spotifyImageUrl: r.image || 'https://via.placeholder.com/64?text=?',
                              spotifyId: r.id,
                            } as SelectedArtist);
                            setResultsB([]);
                          }}
                        >
                          {r.image && <img src={r.image} className={`rounded-full object-cover border border-emerald-400/40 ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-10 sm:h-10'}`} />}
                          {!r.image && <div className={`rounded-full border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-medium ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10 text-xs' : 'w-10 h-10 sm:w-10 sm:h-10 text-base'}`}>N/A</div>}
                          <span className={`font-medium text-white ${showStats ? 'text-sm sm:text-base' : 'text-lg sm:text-base'}`}>{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!loadingB && !errorB && resultsB.length === 0 && queryB.trim() && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-emerald-300/60 font-medium`}>No results</li>
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
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
