import React from 'react';
import ComparisonBar from './ComparisonBar';
import SectionWrapper from './SectionWrapper';
import { artists } from '../data/artists';

const Awards: React.FC = () => {
  return (
    <SectionWrapper header="Awards">
      <ComparisonBar artist1Value={artists[0].awards.grammyWins} artist2Value={artists[1].awards.grammyWins} metric="Grammy Wins" />
      <ComparisonBar artist1Value={artists[0].awards.grammyNominations} artist2Value={artists[1].awards.grammyNominations} metric="Grammy Nominations" />
      <ComparisonBar artist1Value={artists[0].awards.americanMusicAwards} artist2Value={artists[1].awards.americanMusicAwards} metric="American Music Awards" />
      <ComparisonBar artist1Value={artists[0].awards.betAwards} artist2Value={artists[1].awards.betAwards} metric="BET Awards" />
      <ComparisonBar artist1Value={artists[0].awards.mtvVMAs} artist2Value={artists[1].awards.mtvVMAs} metric="MTV VMAs" />
    </SectionWrapper>
  );
};

export default Awards;
