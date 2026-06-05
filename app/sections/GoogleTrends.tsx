'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import TrendChart from '../../components/TrendChart';
import { getArtistName } from '../../lib/utils/artist';
import type { Artist } from '../../types';

interface TrendsProps {
  artistA: Artist | null;
  artistB: Artist | null;
}

interface TrendData {
  date: string;
  [key: string]: string | number;
}

const TIME_RANGES = [
  { value: '1y', label: '1 Year', years: 1 },
  { value: '5y', label: '5 Years', years: 5 },
  { value: '10y', label: '10 Years', years: 10 },
] as const;

// Longest range — covers all smaller ranges so we only call the API once.
const FETCH_RANGE = '10y';

const GoogleTrends: React.FC<TrendsProps> = ({ artistA, artistB }) => {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('5y');

  const artistAName = getArtistName(artistA);
  const artistBName = getArtistName(artistB);

  useEffect(() => {
    if (!artistAName || !artistBName) return;

    setLoading(true);
    setError(null);

    fetch(`/api/google-trends?a=${encodeURIComponent(artistAName)}&b=${encodeURIComponent(artistBName)}&range=${FETCH_RANGE}`)
      .then(response => response.json())
      .then(result => {
        if (result.ok && result.data) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch trends data');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [artistAName, artistBName]);

  const filteredData = useMemo(() => {
    if (!data.length) return data;
    const years = TIME_RANGES.find(r => r.value === range)?.years;
    if (!years) return data;
    const boundary = new Date();
    boundary.setFullYear(boundary.getFullYear() - years);
    const boundaryTime = boundary.getTime();
    return data.filter(item => new Date(item.date).getTime() >= boundaryTime);
  }, [data, range]);

  return (
    <SectionWrapper header="Google Trends Beta">
      <div className="flex items-center justify-center gap-2 mb-8">
        {TIME_RANGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setRange(value)}
            className={`px-4 py-2 rounded-full text-sm font-regular transition-all duration-300 ${
              range === value
                ? 'bg-gradient-to-r from-[#5EE9B5a9] to-[#5EE9B5d6] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.35)]'
                : 'text-white hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
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

        {!loading && !error && filteredData.length > 0 && (
          <div className="animate-in slide-in-from-right-5 fade-in duration-300">
            <TrendChart data={filteredData} artistA={artistAName} artistB={artistBName} />
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">No data available</div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default GoogleTrends;
