import React from 'react';
import ComparisonBar from '../../components/ComparisonBar';
import SectionWrapper from '../../components/SectionWrapper';
import { getGrammyData } from '../../lib/grammy';
import { getArtistName } from '../../lib/utils/artist';
import type { SharePayload } from '../../types';

interface AwardsProps {
  artistA: any;
  artistB: any;
  onShare?: (payload: SharePayload) => void;
}

const Awards: React.FC<AwardsProps> = ({ artistA, artistB, onShare }) => {
  const grammyA = getGrammyData(artistA?.artistName || artistA?.name || '');
  const grammyB = getGrammyData(artistB?.artistName || artistB?.name || '');

  const sharePayload: SharePayload = {
    sectionId: 'grammy',
    sectionTitle: 'Grammy Awards',
    artistAName: getArtistName(artistA),
    artistBName: getArtistName(artistB),
    artistAImg: artistA?.spotifyImageUrl || artistA?.spotifyImage || artistA?.image,
    artistBImg: artistB?.spotifyImageUrl || artistB?.spotifyImage || artistB?.image,
    bars: [
      { label: 'Grammy Wins',         valueA: grammyA?.wins         || 0, valueB: grammyB?.wins         || 0 },
      { label: 'Grammy Nominations',  valueA: grammyA?.nominations  || 0, valueB: grammyB?.nominations  || 0 },
    ],
  };

  return (
    <SectionWrapper header="Grammy Awards" sharePayload={sharePayload} onShare={onShare}>
      <ComparisonBar
        artist1Value={grammyA?.wins || 0}
        artist2Value={grammyB?.wins || 0}
        metric="Grammy Wins"
      />
      <ComparisonBar
        artist1Value={grammyA?.nominations || 0}
        artist2Value={grammyB?.nominations || 0}
        metric="Grammy Nominations"
      />
    </SectionWrapper>
  );
};

export default Awards;
