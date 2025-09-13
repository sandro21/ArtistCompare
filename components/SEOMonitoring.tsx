'use client';

import { useEffect } from 'react';

interface SEOMonitoringProps {
  pageType: 'home' | 'comparison';
  artist1?: string;
  artist2?: string;
}

export default function SEOMonitoring({ pageType, artist1, artist2 }: SEOMonitoringProps) {
  useEffect(() => {
    // Track page views and SEO metrics
    const trackPageView = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_type: pageType,
          ...(artist1 && artist2 && {
            artist1,
            artist2,
            comparison_type: 'artist_comparison'
          })
        });
      }
    };

    // Track user engagement
    const trackEngagement = () => {
      let startTime = Date.now();
      let maxScrollDepth = 0;
      let interactionCount = 0;

      // Track scroll depth
      const trackScroll = () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
      };

      // Track interactions
      const trackInteraction = () => {
        interactionCount++;
      };

      // Track time on page
      const trackTimeOnPage = () => {
        const timeOnPage = Date.now() - startTime;
        if ((window as any).gtag) {
          (window as any).gtag('event', 'engagement', {
            time_on_page: Math.round(timeOnPage / 1000),
            max_scroll_depth: maxScrollDepth,
            interaction_count: interactionCount
          });
        }
      };

      // Add event listeners
      window.addEventListener('scroll', trackScroll, { passive: true });
      document.addEventListener('click', trackInteraction);
      document.addEventListener('keydown', trackInteraction);

      // Track when user leaves page
      window.addEventListener('beforeunload', trackTimeOnPage);

      return () => {
        window.removeEventListener('scroll', trackScroll);
        document.removeEventListener('click', trackInteraction);
        document.removeEventListener('keydown', trackInteraction);
        window.removeEventListener('beforeunload', trackTimeOnPage);
        trackTimeOnPage();
      };
    };

    // Track search queries
    const trackSearchQuery = (query: string) => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'search', {
          search_term: query,
          page_type: pageType
        });
      }
    };

    // Track comparison events
    const trackComparison = (artist1: string, artist2: string) => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'comparison_started', {
          artist1,
          artist2,
          comparison_type: 'artist_comparison'
        });
      }
    };

    // Track performance metrics
    const trackPerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation && (window as any).gtag) {
          (window as any).gtag('event', 'performance', {
            page_load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            first_paint: Math.round(navigation.responseEnd - navigation.fetchStart)
          });
        }
      }
    };

    // Initialize tracking
    trackPageView();
    trackPerformance();
    
    const cleanup = trackEngagement();

    // Track search queries from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || urlParams.get('search');
    if (searchQuery) {
      trackSearchQuery(searchQuery);
    }

    // Track comparison if artists are provided
    if (artist1 && artist2) {
      trackComparison(artist1, artist2);
    }

    // Track errors
    window.addEventListener('error', (event) => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: event.error?.message || 'Unknown error',
          fatal: false
        });
      }
    });

    return cleanup;
  }, [pageType, artist1, artist2]);

  return null; // This component doesn't render anything
}
