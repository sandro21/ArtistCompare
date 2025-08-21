import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import { artists } from '../data/artists';
import { getGrammyData } from '../lib/grammy';

const Awards: React.FC = () => {
  // Get Grammy data from our JSON file
  const artist1GrammyData = getGrammyData(artists[0].artistName);
  const artist2GrammyData = getGrammyData(artists[1].artistName);

  return (
    <SectionWrapper header="Awards">
      <ComparisonBar 
        artist1Value={artist1GrammyData?.wins || 0} 
        artist2Value={artist2GrammyData?.wins || 0} 
        metric="Grammy Wins" 
      />
      <ComparisonBar 
        artist1Value={artist1GrammyData?.nominations || 0} 
        artist2Value={artist2GrammyData?.nominations || 0} 
        metric="Grammy Nominations" 
      />
      <ComparisonBar artist1Value={artists[0].awards.americanMusicAwards} artist2Value={artists[1].awards.americanMusicAwards} metric="American Music Awards" />
      <ComparisonBar artist1Value={artists[0].awards.betAwards} artist2Value={artists[1].awards.betAwards} metric="BET Awards" />
      <ComparisonBar artist1Value={artists[0].awards.mtvVMAs} artist2Value={artists[1].awards.mtvVMAs} metric="MTV VMAs" />
    </SectionWrapper>
  );
};

export default Awards;
