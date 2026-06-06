import React from 'react';
import ComparisonBar from './ComparisonBar';
import SourceAttribution from './SourceAttribution';
import billboard200Data from '@/data/billboard200-stats.json';
import { normalizeForBillboardLookup } from '@/lib/utils/normalize';

interface AlbumsChartProps {
  artistA: any;
  artistB: any;
}

const AlbumsChart: React.FC<AlbumsChartProps> = ({ artistA, artistB }) => {
  // Get Billboard 200 stats by directly indexing the JSON data
  // Normalize artist names to match the normalized keys in Billboard data
  const artistA200 = (billboard200Data.artists as any)[normalizeForBillboardLookup(artistA?.artistName || artistA?.name || '')] || { billboard200: { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 } };
  const artistB200 = (billboard200Data.artists as any)[normalizeForBillboardLookup(artistB?.artistName || artistB?.name || '')] || { billboard200: { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 } };

  return (
    <>
      
      <ComparisonBar 
        artist1Value={artistA200.billboard200.number1s} 
        artist2Value={artistB200.billboard200.number1s} 
        metric={artistA200.billboard200.number1s + artistB200.billboard200.number1s === 1 ? '#1' : '#1s'}
      />
      <ComparisonBar 
        artist1Value={artistA200.billboard200.top10s} 
        artist2Value={artistB200.billboard200.top10s} 
        metric={artistA200.billboard200.top10s + artistB200.billboard200.top10s === 1 ? 'Top 10' : 'Top 10s'} 
      />
      <ComparisonBar 
        artist1Value={artistA200.billboard200.entries} 
        artist2Value={artistB200.billboard200.entries} 
  metric="Entries" 
      />
      <ComparisonBar 
        artist1Value={artistA200.billboard200.wks_on_chart} 
        artist2Value={artistB200.billboard200.wks_on_chart} 
        metric="Total Weeks" 
      />
      <SourceAttribution>
        From: Billboard 200<span className="align-super text-[10px] ml-0.5">™</span>
      </SourceAttribution>
    </>
  );
};

export default AlbumsChart;
