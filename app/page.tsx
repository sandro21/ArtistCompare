"use client";
import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Info from "../components/Info";
import TopStreams from "../components/TopStreams";
import Streams from "../components/Streams";
// import RiaaCertifications from "../components/RiaaCertifications";
import Charts from "../components/Charts";
import Awards from "../components/Awards";
import GlareHover from "../blocks/Animations/GlareHover/GlareHover";
import SearchBar from "../components/SearchBar";
import StickyArtistImages from "../components/StickyArtistImages";
import QuickCompareBar from "../components/QuickCompareBar";
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

function HomeContent() {
  const [pair, setPair] = useState<ArtistPair | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [hasSeenGlow, setHasSeenGlow] = useState(false);
  const searchBarRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const onSelectPair = useCallback((a: Artist, b: Artist) => {
    setPair({ a, b });
    // Show content immediately for both mobile and desktop when both artists are selected
    setShowContent(true);
    
    // Generate SEO-friendly URL and update browser history
    if (a.artistName && b.artistName) {
      const seoUrl = generateComparisonUrl(a.artistName, b.artistName);
      window.history.pushState({ showContent: true }, '', seoUrl);
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

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // When user clicks back button, reset to homepage
      setShowContent(false);
      setPair(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Trigger one-time glow effect when user first enters
  useEffect(() => {
    if (!hasSeenGlow && !showContent) {
      const timer = setTimeout(() => {
        setHasSeenGlow(true);
      }, 1000); // Start glow after 1 second
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenGlow, showContent]);

  // Stop glow effect after duration
  useEffect(() => {
    if (hasSeenGlow) {
      const timer = setTimeout(() => {
        setHasSeenGlow(false);
      }, 3000); // Stop glow after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenGlow]);

  const duo = useMemo(() => {
    if (pair) return [pair.a, pair.b];
    return [emptyArtist, emptyArtist]; // Use empty fallback instead of dummy data
  }, [pair]);

  return (
    <div className="min-h-screen bg-black flex flex-col gap-6 sm:gap-8 md:gap-12">
      {/* Navbar */}
      <nav className="w-full h-16 sm:h-20 md:h-24 bg-gradient-to-r from-[#00FF44]/5 to-[#99FFD9]/12 rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[4rem] flex justify-between px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 animate-in fade-in duration-1000">
        <Link href="/" onClick={() => { setShowContent(false); setPair(null); }} className="bg-[#5EE9B5] border-2 sm:border-3 border-[#376348] flex rounded-full items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4">
          <img src="/icon.png" alt="icon" className="w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15" />
          <span className="font-bold text-black text-lg sm:text-2xl md:text-4xl">{showContent ? "Go Back" : "Artist Compare"}</span>
        </Link>
        <div className={`bg-[#5EE9B5] border-2 sm:border-3 border-[#376348] flex rounded-full items-center px-2 sm:px-3 md:px-4 ${showContent ? 'hidden' : 'block'}`}>
          <Link href="/about" className="font-bold text-black text-sm sm:text-lg md:text-2xl">Learn More</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center gap-8 sm:gap-12 md:gap-18">
        {!showContent && (
          <>
            {/* Header */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 animate-in fade-in duration-1000 delay-200">
              <div className="bg-[#5EE9B5]/10 border-2 border-[#376348] flex rounded-full items-center px-3 py-1 transition-colors duration-200 cursor-pointer hover:bg-[#5EE9B5]/20 hover:border-[#5EE9B5] mb-1 sm:mb-0">
                <span className="font-normal text-[#5EE9B5] text-sm sm:text-base">Real Statistics</span>
              </div>
              <div className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center">
                Settle The <span className="bg-gradient-to-r from-white/100 to-[#5EE9B5] bg-clip-text text-transparent">Debate</span>
              </div>
              <div className="text-white font-medium text-base sm:text-lg md:text-xl lg:text-2xl text-center">Just Select Two Artists and see the magic</div>
            </div>

            {/* Search Bar Components */}
            <div className="flex justify-center gap-8 animate-in fade-in duration-1000 delay-500 relative z-10">
              <SearchBar 
                ref={searchBarRef} 
                onSelectPair={onSelectPair} 
                showStats={false}
                onCompareClick={() => pair && setShowContent(true)}
                hasPair={!!pair}
                hasSeenGlow={hasSeenGlow}
              />
            </div>

            {/* Quick Compare Bar */}
            <div className="px-4 mt-6 sm:mt-0 animate-in fade-in duration-1000 delay-600">
              <QuickCompareBar />
            </div>

            {/* Banner
            <div className="fixed bottom-[20%] left-1/2 transform -translate-x-1/2 animate-in fade-in duration-1000 delay-700 w-full flex justify-center z-5">
              <img src="/banner.png" alt="banner" className="w-[70%]" />
            </div> */}

          </>
        )}

        {showContent && (
          <section className="flex flex-col items-center gap-10 sm:gap-18 w-full relative animate-in fade-in duration-1000 delay-200 mb-15">
            {/* Sticky Artist Images */}
            <StickyArtistImages artistA={duo[0]} artistB={duo[1]} />
            
            <div className="animate-in fade-in duration-1000 delay-400">
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
            </div>
            
            <div className="animate-in fade-in duration-1000 delay-600">
              <TopStreams
                artistAId={duo[0]?.spotifyId || undefined}
                artistBId={duo[1]?.spotifyId || undefined}
                artistAName={duo[0]?.artistName || duo[0]?.name}
                artistBName={duo[1]?.artistName || duo[1]?.name}
              />
            </div>

            <div className="animate-in fade-in duration-1000 delay-800">
              <Streams artistA={duo[0]} artistB={duo[1]} />
            </div>
            
            <div className="animate-in fade-in duration-1000 delay-1000">
              <Charts artistA={duo[0]} artistB={duo[1]} />
            </div>
            
            <div className="animate-in fade-in duration-1000 delay-1200">
              <Awards artistA={duo[0]} artistB={duo[1]} />
            </div>
            
            {/* <div className="animate-in fade-in duration-1000 delay-1400">
              <RiaaCertifications artistA={duo[0]} artistB={duo[1]} />
            </div> */}
          </section>
        )}
      </main>

    </div>
  );
 }

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
