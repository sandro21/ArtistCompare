"use client";
import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "../../components/SearchBar";
import { generateComparisonUrl } from "../../lib/seo-utils";
import type { Artist, ArtistPair } from "../../types";

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

function DemoContent() {
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
    <div className="min-h-screen bg-black flex flex-col gap-12">
      {/* Navbar */}
      <nav className="w-full h-24 bg-gradient-to-r from-[#00FF44]/5 to-[#99FFD9]/12 rounded-b-[4rem] flex justify-between px-8 py-4">
        <div className="bg-[#5EE9B5] border-3 border-[#376348] flex rounded-full items-center gap-2 px-4">
          <img src="/icon.png" alt="icon" className="w-15 h-15" />
          <span className="font-bold text-black text-4xl">Artist Compare</span>
        </div>
        <div className="bg-[#5EE9B5] border-3 border-[#376348] flex rounded-full items-center px-4 ">
          <span className="font-bold text-black text-2xl">Learn More</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center gap-18">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-[#5EE9B5] border-3 border-[#376348] flex rounded-full items-center px-2 py-1">
            <span className="font-bold text-black text-base">Real Statistics</span>
          </div>
          <div className="text-white font-extrabold text-6xl">
            Settle The <span className="bg-gradient-to-r from-white/100 to-[#5EE9B5] bg-clip-text text-transparent">Debate</span>
          </div>
          <div className="text-white font-medium text-2xl">Just Select Two Artists and see the magic</div>
        </div>

        {/* Search Bar Components */}
        <div className="flex justify-center gap-8">
           <div className="w-96 border-3 border-[#5EE9B5] rounded-full bg-gradient-to-r from-[#1A231F] to-[#24302A] flex items-center px-6 py-3">
             <span className="text-white font-medium text-xl">Search Artist 1...</span>
           </div>
           <div className="w-96 border-3 border-[#5EE9B5] rounded-full bg-gradient-to-r from-[#1A231F] to-[#24302A] flex items-center px-6 py-2">
             <span className="text-white font-medium text-xl">Search Artist 2...</span>
           </div>
        </div>
      </main>
    </div>
  );
}

export default function Demo() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
      <DemoContent />
    </Suspense>
  );
}
