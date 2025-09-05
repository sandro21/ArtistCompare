"use client";
import { useState, useMemo, useCallback } from "react";
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

// Empty fallback objects for when no artists are selected
const emptyArtist = {
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
    americanMusicAwards: 0,
    betAwards: 0,
    mtvVMAs: 0,
  },
};

export default function Home() {
  const [pair, setPair] = useState<{ a: any; b: any } | null>(null);
  const [showContent, setShowContent] = useState(false);

  const onSelectPair = useCallback((a: any, b: any) => {
    setPair({ a, b });
    setShowContent(true);
  }, []);

  const duo = useMemo(() => {
    if (pair) return [pair.a, pair.b];
    return [emptyArtist, emptyArtist]; // Use empty fallback instead of dummy data
  }, [pair]);

  return (
    <div className="flex flex-col items-center min-h-screen gap-12 pt-8 px-6 pb-16">
      <section className="w-full flex flex-col items-center gap-12">
        <h1 className="text-center text-4xl md:text-5xl font-bold tracking-wide text-gray-200 uppercase">
          Artist Compare
        </h1>
        <SearchBar onSelectPair={onSelectPair} />
      </section>

      {!showContent && <Description />}

      {showContent && (
        <section className="flex flex-col items-center gap-20 w-full relative">
          {/* Sticky Artist Images */}
          <StickyArtistImages artistA={duo[0]} artistB={duo[1]} />
          
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={400}
            transitionDuration={1200}
            playOnce={false}
            className="w-auto h-auto bg-transparent border-none"
            style={{ background: 'none', width: 'auto', height: 'auto', border: 'none', borderRadius: '1.5rem' }}
          >
            <Info artistA={duo[0]} artistB={duo[1]} />
          </GlareHover>
          <TopStreams
            artistAId={duo[0]?.spotifyId}
            artistBId={duo[1]?.spotifyId}
            artistAName={duo[0]?.artistName || duo[0]?.name}
            artistBName={duo[1]?.artistName || duo[1]?.name}
          />

          <Streams artistA={duo[0]} artistB={duo[1]} />
          <Charts artistA={duo[0]} artistB={duo[1]} />
          <Awards artistA={duo[0]} artistB={duo[1]} />
          <RiaaCertifications artistA={duo[0]} artistB={duo[1]} />
        </section>
      )}
    </div>
  );
}
