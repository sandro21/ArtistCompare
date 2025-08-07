import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import { artists } from '../data/artists';

const Streams: React.FC = () => {
  return (
    <SectionWrapper header="Streams">
      <ComparisonBar artist1Value={artists[0].streams.monthlyListeners} artist2Value={artists[1].streams.monthlyListeners} metric="Monthly Listeners" />
      <ComparisonBar artist1Value={artists[0].streams.spotifyRank} artist2Value={artists[1].streams.spotifyRank} metric="Spotify Rank" />
      <ComparisonBar artist1Value={artists[0].streams.totalStreams} artist2Value={artists[1].streams.totalStreams} metric="Total Streams" />
      {/* Add more metrics as needed */}
    </SectionWrapper>
  );
};

export default Streams;
