"use client";
import React, { useState } from 'react';
import { useSearch, ArtistOption } from '../hooks/useSearch';
import type { SelectedArtist } from '../types';

interface SearchBarProps {
  selectedA: SelectedArtist | null;
  selectedB: SelectedArtist | null;
  onSelectA: (artist: SelectedArtist | null) => void;
  onSelectB: (artist: SelectedArtist | null) => void;
  showStats?: boolean;
  onCompareClick?: () => void;
  hasPair?: boolean;
  hasSeenGlow?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  selectedA,
  selectedB,
  onSelectA,
  onSelectB,
  showStats = false,
  hasSeenGlow = false,
}) => {
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const searchA = useSearch(queryA);
  const searchB = useSearch(queryB);

  const baseInputClasses = showStats
    ? "w-[80%] h-12 sm:h-16 rounded-full bg-transparent border border-[#5EE9B5] px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg font-medium outline-none focus:ring-2 focus:ring-[#5EE9B5]"
    : `w-96 min-w-96 border-2 border-[#5EE9B5]/80 rounded-full bg-gradient-to-r from-[#0A0D0B] to-[#0F1412] px-6 py-3 text-white font-medium text-xl outline-none placeholder-white/70 focus:border-4 focus:border-[#5EE9B5] focus:bg-gradient-to-r focus:from-[#1A231F] focus:to-[#24302A] focus:shadow-[0_0_15px_rgba(94,233,181,0.4)] transition-all duration-1000 ease-in-out`;
  const listClasses = showStats
    ? "absolute z-20 mt-1 sm:mt-2 w-[calc(100%-0.5rem)] ml-1 max-h-60 sm:max-h-80 overflow-hidden rounded-2xl border border-[#5EE9B5] bg-black/80 backdrop-blur-sm"
    : "absolute z-20 mt-1 w-[calc(100%-0.5rem)] ml-1 max-h-60 overflow-hidden rounded-2xl border border-[#5EE9B5] bg-gradient-to-r from-[#1A231F] to-[#24302A] backdrop-blur-sm";

  const pickArtist = (r: ArtistOption): SelectedArtist => ({
    artistName: r.name,
    spotifyImageUrl: r.image || 'https://via.placeholder.com/64?text=?',
    spotifyId: r.id,
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
      <div className={`${showStats ? 'grid grid-cols-2 gap-3 sm:gap-16' : 'flex flex-col sm:flex-row justify-center gap-4 sm:gap-8'}`}>
        {/* Artist A */}
        <div className={`relative ${showStats ? 'w-full' : 'w-full'}`}>
          <label className={`${showStats ? 'block' : 'hidden'} mb-1 sm:mb-2 text-xs sm:text-sm text-center sm:text-left tracking-wide text-[#5EE9B5] uppercase font-semibold`}>Artist One</label>
          {selectedA ? (
            <div className={`flex items-center justify-between gap-2 sm:gap-4 rounded-full border-5 border-[#5EE9B5] bg-gradient-to-r from-[#1A231F] to-[#24302A] min-w-96 ${showStats ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-6 py-3'}`} style={{ boxShadow: '0 0 15px rgba(94, 233, 181, 1)' }}>
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <img src={selectedA.spotifyImageUrl} alt={selectedA.artistName} className={`rounded-full object-cover border border-[#5EE9B5]/50 flex-shrink-0 ${showStats ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12'}`} />
                <span className={`font-bold text-white truncate ${showStats ? 'text-sm sm:text-2xl' : 'text-2xl'}`}>{selectedA.artistName}</span>
              </div>
              <button onClick={() => { onSelectA(null); setQueryA(""); }} className="text-white hover:text-[#5EE9B5] p-1 rounded-full hover:bg-[#5EE9B5]/20 transition-colors flex-shrink-0" title="Change artist">
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
                style={hasSeenGlow ? {
                  boxShadow: '0 0 15px rgba(94, 233, 181, 0.3), 0 0 25px rgba(94, 233, 181, 0.2), 0 0 35px rgba(94, 233, 181, 0.1)',
                  transition: 'box-shadow 1s ease-in-out'
                } : { transition: 'box-shadow 1s ease-in-out' }}
              />
              {(searchA.loading || searchA.error || searchA.results.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {searchA.loading && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-[#5EE9B5]/70 font-medium`}>Searching...</li>
                    )}
                    {searchA.error && !searchA.loading && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-red-400 font-medium`}>{searchA.error}</li>
                    )}
                    {!searchA.loading && !searchA.error && searchA.results.map(r => (
                      <li key={r.id}>
                        <button
                          className={`flex items-center w-full text-left hover:bg-[#5EE9B5]/20 rounded-xl ${showStats ? 'gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3' : 'gap-3 px-4 py-3'}`}
                          onClick={() => {
                            onSelectA(pickArtist(r));
                            setQueryA("");
                          }}
                        >
                          {r.image && <img src={r.image} className={`rounded-full object-cover border border-[#5EE9B5]/40 ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-8 h-8'}`} />}
                          {!r.image && <div className={`rounded-full border border-[#5EE9B5]/40 flex items-center justify-center text-white font-medium ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10 text-xs' : 'w-8 h-8 text-sm'}`}>N/A</div>}
                          <span className={`font-medium text-white ${showStats ? 'text-sm sm:text-base' : 'text-lg'}`}>{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!searchA.loading && !searchA.error && searchA.results.length === 0 && queryA.trim() && (
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
            <div className={`flex items-center justify-between gap-2 sm:gap-4 rounded-full border-4 border-[#5EE9B5] bg-gradient-to-r from-[#1A231F] to-[#24302A] min-w-96 ${showStats ? 'px-3 sm:px-4 py-2 sm:py-3' : 'px-6 py-3'}`} style={{ boxShadow: '0 0 15px rgba(94, 233, 181, 0.4)' }}>
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <img src={selectedB.spotifyImageUrl} alt={selectedB.artistName} className={`rounded-full object-cover border border-[#5EE9B5]/50 flex-shrink-0 ${showStats ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12'}`} />
                <span className={`font-bold text-white truncate ${showStats ? 'text-sm sm:text-2xl' : 'text-2xl'}`}>{selectedB.artistName}</span>
              </div>
              <button onClick={() => { onSelectB(null); setQueryB(""); }} className="text-white hover:text-[#5EE9B5] p-1 rounded-full hover:bg-[#5EE9B5]/20 transition-colors flex-shrink-0" title="Change artist">
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
                style={hasSeenGlow ? {
                  boxShadow: '0 0 15px rgba(94, 233, 181, 0.3), 0 0 25px rgba(94, 233, 181, 0.2), 0 0 35px rgba(94, 233, 181, 0.1)',
                  transition: 'box-shadow 1s ease-in-out'
                } : { transition: 'box-shadow 1s ease-in-out' }}
              />
              {(searchB.loading || searchB.error || searchB.results.length > 0) && (
                <div className="relative">
                  <ul className={listClasses}>
                    {searchB.loading && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-[#5EE9B5]/70 font-medium`}>Searching...</li>
                    )}
                    {searchB.error && !searchB.loading && (
                      <li className={`${showStats ? 'px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm' : 'px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-sm'} text-red-400 font-medium`}>{searchB.error}</li>
                    )}
                    {!searchB.loading && !searchB.error && searchB.results.map(r => (
                      <li key={r.id}>
                        <button
                          className={`flex items-center w-full text-left hover:bg-[#5EE9B5]/20 rounded-xl ${showStats ? 'gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3' : 'gap-3 px-4 py-3'}`}
                          onClick={() => {
                            onSelectB(pickArtist(r));
                            setQueryB("");
                          }}
                        >
                          {r.image && <img src={r.image} className={`rounded-full object-cover border border-[#5EE9B5]/40 ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-8 h-8'}`} />}
                          {!r.image && <div className={`rounded-full border border-[#5EE9B5]/40 flex items-center justify-center text-white font-medium ${showStats ? 'w-8 h-8 sm:w-10 sm:h-10 text-xs' : 'w-8 h-8 text-sm'}`}>N/A</div>}
                          <span className={`font-medium text-white ${showStats ? 'text-sm sm:text-base' : 'text-lg'}`}>{r.name}</span>
                        </button>
                      </li>
                    ))}
                    {!searchB.loading && !searchB.error && searchB.results.length === 0 && queryB.trim() && (
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
};

export default SearchBar;
