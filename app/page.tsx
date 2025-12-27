"use client";
import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Info from "./sections/Info";
import TopStreams from "./sections/TopStreams";
import Streams from "./sections/Streams";
// import RiaaCertifications from "./sections/RiaaCertifications";
import Charts from "./sections/Charts";
import Awards from "./sections/Awards";
import GlareHover from "../blocks/Animations/GlareHover/GlareHover";
import SearchBar from "../components/SearchBar";
import StickyArtistImages from "../components/StickyArtistImages";
import QuickCompareBar from "../components/QuickCompareBar";
import type { Artist } from "../types";
import GoogleTrends from "./sections/GoogleTrends";
import { useLoadingScreen } from "../hooks/useLoadingScreen";
import { useArtistSelection } from "../hooks/useArtistSelection";
import { useGlowEffect } from "../hooks/useGlowEffect";

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
  // Custom hooks
  const { isInitialLoading, loadingProgress, startLoadingAnimation, stopLoading } = useLoadingScreen();
  const { pair, setPair, searchBarRef, hasUrlParams, onSelectPair } = useArtistSelection(startLoadingAnimation, isInitialLoading);
  const hasSeenGlow = useGlowEffect(!!pair, !!hasUrlParams);
  const searchParams = useSearchParams();

  const duo = useMemo(() => {
    if (pair) return [pair.a, pair.b];
    return [emptyArtist, emptyArtist]; // Use empty fallback instead of dummy data
  }, [pair]);

  // Get artist names from URL params for loading screen
  const urlArtist1 = searchParams.get('artist1');
  const urlArtist2 = searchParams.get('artist2');
  
  // Use actual names from pair if available, otherwise fall back to URL params
  const displayName1 = pair?.a?.artistName || pair?.a?.name || urlArtist1 || '';
  const displayName2 = pair?.b?.artistName || pair?.b?.name || urlArtist2 || '';

  return (
    <div 
      className={`pb-18 min-h-screen bg-black flex flex-col gap-6 sm:gap-8 md:gap-12 ${!pair && !hasUrlParams ? 'desktop-bg' : ''}`}
    >
      {/* Navbar */}
      <nav className="w-full h-16 sm:h-20 md:h-24 bg-gradient-to-r from-[#00FF44]/5 to-[#99FFD9]/12 backdrop-blur-xs rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[4rem] flex justify-between px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 animate-in fade-in duration-1000">
        <Link href="/" onClick={() => { setPair(null); stopLoading(); }} className="bg-[#5EE9B5] border-2 sm:border-3 border-[#376348] flex rounded-full items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4">
          <img src="/icon.png" alt="icon" className="w-8 h-8 sm:w-12 sm:h-12 md:w-15 md:h-15" />
          <span className="font-bold text-black text-lg sm:text-2xl md:text-4xl">{pair ? "Go Back" : "Artist Compare"}</span>
        </Link>
        <div className={`flex items-center pr-2 sm:pr-4 md:pr-6 ${pair ? 'hidden' : 'block'}`}>
          <Link href="/about" className="font-bold text-white text-sm sm:text-lg md:text-2xl">Learn More</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center gap-8 sm:gap-12 md:gap-18">
        {!pair && !hasUrlParams && (
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
                onCompareClick={() => {}}
                hasPair={!!pair}
                hasSeenGlow={hasSeenGlow}
              />
            </div>

            {/* Quick Compare Bar */}
            <div className="mt-6 sm:mt-0 animate-in fade-in duration-1000 delay-600">
              <QuickCompareBar />
            </div>

            {/* Banner
            <div className="fixed bottom-[20%] left-1/2 transform -translate-x-1/2 animate-in fade-in duration-1000 delay-700 w-full flex justify-center z-5">
              <img src="/banner.png" alt="banner" className="w-[70%]" />
            </div> */}

          </>
        )}

        {(pair || hasUrlParams) && (
          <>
            {/* Loading Screen */}
            {isInitialLoading && (
              <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300 overflow-hidden">
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-2xl opacity-20 animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                      }}
                    >
                      {['🎵', '🎶', '🎤', '🎧', '⭐'][Math.floor(Math.random() * 5)]}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="flex flex-col items-center gap-2">
                    {(displayName1 || displayName2) && (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-white font-bold text-xl sm:text-2xl md:text-3xl text-center">
                          {displayName1}
                        </div>
                        <div className="text-[#5EE9B5] font-black text-2xl sm:text-3xl md:text-4xl animate-bounce-subtle px-2">
                          VS
                        </div>
                        <div className="text-white font-bold text-xl sm:text-2xl md:text-3xl text-center">
                          {displayName2}
                        </div>
                      </div>
                    )}
                    <div className="w-48 sm:w-64 md:w-80 h-1 bg-[#5EE9B5]/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#5EE9B5] rounded-full transition-all duration-75 ease-linear" 
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-[#5EE9B5]/80 text-sm sm:text-base mt-2">
                      Loading comparison data...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content - Mount during loading (hidden) so APIs start fetching */}
            {pair && (
              <section 
                className={`flex flex-col items-center gap-10 sm:gap-18 w-[95%] sm:w-full relative ${
                  isInitialLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-in fade-in duration-500'
                }`}
              >
                {/* Sticky Artist Images */}
                <StickyArtistImages artistA={duo[0]} artistB={duo[1]} />
                <div>
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
                <TopStreams
                  artistAId={duo[0]?.spotifyId || undefined}
                  artistBId={duo[1]?.spotifyId || undefined}
                  artistAName={duo[0]?.artistName || duo[0]?.name}
                  artistBName={duo[1]?.artistName || duo[1]?.name}
                />
                <Streams artistA={duo[0]} artistB={duo[1]} />
                <Charts artistA={duo[0]} artistB={duo[1]} />
                <Awards artistA={duo[0]} artistB={duo[1]} />
                <GoogleTrends artistA={duo[0]} artistB={duo[1]} />
                
                {/* <div className="animate-in fade-in duration-1000 delay-1400">
                  <RiaaCertifications artistA={duo[0]} artistB={duo[1]} />
                </div> */}
                
              </section>
            )}
          </>
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
