import React from 'react';
import ArtistCard from './ArtistCard';
import { artists } from '../data/artists';

const Info: React.FC = () => {
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
      <ArtistCard
        artistName={artists[0].artistName}
        spotifyImageUrl={artists[0].spotifyImageUrl}
        activeYears={artists[0].activeYears}
        songsCount={artists[0].songsCount}
        albumsCount={artists[0].albumsCount}
      />
      {/* Artist 2 */}
      <ArtistCard
        artistName={artists[1].artistName}
        spotifyImageUrl={artists[1].spotifyImageUrl}
        activeYears={artists[1].activeYears}
        songsCount={artists[1].songsCount}
        albumsCount={artists[1].albumsCount}
      />
    </div>
  );
};

export default Info; 