import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import hot100Data from '@/data/billboard-hot100-stats.json';
import billboard200Data from '@/data/billboard200-stats.json';

interface ChartsProps {
  artistA: any;
  artistB: any;
}

const Charts: React.FC<ChartsProps> = ({ artistA, artistB }) => {
  // Get Billboard stats by directly indexing the JSON data
  const artistAHot100 = (hot100Data.artists as any)[artistA?.artistName] || { hot100: { entries: 0, top10s: 0, number1s: 0 } };
  const artistBHot100 = (hot100Data.artists as any)[artistB?.artistName] || { hot100: { entries: 0, top10s: 0, number1s: 0 } };
  
  const artistA200 = (billboard200Data.artists as any)[artistA?.artistName] || { billboard200: { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 } };
  const artistB200 = (billboard200Data.artists as any)[artistB?.artistName] || { billboard200: { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 } };

  return (
    <SectionWrapper header="Billboard Charts">
      {/* Hot 100 Metrics */}
      <ComparisonBar 
        artist1Value={artistAHot100.hot100.entries} 
        artist2Value={artistBHot100.hot100.entries} 
        metric="Hot 100 Entries" 
      />
      <ComparisonBar 
        artist1Value={artistAHot100.hot100.top10s} 
        artist2Value={artistBHot100.hot100.top10s} 
        metric="Hot 100 Top 10s" 
      />
      <ComparisonBar 
        artist1Value={artistAHot100.hot100.number1s} 
        artist2Value={artistBHot100.hot100.number1s} 
        metric="Hot 100 #1s" 
      />

      {/* Billboard 200 Metrics */}
      <ComparisonBar 
        artist1Value={artistA200.billboard200.entries} 
        artist2Value={artistB200.billboard200.entries} 
        metric="Billboard 200 Entries" 
      />
      <ComparisonBar 
        artist1Value={artistA200.billboard200.top10s} 
        artist2Value={artistB200.billboard200.top10s} 
        metric="Billboard 200 Top 10s" 
      />
      <ComparisonBar 
        artist1Value={artistA200.billboard200.number1s} 
        artist2Value={artistB200.billboard200.number1s} 
        metric="Billboard 200 #1s" 
      />
      <ComparisonBar 
        artist1Value={artistA200.billboard200.wks_on_chart} 
        artist2Value={artistB200.billboard200.wks_on_chart} 
        metric="Total Weeks On Chart" 
      />
    </SectionWrapper>
  );
};

export default Charts;
