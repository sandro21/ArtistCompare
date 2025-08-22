import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import AlbumsChart from './AlbumsChart';
import SongsChart from './SongsChart';
import ToggleSwitch from './ToggleSwitch';

interface ChartsProps {
  artistA: any;
  artistB: any;
}

const Charts: React.FC<ChartsProps> = ({ artistA, artistB }) => {
  const [showAlbums, setShowAlbums] = useState(true); // Default to albums

  return (
    <SectionWrapper header="Billboard Charts" headerClassName="mb-3">
      <ToggleSwitch
        leftLabel="Albums"
        rightLabel="Songs"
        isLeft={showAlbums}
        onToggle={setShowAlbums}
      />

      {/* Conditional Chart Rendering with smooth transition */}
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
