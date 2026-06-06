import React from 'react';
import ArtistCard from '../../components/ArtistCard';
import { useArtistInfo } from '../../hooks/useArtistInfo';
import { useTickets } from '../../hooks/useTickets';
import { EMPTY_ARTIST, getArtistName } from '../../lib/utils/artist';
import type { Artist } from '../../types';

interface InfoProps {
  artistA?: Artist | null;
  artistB?: Artist | null;
}

const Info: React.FC<InfoProps> = ({ artistA, artistB }) => {
  const a = artistA || EMPTY_ARTIST;
  const b = artistB || EMPTY_ARTIST;

  const aInfo = useArtistInfo(a?.spotifyId);
  const bInfo = useArtistInfo(b?.spotifyId);

  const aTickets = useTickets(a?.spotifyId, getArtistName(a));
  const bTickets = useTickets(b?.spotifyId, getArtistName(b));

  return (
    <div
      style={{
        flexShrink: 0,
        borderRadius: '3rem',
        border: '1px solid #5EE9B5',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 53.85%, rgba(94, 233, 181, 0.28) 100%)',
        boxShadow: '0 0 18.3px -3px #5EE9B5 inset, 0 0 20.6px 2px #5EE9B5'
      }}
      className="flex justify-evenly items-center p-4 sm:p-10 w-full min-w-[100%] h-64 sm:h-96"
    >
      {/* Artist 1 */}
      {a && (
        <ArtistCard
          artistName={getArtistName(a)}
          spotifyImageUrl={a.spotifyImageUrl || ''}
          activeYears={aInfo.releaseYears || a.activeYears}
          songsCount={aInfo.loading ? undefined : aInfo.details?.totalTracks}
          albumsCount={aInfo.loading ? undefined : aInfo.details?.totalAlbums}
          ticketsUrl={aTickets.tickets?.url}
          onTour={aTickets.tickets?.onTour}
          eventCount={aTickets.tickets?.eventCount}
        />
      )}
      {/* Artist 2 */}
      {b && (
        <ArtistCard
          artistName={getArtistName(b)}
          spotifyImageUrl={b.spotifyImageUrl || ''}
          activeYears={bInfo.releaseYears || b.activeYears}
          songsCount={bInfo.loading ? undefined : bInfo.details?.totalTracks}
          albumsCount={bInfo.loading ? undefined : bInfo.details?.totalAlbums}
          ticketsUrl={bTickets.tickets?.url}
          onTour={bTickets.tickets?.onTour}
          eventCount={bTickets.tickets?.eventCount}
        />
      )}
    </div>
  );
};

export default Info;
