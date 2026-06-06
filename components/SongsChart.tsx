import React from 'react';
import ComparisonBar from './ComparisonBar';
import SourceAttribution from './SourceAttribution';
import hot100Data from '@/data/billboard-hot100-stats.json';
import { normalizeForBillboardLookup } from '@/lib/utils/normalize';
import type { Artist } from '../types';

const hot100MinYear = hot100Data.metadata.min_year;

interface SongsChartProps {
  artistA: Artist | null;
  artistB: Artist | null;
}

const SongsChart: React.FC<SongsChartProps> = ({ artistA, artistB }) => {
  // Get Hot 100 stats by directly indexing the JSON data
  // Normalize artist names to match the normalized keys in Billboard data
  const artistAName = normalizeForBillboardLookup(artistA?.artistName || artistA?.name || '');
  const artistBName = normalizeForBillboardLookup(artistB?.artistName || artistB?.name || '');
  
  const artistAHot100 = (hot100Data.artists as any)[artistAName] || { hot100: { entries: 0, top10s: 0, number1s: 0 } };
  const artistBHot100 = (hot100Data.artists as any)[artistBName] || { hot100: { entries: 0, top10s: 0, number1s: 0 } };

  return (
    <>
      
      <ComparisonBar 
        artist1Value={artistAHot100.hot100.number1s} 
        artist2Value={artistBHot100.hot100.number1s} 
        metric={artistAHot100.hot100.number1s + artistBHot100.hot100.number1s === 1 ? '#1' : '#1s'}
      />
      <ComparisonBar 
        artist1Value={artistAHot100.hot100.top10s} 
        artist2Value={artistBHot100.hot100.top10s} 
        metric={artistAHot100.hot100.top10s + artistBHot100.hot100.top10s === 1 ? 'Top 10' : 'Top 10s'} 
      />
      <ComparisonBar 
        artist1Value={artistAHot100.hot100.entries} 
        artist2Value={artistBHot100.hot100.entries} 
        metric="Entries" 
      />
      <SourceAttribution>
        From: Billboard Hot 100<span className="align-super text-[10px] ml-0.5">™</span> (After {hot100MinYear})
      </SourceAttribution>
    </>
  );
};

export default SongsChart;
