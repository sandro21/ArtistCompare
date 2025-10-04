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
  onCompareClick?: () => void;
  hasPair?: boolean;
}

interface SearchBarRef {
  setSelectedArtists: (artistA: SelectedArtist, artistB: SelectedArtist) => void;
}

// Temporary local search over static list; will be replaced with API search later
const SearchBar = React.forwardRef<SearchBarRef, SearchBarProps>(({ onSelectPair, showStats = false, onCompareClick, hasPair = false }, ref) => {
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
    ? "w-full h-12 sm:h-16 rounded-full bg-transparent border border-[#5EE9B5] px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg font-medium outline-none focus:ring-2 focus:ring-[#5EE9B5]"
    : "w-96 min-w-96 border-3 border-[#376348] rounded-full bg-gradient-to-r from-[#0F1412] to-[#1A1F1C] px-6 py-3 text-white font-medium text-xl outline-none placeholder-white/70 focus:border-[#5EE9B5] focus:bg-gradient-to-r focus:from-[#1A231F] focus:to-[#24302A] transition-all duration-300";
  const listClasses = showStats
    ? "absolute z-20 mt-1 sm:mt-2 w-[calc(100%-0.5rem)] ml-1 max-h-60 sm:max-h-80 overflow-hidden rounded-2xl border border-[#5EE9B5] bg-black/80 backdrop-blur-sm"
    : "absolute z-20 mt-1 w-[calc(100%-0.5rem)] ml-1 max-h-60 overflow-hidden rounded-2xl border border-[#5EE9B5] bg-gradient-to-r from-[#1A231F] to-[#24302A] backdrop-blur-sm";

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
      <div className={`${showStats ? 'grid grid-cols-2 gap-3 sm:gap-16' : 'flex justify-center gap-8'}`}>
        {/* Artist A */}
        <div className={`relative ${showStats ? 'w-full' : 'w-full'}`}>
          <label className={`${showStats ? 'block' : 'hidden'} mb-1 sm:mb-2 text-xs sm:text-sm text-center sm:text-left tracking-wide text-[#5EE9B5] uppercase font-semibold`}>Artist One</label>
          {selectedA ? (
            <div className={`flex items-center justify-between gap-2 sm:gap-4 rounded-full border-3 border-[#5EE9B5] bg-gradient-to-r from-[#1A231F] to-[#24302A] min-w-96 ${showStats ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-6 py-3'}`}>
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <img src={selectedA.spotifyImageUrl} alt={selectedA.artistName} className={`rounded-full object-cover border border-[#5EE9B5]/50 flex-shrink-0 ${showStats ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12'}`} />
                <span className={`font-bold text-white truncate ${showStats ? 'text-sm sm:text-2xl' : 'text-2xl'}`}>{selectedA.artistName}</span>
              </div>
              <button onClick={() => { setSelectedA(null); setQueryA(""); }} className="text-white hover:text-[#5EE9B5] p-1 rounded-full hover:bg-[#5EE9B5]/20 transition-colors flex-shrink-0" title="Change artist">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <input
                className={baseInputClasses}
                placeholder="Search Artist 1..."
                value={queryA}
                onChange={e => setQueryA(e.target.value)}
              />
              {(loadingA || errorA || resultsA.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {loadingA && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-[#5EE9B5]/70 font-medium`}>Searching...</li>
                    )}
                    {errorA && !loadingA && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-red-400 font-medium`}>{errorA}</li>
                    )}
                    {!loadingA && !errorA && resultsA.map(r => (
                      <li key={r.id}>
                        <button
                          className={`flex items-center w-full text-left hover:bg-[#5EE9B5]/20 rounded-xl ${showStats ? 'gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3' : 'gap-3 px-4 py-3'}`}
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
                          {r.image && <img src={r.image} className={`rounded-full object-cover border border-[#5EE9B5]/40 ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-8 h-8'}`} />}
                          {!r.image && <div className={`rounded-full border border-[#5EE9B5]/40 flex items-center justify-center text-white font-medium ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10 text-xs' : 'w-8 h-8 text-sm'}`}>N/A</div>}
                          <span className={`font-medium text-white ${showStats ? 'text-sm sm:text-base' : 'text-lg'}`}>{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!loadingA && !errorA && resultsA.length === 0 && queryA.trim() && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-[#5EE9B5]/60 font-medium`}>No results</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Artist B */}
        <div className={`relative ${showStats ? 'w-full' : 'w-full'}`}>
          <label className={`${showStats ? 'block' : 'hidden'} mb-1 sm:mb-2 text-xs sm:text-sm text-center sm:text-left tracking-wide text-[#5EE9B5] uppercase font-semibold`}>Artist Two</label>
          {selectedB ? (
            <div className={`flex items-center justify-between gap-2 sm:gap-4 rounded-full border-3 border-[#5EE9B5] bg-gradient-to-r from-[#1A231F] to-[#24302A] min-w-96 ${showStats ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-6 py-3'}`}>
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <img src={selectedB.spotifyImageUrl} alt={selectedB.artistName} className={`rounded-full object-cover border border-[#5EE9B5]/50 flex-shrink-0 ${showStats ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12'}`} />
                <span className={`font-bold text-white truncate ${showStats ? 'text-sm sm:text-2xl' : 'text-2xl'}`}>{selectedB.artistName}</span>
              </div>
              <button onClick={() => { setSelectedB(null); setQueryB(""); }} className="text-white hover:text-[#5EE9B5] p-1 rounded-full hover:bg-[#5EE9B5]/20 transition-colors flex-shrink-0" title="Change artist">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <input
                className={baseInputClasses}
                placeholder="Search Artist 2..."
                value={queryB}
                onChange={e => setQueryB(e.target.value)}
              />
              {(loadingB || errorB || resultsB.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {loadingB && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-[#5EE9B5]/70 font-medium`}>Searching...</li>
                    )}
                    {errorB && !loadingB && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-red-400 font-medium`}>{errorB}</li>
                    )}
                    {!loadingB && !errorB && resultsB.map(r => (
                      <li key={r.id}>
                        <button
                          className={`flex items-center w-full text-left hover:bg-[#5EE9B5]/20 rounded-xl ${showStats ? 'gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3' : 'gap-3 px-4 py-3'}`}
                          onClick={() => {
                            setSelectedB({
                              artistName: r.name,
                              spotifyImageUrl: r.image || 'https://via.placeholder.com/64?text=?',
                              spotifyId: r.id,
                            } as SelectedArtist);
                            setResultsB([]);
                          }}
                        >
                          {r.image && <img src={r.image} className={`rounded-full object-cover border border-[#5EE9B5]/40 ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-8 h-8'}`} />}
                          {!r.image && <div className={`rounded-full border border-[#5EE9B5]/40 flex items-center justify-center text-white font-medium ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10 text-xs' : 'w-8 h-8 text-sm'}`}>N/A</div>}
                          <span className={`font-medium text-white ${showStats ? 'text-sm sm:text-base' : 'text-lg'}`}>{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!loadingB && !errorB && resultsB.length === 0 && queryB.trim() && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-[#5EE9B5]/60 font-medium`}>No results</li>
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
