import React from 'react';

interface ArtistCardProps {
  artistName: string;
  spotifyImageUrl?: string;
  activeYears?: string;
  songsCount?: number;
  albumsCount?: number;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  artistName,
  spotifyImageUrl,
  activeYears,
  songsCount,
  albumsCount,
}) => {
  return (
    <div className="flex flex-col items-center mx-4">
      {/* Artist Image */}
      <div className="w-30 h-30 rounded-full bg-gray-300 flex items-center justify-center mb-4">
        {spotifyImageUrl ? (
          <img
            src={spotifyImageUrl}
            alt={`${artistName} profile`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-600 text-sm text-center px-2 font-medium">
            {artistName.toUpperCase()}_SPOTIFY_IMAGE
          </span>
        )}
      </div>

      {/* Artist Name */}
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        {artistName?.toUpperCase()}
      </h2>

      {/* Active Years */}
      <p className="text-gray-300 text-sm mb-6 font-medium">
        {activeYears ? (
          <span>
            {activeYears.includes('(') ? (
              <>
                {activeYears.split('(')[0].trim()}
                <span className="text-green-400 ml-1">({activeYears.split('(')[1]}</span>
              </>
            ) : (
              activeYears
            )}
          </span>
        ) : (
          '—'
        )}
      </p>

      {/* Statistics */}
      <div className="flex gap-4">
        {/* Songs Count */}
        <div 
          className="px-4 py-3 text-center min-w-[80px]"
          style={{
            borderRadius: '2.46875rem',
            background: '#0C1919',
            boxShadow: '0 0 4px 0 #38D985 inset, 0 0 2.6px 1px #38D985'
          }}
        >
          <div className="text-white font-bold text-lg">{songsCount ?? '—'}</div>
          <div className="text-gray-300 text-sm font-medium">Songs</div>
        </div>

        {/* Albums Count */}
        <div 
          className="px-6 py-3 text-center"
          style={{
            minWidth: '110px',
            borderRadius: '2.46875rem',
            background: '#0C1919',
            boxShadow: '0 0 4px 0 #38D985 inset, 0 0 2.6px 1px #38D985'
          }}
        >
          <div className="text-white font-bold text-lg">{albumsCount ?? '—'}</div>
          <div className="text-gray-300 text-sm font-medium">Albums</div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
