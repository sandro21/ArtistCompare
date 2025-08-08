import React from 'react';

interface ComparisonBarProps {
  artist1Value: number;
  artist2Value: number;
  metric: string;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({
  artist1Value,
  artist2Value,
  metric,
}) => {
  // Determine which value is higher to set gradient direction
  let isArtist2Higher = artist2Value > artist1Value;

  // For 'Spotify Rank', lower is better, so reverse the logic
  let gradientDirection;
  if (metric === "Spotify Rank") {
    gradientDirection = isArtist2Higher 
      ? 'linear-gradient(90deg, #419369 0%, #081111 50%)' // Green on lower (left) if right is higher (worse)
      : 'linear-gradient(90deg, #081111 50%, #419369 100%)'; // Green on lower (right) if left is higher (worse)
  } else {
    gradientDirection = isArtist2Higher 
      ? 'linear-gradient(90deg, #081111 50%, #419369 100%)'  // Dark to green (right side higher)
      : 'linear-gradient(90deg, #419369 0%, #081111 50%)'; // Green to dark (left side higher)
  }
  return (
    <div
      style={{
        borderRadius: '4.4375rem',
        border: '0 solid #000',
        background: gradientDirection,
        width: '100%',
      }}
      className="flex justify-between items-center px-6 py-4 mb-4"
    >
      {/* Artist 1 Value (Left) */}
      <div className="text-white font-bold text-lg">
        {artist1Value.toLocaleString()}
      </div>
      
      {/* Metric Label (Center) */}
      <div className="text-white text-base font-medium">
        {metric}
      </div>
      
      {/* Artist 2 Value (Right) */}
      <div className="text-white font-bold text-lg">
        {artist2Value.toLocaleString()}
      </div>
    </div>
  );
};

export default ComparisonBar; 