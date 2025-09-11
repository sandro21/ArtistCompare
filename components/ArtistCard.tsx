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
    <div className="flex flex-col items-center mx-2 sm:mx-4 w-full sm:w-auto">
      {/* Artist Image */}
      <div className="w-16 h-16 sm:w-30 sm:h-30 rounded-full bg-gray-300 flex items-center justify-center mb-2 sm:mb-4">
        {spotifyImageUrl ? (
          <img
            src={spotifyImageUrl}
            alt={`${artistName} profile`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-600 text-xs sm:text-sm text-center px-1 sm:px-2 font-medium">
            {artistName.toUpperCase()}_SPOTIFY_IMAGE
          </span>
        )}
      </div>

      {/* Artist Name */}
      <h2 className="text-sm sm:text-2xl font-bold text-white mb-1 sm:mb-2 text-center leading-tight">
        {artistName?.toUpperCase()}
      </h2>

      {/* Active Years */}
      <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-6 font-medium text-center">
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
      <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-center">
        {/* Songs Count */}
        <div 
          className="px-2 sm:px-4 py-2 sm:py-3 text-center flex-1 sm:flex-none sm:min-w-[80px]"
          style={{
            borderRadius: '1.2rem',
            background: '#0C1919',
            boxShadow: '0 0 2px 0 #38D985 inset, 0 0 1.3px 0.5px #38D985'
          }}
        >
          <div className="text-white font-bold text-sm sm:text-lg">{songsCount ?? '—'}</div>
          <div className="text-gray-300 text-xs sm:text-sm font-medium">Songs</div>
        </div>

        {/* Albums Count */}
        <div 
          className="px-3 sm:px-6 py-2 sm:py-3 text-center flex-1 sm:flex-none"
          style={{
            minWidth: '60px',
            borderRadius: '1.2rem',
            background: '#0C1919',
            boxShadow: '0 0 2px 0 #38D985 inset, 0 0 1.3px 0.5px #38D985'
          }}
        >
          <div className="text-white font-bold text-sm sm:text-lg">{albumsCount ?? '—'}</div>
          <div className="text-gray-300 text-xs sm:text-sm font-medium">Albums</div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
