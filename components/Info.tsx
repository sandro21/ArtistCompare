import React from 'react';
import ArtistCard from './ArtistCard';
import { artists as staticArtists } from '../data/artists';

interface InfoProps {
  artistA?: any;
  artistB?: any;
}

const Info: React.FC<InfoProps> = ({ artistA, artistB }) => {
  const a = artistA || staticArtists[0];
  const b = artistB || staticArtists[1];
  return (
    <div
      style={{
        width: '40rem',
        height: '24rem',
        flexShrink: 0,
        borderRadius: '1.5rem',
        border: '1px solid #4BE295',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 53.85%, rgba(65, 147, 105, 0.28) 100%)',
        boxShadow: '0 0 18.3px -3px #419369 inset, 0 0 20.6px 2px #419369'
      }}
      className="flex justify-between items-center p-10"
    >
      {/* Artist 1 */}
      {a && (
        <ArtistCard
          artistName={a.artistName || a.name}
          spotifyImageUrl={a.spotifyImageUrl || a.image || a.spotifyImage}
          activeYears={a.activeYears}
          songsCount={a.songsCount}
          albumsCount={a.albumsCount}
        />
      )}
      {/* Artist 2 */}
      {b && (
        <ArtistCard
          artistName={b.artistName || b.name}
          spotifyImageUrl={b.spotifyImageUrl || b.image || b.spotifyImage}
          activeYears={b.activeYears}
          songsCount={b.songsCount}
          albumsCount={b.albumsCount}
        />
      )}
    </div>
  );
};

export default Info; 