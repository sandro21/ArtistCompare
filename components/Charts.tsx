import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import { artists } from '../data/artists';

const Charts: React.FC = () => {
  return (
    <SectionWrapper header="Billboard Charts">
      <ComparisonBar artist1Value={artists[0].charts.billboardHot100Number1s} artist2Value={artists[1].charts.billboardHot100Number1s} metric="Hot 100 #1s" />
      <ComparisonBar artist1Value={artists[0].charts.billboardHot100Top10s} artist2Value={artists[1].charts.billboardHot100Top10s} metric="Hot 100 Top 10s" />
      <ComparisonBar artist1Value={artists[0].charts.billboard200Number1s} artist2Value={artists[1].charts.billboard200Number1s} metric="Billboard 200 #1s" />
      <ComparisonBar artist1Value={artists[0].charts.totalWeeksOnHot100} artist2Value={artists[1].charts.totalWeeksOnHot100} metric="Total Weeks on Hot 100" />
    </SectionWrapper>
  );
};

export default Charts;
