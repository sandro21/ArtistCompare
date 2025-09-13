"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { generateComparisonUrl } from "../lib/seo-utils";
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const onSelectPair = useCallback((a: Artist, b: Artist) => {
    setPair({ a, b });
    // Desktop/tablet (>= md): immediately show content; Mobile/smaller waits for "Compare"
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
    
    // Generate SEO-friendly URL and update browser history
    if (a.artistName && b.artistName) {
      const seoUrl = generateComparisonUrl(a.artistName, b.artistName);
      window.history.replaceState({}, '', seoUrl);
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

  // Handle URL parameters for SEO-friendly URLs
  useEffect(() => {
    const artist1 = searchParams.get('artist1');
    const artist2 = searchParams.get('artist2');
    
    if (artist1 && artist2 && !pair) {
      // Pre-populate search bars with URL parameters
      handleBattleClick(artist1, artist2);
    }
  }, [searchParams, pair]);

  const duo = useMemo(() => {
    if (pair) return [pair.a, pair.b];
    return [emptyArtist, emptyArtist]; // Use empty fallback instead of dummy data
  }, [pair]);

  return (
    <div className={`flex flex-col items-center min-h-screen gap-[clamp(1rem,4vh,2rem)] pt-6 px-4 sm:px-6 sm:gap-8 ${showContent ? 'pb-24 sm:pb-16' : ''}`}>
      <section className="w-full flex flex-col items-center gap-[clamp(0.75rem,2.5vh,1.5rem)] sm:gap-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-gray-200 uppercase">
            Compare Music Artists
          </h1>
          {!showContent && (
            <p className="sm:hidden text-base text-gray-400 font-medium mt-2">
              Pick two artists. See who wins.
            </p>
          )}
        </div>
        <SearchBar 
          ref={searchBarRef} 
          onSelectPair={onSelectPair} 
          showStats={showContent}
          onCompareClick={() => pair && setShowContent(true)}
          hasPair={!!pair}
        />
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

       {/* Small About link at bottom */}
       <footer className="w-full text-center">
         <Link 
           href="/about" 
           className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
         >
           About Artist Compare
         </Link>
       </footer>

     </div>
   );
 }
