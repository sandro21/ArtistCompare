import React from 'react';
import ComparisonBar from './ComparisonBar';
import billboard200Data from '@/data/billboard200-stats.json';

interface AlbumsChartProps {
  artistA: any;
  artistB: any;
}

const AlbumsChart: React.FC<AlbumsChartProps> = ({ artistA, artistB }) => {
  // Get Billboard 200 stats by directly indexing the JSON data
  const artistA200 = (billboard200Data.artists as any)[artistA?.artistName] || { billboard200: { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 } };
  const artistB200 = (billboard200Data.artists as any)[artistB?.artistName] || { billboard200: { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 } };

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
        metric="Weeks" 
      />
      <div className="text-emerald-400 text-xs font-semibold tracking-wide mt-1 text-left w-full">
        From: Billboard 200<span className="align-super text-[10px] ml-0.5">™</span>
      </div>
    </>
  );
};

export default AlbumsChart;
