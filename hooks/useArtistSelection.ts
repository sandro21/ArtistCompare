import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateComparisonUrl } from '../lib/seo-utils';
import type { Artist, ArtistPair } from '../types';

export const useArtistSelection = (startLoadingAnimation: () => void, isInitialLoading: boolean) => {
  const [pair, setPair] = useState<ArtistPair | null>(null);
  const searchBarRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const hasUrlParams = searchParams.get('artist1') && searchParams.get('artist2');

  const onSelectPair = useCallback((a: Artist, b: Artist) => {
    // Set pair first
    setPair({ a, b });
    
    // Start loading only if not already loading
    if (!isInitialLoading) {
      startLoadingAnimation();
    }
    
    // Generate SEO-friendly URL and update browser history
    if (a.artistName && b.artistName) {
      const seoUrl = generateComparisonUrl(a.artistName, b.artistName);
      window.history.pushState({}, '', seoUrl);
    }
  }, [isInitialLoading, startLoadingAnimation]);

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
      // Start loading immediately
      startLoadingAnimation();
      // Pre-populate search bars with URL parameters
      handleBattleClick(artist1, artist2);
    }
  }, [searchParams, pair, handleBattleClick, startLoadingAnimation]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // When user clicks back button, reset to homepage
      setPair(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setPair]);

  return {
    pair,
    setPair,
    searchBarRef,
    hasUrlParams,
    onSelectPair,
    handleBattleClick,
  };
};

