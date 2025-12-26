'use client';

import React, { useState, useEffect } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import TrendChart from '../../components/TrendChart';
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

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
  };

  return (
    <SectionWrapper header="Google Trends Beta">
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => handleRangeChange('1y')}
          className={`px-4 py-2 rounded-full text-sm font-regular transition-all duration-300 ${
            range === '1y'
              ? 'bg-gradient-to-r from-[#5EE9B5a9] to-[#5EE9B5d6] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.35)]'
              : 'text-white hover:text-gray-200'
          }`}
        >
          1 Year
        </button>
        <button
          onClick={() => handleRangeChange('5y')}
          className={`px-4 py-2 rounded-full text-sm font-regular transition-all duration-300 ${
            range === '5y'
              ? 'bg-gradient-to-r from-[#5EE9B5a9] to-[#5EE9B5d6] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.35)]'
              : 'text-white hover:text-gray-200'
          }`}
        >
          5 Years
        </button>
        <button
          onClick={() => handleRangeChange('10y')}
          className={`px-4 py-2 rounded-full text-sm font-regular transition-all duration-300 ${
            range === '10y'
              ? 'bg-gradient-to-r from-[#5EE9B5a9] to-[#5EE9B5d6] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.35)]'
              : 'text-white hover:text-gray-200'
          }`}
        >
          10 Years
        </button>
      </div>

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