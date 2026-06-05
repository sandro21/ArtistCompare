import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateComparisonUrl } from '../lib/seo-utils';
import { getArtistName } from '../lib/utils/artist';
import type { Artist, ArtistPair, SelectedArtist } from '../types';

export const useArtistSelection = (startLoadingAnimation: () => void, isInitialLoading: boolean) => {
  const [pair, setPair] = useState<ArtistPair | null>(null);
  const [selectedA, setSelectedA] = useState<SelectedArtist | null>(null);
  const [selectedB, setSelectedB] = useState<SelectedArtist | null>(null);
  const searchParams = useSearchParams();
  const hasUrlParams = !!(searchParams.get('artist1') && searchParams.get('artist2'));

  const onSelectPair = useCallback((a: Artist, b: Artist) => {
    if (a.spotifyId && b.spotifyId && a.spotifyId === b.spotifyId) {
      return;
    }

    setPair({ a, b });

    if (!isInitialLoading) {
      startLoadingAnimation();
    }

    const aName = getArtistName(a);
    const bName = getArtistName(b);
    if (aName && bName) {
      const seoUrl = generateComparisonUrl(aName, bName);
      window.history.pushState({}, '', seoUrl);

      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      fetch('/api/log-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistA: aName,
          artistB: bName,
          sessionId: getCookie('session_id'),
        }),
      }).catch(err => console.error('Failed to log query:', err));
    }
  }, [isInitialLoading, startLoadingAnimation]);

  const onSelectA = useCallback((artist: SelectedArtist | null) => {
    setSelectedA(artist);
  }, []);

  const onSelectB = useCallback((artist: SelectedArtist | null) => {
    setSelectedB(artist);
  }, []);

  // Trigger comparison once per unique pair — guarded so callback identity changes
  // (e.g. isInitialLoading flipping) don't re-fire the comparison and restart loading.
  const lastFiredRef = useRef<string | null>(null);
  useEffect(() => {
    if (selectedA && selectedB) {
      const key = `${selectedA.spotifyId}|${selectedB.spotifyId}`;
      if (lastFiredRef.current !== key) {
        lastFiredRef.current = key;
        onSelectPair(selectedA as unknown as Artist, selectedB as unknown as Artist);
      }
    } else {
      lastFiredRef.current = null;
    }
  }, [selectedA, selectedB, onSelectPair]);

  const resetPair = useCallback(() => {
    setPair(null);
    setSelectedA(null);
    setSelectedB(null);
    lastFiredRef.current = null;
  }, []);

  const handleBattleClick = useCallback(async (artist1: string, artist2: string) => {
    try {
      const settled = await Promise.allSettled([
        fetch(`/api/spotify-search?q=${encodeURIComponent(artist1)}&limit=1`).then(r => r.json()),
        fetch(`/api/spotify-search?q=${encodeURIComponent(artist2)}&limit=1`).then(r => r.json()),
      ]);

      const data1 = settled[0].status === 'fulfilled' ? settled[0].value : null;
      const data2 = settled[1].status === 'fulfilled' ? settled[1].value : null;

      const r1 = data1?.results?.[0];
      const r2 = data2?.results?.[0];

      if (r1 && r2) {
        const artistA: SelectedArtist = {
          artistName: r1.name,
          spotifyImageUrl: r1.image || 'https://via.placeholder.com/64?text=?',
          spotifyId: r1.id,
        };

        const artistB: SelectedArtist = {
          artistName: r2.name,
          spotifyImageUrl: r2.image || 'https://via.placeholder.com/64?text=?',
          spotifyId: r2.id,
        };

        setSelectedA(artistA);
        setSelectedB(artistB);
      }
    } catch (error) {
      console.error('Error searching for artists:', error);
    }
  }, []);

  // Handle URL parameters for SEO-friendly URLs
  useEffect(() => {
    const artist1 = searchParams.get('artist1');
    const artist2 = searchParams.get('artist2');

    if (artist1 && artist2 && !pair) {
      startLoadingAnimation();
      handleBattleClick(artist1, artist2);
    }
  }, [searchParams, pair, handleBattleClick, startLoadingAnimation]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      resetPair();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resetPair]);

  return {
    pair,
    resetPair,
    selectedA,
    selectedB,
    onSelectA,
    onSelectB,
    hasUrlParams,
  };
};
