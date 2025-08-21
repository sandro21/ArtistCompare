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
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboardHot100Number1s || 0} 
        artist2Value={artistB?.charts?.billboardHot100Number1s || 0} 
        metric="Hot 100 #1s" 
      />
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboardHot100Top10s || 0} 
        artist2Value={artistB?.charts?.billboardHot100Top10s || 0} 
        metric="Hot 100 Top 10s" 
      />
      <ComparisonBar 
        artist1Value={artistA?.charts?.billboard200Number1s || 0} 
        artist2Value={artistB?.charts?.billboard200Number1s || 0} 
        metric="Billboard 200 #1s" 
      />
      <ComparisonBar 
        artist1Value={artistA?.charts?.totalWeeksOnHot100 || 0} 
        artist2Value={artistB?.charts?.totalWeeksOnHot100 || 0} 
        metric="Total Weeks on Hot 100" 
      />
    </SectionWrapper>
  );
};

export default Charts;
