import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';

interface ChartsProps {
  artistA: any;
  artistB: any;
}

const Charts: React.FC<ChartsProps> = ({ artistA, artistB }) => {
  return (
    <SectionWrapper header="Billboard Charts">
      {/* Hot 100 Metrics */}
      <ComparisonBar 
        artist1Value={artistA?.charts?.hot100Entries || 0} 
        artist2Value={artistB?.charts?.hot100Entries || 0} 
        metric="Hot 100 Entries" 
      />
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboardHot100Top10s || 0} 
        artist2Value={artistB?.charts?.billboardHot100Top10s || 0} 
        metric="Hot 100 Top 10s" 
      />
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboardHot100Number1s || 0} 
        artist2Value={artistB?.charts?.billboardHot100Number1s || 0} 
        metric="Hot 100 #1s" 
      />

      {/* Billboard 200 Metrics */}
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboard200Entries || 0} 
        artist2Value={artistB?.charts?.billboard200Entries || 0} 
        metric="Billboard 200 Entries" 
      />
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboard200Top10s || 0} 
        artist2Value={artistB?.charts?.billboard200Top10s || 0} 
        metric="Billboard 200 Top 10s" 
      />
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboard200Number1s || 0} 
        artist2Value={artistB?.charts?.billboard200Number1s || 0} 
        metric="Billboard 200 #1s" 
      />
    </SectionWrapper>
  );
};

export default Charts;
