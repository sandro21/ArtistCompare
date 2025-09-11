"use client";
import { useState, useMemo, useCallback, useRef } from "react";
import Info from "../components/Info";
import TopStreams from "../components/TopStreams";
import Streams from "../components/Streams";
import RiaaCertifications from "../components/RiaaCertifications";
import Charts from "../components/Charts";
import Awards from "../components/Awards";
import GlareHover from "../blocks/Animations/GlareHover/GlareHover";
import SearchBar from "../components/SearchBar";
import Description from "../components/Description";
import StickyArtistImages from "../components/StickyArtistImages";
import type { Artist, ArtistPair } from "../types";

// Empty fallback objects for when no artists are selected
const emptyArtist: Artist = {
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
  },
  riaaCertifications: {
    Gold: 0,
    Platinum: 0,
    Diamond: 0,
  },
  charts: {
    billboardHot100Number1s: 0,
    billboardHot100Top10s: 0,
    billboard200Number1s: 0,
    totalWeeksOnHot100: 0,
  },
  awards: {
    grammyWins: 0,
    grammyNominations: 0,
  },
};

export default function Home() {
  const [pair, setPair] = useState<ArtistPair | null>(null);
  const [showContent, setShowContent] = useState(false);
  const searchBarRef = useRef<any>(null);

  const onSelectPair = useCallback((a: Artist, b: Artist) => {
    setPair({ a, b });
    // Desktop/tablet (>= md): immediately show content; Mobile/smaller waits for "Compare"
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, []);

  const handleBattleClick = useCallback(async (artist1: string, artist2: string) => {
    try {
      // Search for both artists
      const [search1, search2] = await Promise.all([
        fetch(`/api/spotify-search?q=${encodeURIComponent(artist1)}&limit=1`),
        fetch(`/api/spotify-search?q=${encodeURIComponent(artist2)}&limit=1`)
      ]);

      const [data1, data2] = await Promise.all([
        search1.json(),
        search2.json()
      ]);

      if (data1.results?.[0] && data2.results?.[0]) {
        const artistA = {
          artistName: data1.results[0].name,
          spotifyImageUrl: data1.results[0].image || 'https://via.placeholder.com/64?text=?',
          spotifyId: data1.results[0].id,
        } as Artist;

        const artistB = {
          artistName: data2.results[0].name,
          spotifyImageUrl: data2.results[0].image || 'https://via.placeholder.com/64?text=?',
          spotifyId: data2.results[0].id,
        } as Artist;

        // Set artists in search bars and call onSelectPair
        if (searchBarRef.current) {
          searchBarRef.current.setSelectedArtists(artistA, artistB);
        }
        onSelectPair(artistA, artistB);
      }
    } catch (error) {
      console.error('Error searching for artists:', error);
    }
  }, [onSelectPair]);

  const duo = useMemo(() => {
    if (pair) return [pair.a, pair.b];
    return [emptyArtist, emptyArtist]; // Use empty fallback instead of dummy data
  }, [pair]);

  return (
    <div className="flex flex-col items-center min-h-screen gap-12 pt-8 px-4 sm:px-6 pb-24 sm:pb-16 sm:gap-12">
      <section className="w-full flex flex-col items-center gap-12 sm:gap-6">
        <h1 className="text-center text-4xl md:text-5xl font-bold tracking-wide text-gray-200 uppercase">
          Artist Compare
        </h1>
        <SearchBar ref={searchBarRef} onSelectPair={onSelectPair} showStats={showContent} />
      </section>

      {!showContent && (
        <Description onBattleClick={handleBattleClick} />
      )}

      {showContent && (
        <section className="flex flex-col items-center gap-10 sm:gap-18 w-full relative">
          {/* Sticky Artist Images */}
          <StickyArtistImages artistA={duo[0]} artistB={duo[1]} />
          
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={400}
            transitionDuration={1200}
            playOnce={false}
            className="w-full h-auto bg-transparent border-none"
            style={{ background: 'none', width: '100%', maxWidth: '38rem', height: 'auto', border: 'none', borderRadius: '3rem' }}
          >
            <Info artistA={duo[0]} artistB={duo[1]} />
          </GlareHover>
          <TopStreams
            artistAId={duo[0]?.spotifyId || undefined}
            artistBId={duo[1]?.spotifyId || undefined}
            artistAName={duo[0]?.artistName || duo[0]?.name}
            artistBName={duo[1]?.artistName || duo[1]?.name}
          />

          <Streams artistA={duo[0]} artistB={duo[1]} />
          <Charts artistA={duo[0]} artistB={duo[1]} />
          <Awards artistA={duo[0]} artistB={duo[1]} />
          <RiaaCertifications artistA={duo[0]} artistB={duo[1]} />
        </section>
      )}

      {/* Mobile-only Compare button (no container background or borders) */}
      {!showContent && (
        <div className="md:hidden fixed inset-x-0 bottom-14 z-[999] pointer-events-none">
          <div className="mx-auto max-w-[80%] px-3 pointer-events-auto">
            <button
              disabled={!pair}
              onClick={() => pair && setShowContent(true)}
              className={`w-full py-3 text-lg font-semibold rounded-full transition active:scale-[0.99] shadow-[0_0_20px_rgba(16,185,129,0.5)] ${
                pair ? 'bg-emerald-500 text-black' : 'bg-emerald-800/40 text-emerald-300/70 cursor-not-allowed'
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
