'use client';

import React, { useState, useEffect } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import TrendChart from '../../components/TrendChart';
import ToggleSwitch from '../../components/ToggleSwitch';
import type { Artist } from '../../types';

interface TrendsProps {
  artistA: Artist | null;
  artistB: Artist | null;
}

interface TrendData {
  date: string;
  [key: string]: string | number;
}

const GoogleTrends: React.FC<TrendsProps> = ({ artistA, artistB }) => {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('5y');

  const fetchTrendsData = async (selectedRange: string) => {
    const artistAName = artistA?.artistName || artistA?.name;
    const artistBName = artistB?.artistName || artistB?.name;
    
    if (!artistAName || !artistBName) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/google-trends?a=${encodeURIComponent(artistAName)}&b=${encodeURIComponent(artistBName)}&range=${selectedRange}`);
      const result = await response.json();
      
      if (result.ok && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch trends data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (artistA && artistB) {
      fetchTrendsData(range);
    }
  }, [artistA, artistB, range]);

  const handleRangeChange = (isLeft: boolean) => {
    const newRange = isLeft ? '5y' : '1y';
    setRange(newRange);
  };

  return (
    <SectionWrapper header="Google Trends Beta">
      <ToggleSwitch
        leftLabel="5 Years"
        rightLabel="1 Year"
        isLeft={range === '5y'}
        onToggle={handleRangeChange}
      />

      <div className="transition-all duration-300 ease-in-out">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading trends data...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96">
            <div className="text-red-500">Error: {error}</div>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="animate-in slide-in-from-right-5 fade-in duration-300">
            <TrendChart data={data} artistA={artistA?.artistName || artistA?.name || ''} artistB={artistB?.artistName || artistB?.name || ''} />
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">No data available</div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default GoogleTrends;