import React, { useState } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import AlbumsChart from '../../components/AlbumsChart';
import SongsChart from '../../components/SongsChart';
import ToggleSwitch from '../../components/ToggleSwitch';
import billboard200Data from '@/data/billboard200-stats.json';
import hot100Data from '@/data/billboard-hot100-stats.json';
import { normalizeForBillboardLookup } from '@/lib/utils/normalize';
import { getArtistName } from '../../lib/utils/artist';
import type { Artist, SharePayload } from '../../types';

interface ChartsProps {
  artistA: Artist | null;
  artistB: Artist | null;
  onShare?: (payload: SharePayload) => void;
}

const Charts: React.FC<ChartsProps> = ({ artistA, artistB, onShare }) => {
  const [showAlbums, setShowAlbums] = useState(true);

  const aKey = normalizeForBillboardLookup(artistA?.artistName || artistA?.name || '');
  const bKey = normalizeForBillboardLookup(artistB?.artistName || artistB?.name || '');

  const a200 = ((billboard200Data.artists as any)[aKey]?.billboard200) || { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 };
  const b200 = ((billboard200Data.artists as any)[bKey]?.billboard200) || { entries: 0, top10s: 0, number1s: 0, wks_on_chart: 0 };

  const aH100 = ((hot100Data.artists as any)[aKey]?.hot100) || { entries: 0, top10s: 0, number1s: 0 };
  const bH100 = ((hot100Data.artists as any)[bKey]?.hot100) || { entries: 0, top10s: 0, number1s: 0 };

  const nameA = getArtistName(artistA);
  const nameB = getArtistName(artistB);
  const imgA  = artistA?.spotifyImageUrl || artistA?.spotifyImage || artistA?.image;
  const imgB  = artistB?.spotifyImageUrl || artistB?.spotifyImage || artistB?.image;

  const albumsPayload: SharePayload = {
    sectionId: 'billboard-albums',
    sectionTitle: 'Billboard Charts',
    artistAName: nameA,
    artistBName: nameB,
    artistAImg: imgA,
    artistBImg: imgB,
    source: 'From: Billboard 200™',
    bars: [
      { label: '#1s',         valueA: a200.number1s,     valueB: b200.number1s     },
      { label: 'Top 10s',     valueA: a200.top10s,       valueB: b200.top10s       },
      { label: 'Entries',     valueA: a200.entries,      valueB: b200.entries      },
      { label: 'Total Weeks', valueA: a200.wks_on_chart, valueB: b200.wks_on_chart },
    ],
  };

  const songsPayload: SharePayload = {
    sectionId: 'billboard-songs',
    sectionTitle: 'Billboard Charts',
    artistAName: nameA,
    artistBName: nameB,
    artistAImg: imgA,
    artistBImg: imgB,
    source: 'From: Billboard Hot 100™',
    bars: [
      { label: '#1s',     valueA: aH100.number1s, valueB: bH100.number1s },
      { label: 'Top 10s', valueA: aH100.top10s,   valueB: bH100.top10s   },
      { label: 'Entries', valueA: aH100.entries,  valueB: bH100.entries  },
    ],
  };

  const sharePayload = showAlbums ? albumsPayload : songsPayload;

  return (
    <SectionWrapper header="Billboard Charts" headerClassName="mb-3" sharePayload={sharePayload} onShare={onShare}>
      <ToggleSwitch
        leftLabel="Albums"
        rightLabel="Songs"
        isLeft={showAlbums}
        onToggle={setShowAlbums}
      />
      <div className="transition-all duration-300 ease-in-out">
        {showAlbums ? (
          <div className="animate-in slide-in-from-right-5 fade-in duration-300">
            <AlbumsChart artistA={artistA} artistB={artistB} />
          </div>
        ) : (
          <div className="animate-in slide-in-from-left-5 fade-in duration-300">
            <SongsChart artistA={artistA} artistB={artistB} />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Charts;
