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
    <div className="flex flex-col items-center mx-2 sm:mx-4">
      {/* Artist Image */}
      <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full bg-gray-300 flex items-center justify-center mb-2 sm:mb-4">
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
      <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 text-center">
        {artistName?.toUpperCase()}
      </h2>

      {/* Active Years */}
      <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-6 font-medium">
        {activeYears ? (
          <span>
            {activeYears.includes('(') ? (
              <>
                {activeYears.split('(')[0].trim()}
                <span className="text-[#5EE9B5] ml-1">({activeYears.split('(')[1]}</span>
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
      <div className="flex gap-2 sm:gap-4">
        {/* Songs Count */}
        <div 
          className="px-2 py-1 sm:px-4 sm:py-3 text-center min-w-[60px] sm:min-w-[80px]"
          style={{
            borderRadius: '2.46875rem',
            background: '#0C1919',
            boxShadow: '0 0 4px 0 #38D985 inset, 0 0 2.6px 1px #38D985'
          }}
        >
          <div className="text-white font-bold text-sm sm:text-lg">{songsCount ?? '—'}</div>
          <div className="text-gray-300 text-xs sm:text-sm font-medium">Songs</div>
        </div>

        {/* Albums Count */}
        <div 
          className="px-3 py-1 sm:px-6 sm:py-3 text-center"
          style={{
            minWidth: '80px',
            borderRadius: '2.46875rem',
            background: '#0C1919',
            boxShadow: '0 0 4px 0 #38D985 inset, 0 0 2.6px 1px #38D985'
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