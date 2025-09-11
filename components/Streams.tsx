import React, { useState, useEffect } from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import type { Artist } from '../types';

interface StreamsProps {
  artistA: Artist | null;
  artistB: Artist | null;
}

interface MusicMetrics {
  totalStreams: string;
  monthlyListeners: string;
  followers: string;
  monthlyListenersRank: number | null;
  streamRank: number | null;
}

const Streams: React.FC<StreamsProps> = ({ artistA, artistB }) => {
  const [metricsA, setMetricsA] = useState<MusicMetrics | null>(null);
  const [metricsB, setMetricsB] = useState<MusicMetrics | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  // Helper function to convert formatted strings to numbers
  const parseMetricValue = (value: string): number => {
    if (!value) return 0;
    
    // Remove commas and convert to lowercase for processing
    const cleanValue = value.toLowerCase().replace(/,/g, '');
    
    // Handle billion
    if (cleanValue.includes('billion')) {
      const num = parseFloat(cleanValue.replace('billion', '').trim());
      return Math.round(num * 1000000000);
    }
    
    // Handle million
    if (cleanValue.includes('million')) {
      const num = parseFloat(cleanValue.replace('million', '').trim());
      return Math.round(num * 1000000);
    }
    
    // Handle thousand
    if (cleanValue.includes('thousand') || cleanValue.includes('k')) {
      const num = parseFloat(cleanValue.replace(/thousand|k/g, '').trim());
      return Math.round(num * 1000);
    }
    
    // Try to parse as regular number
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : Math.round(parsed);
  };

  // Fetch metrics for Artist A
  useEffect(() => {
    if (!artistA || !artistA.spotifyId || !artistA.artistName) {
      setMetricsA(null);
      return;
    }

    const fetchMetrics = async () => {
      setLoadingA(true);
      setErrorA(null);
      try {
        const artistName = artistA.artistName || artistA.name || '';
        const response = await fetch(`/api/music-metrics?artistName=${encodeURIComponent(artistName)}&spotifyId=${artistA.spotifyId}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setMetricsA(data);
      } catch (error) {
        setErrorA(error instanceof Error ? error.message : 'Failed to fetch metrics');
        setMetricsA(null);
      } finally {
        setLoadingA(false);
      }
    };

    fetchMetrics();
  }, [artistA]);

  // Fetch metrics for Artist B
  useEffect(() => {
    if (!artistB || !artistB.spotifyId || !artistB.artistName) {
      setMetricsB(null);
      return;
    }

    const fetchMetrics = async () => {
      setLoadingB(true);
      setErrorB(null);
      try {
        const artistName = artistB.artistName || artistB.name || '';
        const response = await fetch(`/api/music-metrics?artistName=${encodeURIComponent(artistName)}&spotifyId=${artistB.spotifyId}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setMetricsB(data);
      } catch (error) {
        setErrorB(error instanceof Error ? error.message : 'Failed to fetch metrics');
        setMetricsB(null);
      } finally {
        setLoadingB(false);
      }
    };

    fetchMetrics();
  }, [artistB]);

  // Show loading state if no artists are selected
  if (!artistA || !artistB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center text-gray-400 py-8">
          Select two artists to compare their streaming metrics
        </div>
      </SectionWrapper>
    );
  }

  // Show loading state while fetching data
  if (loadingA || loadingB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center text-gray-400 py-8">
          Loading streaming metrics...
        </div>
      </SectionWrapper>
    );
  }

  // Show error state if there are errors
  if (errorA || errorB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center text-red-400 py-8">
          {errorA && <div>Error loading {artistA.artistName}: {errorA}</div>}
          {errorB && <div>Error loading {artistB.artistName}: {errorB}</div>}
        </div>
      </SectionWrapper>
    );
  }

  // Show data if available
  if (!metricsA || !metricsB) {
    return (
      <SectionWrapper header="Streams">
        <div className="text-center text-gray-400 py-8">
          No streaming data available
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper header="Streams">
      <ComparisonBar 
        artist1Value={parseMetricValue(metricsA.totalStreams)} 
        artist2Value={parseMetricValue(metricsB.totalStreams)} 
        metric="All-Time Streams"
        labelClassName="max-w-[120px] sm:max-w-[140px] md:max-w-none"
        artist1Rank={metricsA.streamRank}
        artist2Rank={metricsB.streamRank}
      />
      <ComparisonBar 
        artist1Value={parseMetricValue(metricsA.monthlyListeners)} 
        artist2Value={parseMetricValue(metricsB.monthlyListeners)} 
        metric="Monthly Listeners"
        artist1Rank={metricsA.monthlyListenersRank}
        artist2Rank={metricsB.monthlyListenersRank}
      />
      <ComparisonBar 
        artist1Value={parseMetricValue(metricsA.followers)} 
        artist2Value={parseMetricValue(metricsB.followers)} 
        metric="Spotify Followers"
        labelClassName="max-w-[120px] sm:max-w-[140px] md:max-w-none"
      />
    </SectionWrapper>
  );
};

export default Streams;
