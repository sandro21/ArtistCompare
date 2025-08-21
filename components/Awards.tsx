import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import { getGrammyData } from '../lib/grammy';

interface AwardsProps {
  artistA: any;
  artistB: any;
}

const Awards: React.FC<AwardsProps> = ({ artistA, artistB }) => {
  // Get Grammy data from our JSON file using the actual selected artists
  const artist1GrammyData = getGrammyData(artistA?.artistName || artistA?.name || '');
  const artist2GrammyData = getGrammyData(artistB?.artistName || artistB?.name || '');

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
      <ComparisonBar artist1Value={artistA?.awards?.americanMusicAwards || 0} artist2Value={artistB?.awards?.americanMusicAwards || 0} metric="American Music Awards" />
      <ComparisonBar artist1Value={artistA?.awards?.betAwards || 0} artist2Value={artistB?.awards?.betAwards || 0} metric="BET Awards" />
      <ComparisonBar artist1Value={artistA?.awards?.mtvVMAs || 0} artist2Value={artistB?.awards?.mtvVMAs || 0} metric="MTV VMAs" />
    </SectionWrapper>
  );
};

export default Awards;
