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
import { artists as staticArtists } from "../data/artists";

export default function Home() {
  const [pair, setPair] = useState<{ a: any; b: any } | null>(null);
  const [showContent, setShowContent] = useState(false);

  const onSelectPair = useCallback((a: any, b: any) => {
    setPair({ a, b });
    setShowContent(true);
  }, []);

  const duo = useMemo(() => {
    if (pair) return [pair.a, pair.b];
    return staticArtists.slice(0, 2);
  }, [pair]);

  return (
    <div className="flex flex-col items-center min-h-screen gap-24 pt-16 px-6">
      <section className="w-full flex flex-col items-center gap-12">
        <h1 className="text-center text-4xl md:text-5xl font-bold tracking-wide text-gray-200 uppercase">
          Artist Comparison
        </h1>
        <SearchBar onSelectPair={onSelectPair} />
      </section>

      {showContent && (
        <section className="flex flex-col items-center gap-20 w-full ">
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
          <Streams />
          <Charts />
          <Awards />
          <RiaaCertifications />
        </section>
      )}
    </div>
  );
}
