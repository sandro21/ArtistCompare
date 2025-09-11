import React from 'react';

interface ComparisonBarProps {
  artist1Value: number;
  artist2Value: number;
  metric: string;
  subtitle?: string;
  artist1Rank?: number | null;
  artist2Rank?: number | null;
}

// Helper function to get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
};

// Helper function to format large numbers with billions/millions
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    const billions = (num / 1000000000).toFixed(1);
    return `${billions} billion`;
  } else if (num >= 1000000) {
    const millions = (num / 1000000).toFixed(1);
    return `${millions} million`;
  } else if (num >= 1000) {
    return num.toLocaleString();
  } else {
    return num.toString();
  }
};

const ComparisonBar: React.FC<ComparisonBarProps> = ({
  artist1Value,
  artist2Value,
  metric,
  subtitle,
  artist1Rank,
  artist2Rank,
}) => {
  // Determine which value is higher to set gradient direction
  let isArtist2Higher = artist2Value > artist1Value;
  let isEqual = artist1Value === artist2Value;

  // For bars with ranking data, use ranking to determine better performance (lower rank is better)
  // Otherwise, use the raw values (higher is better)
  let gradientDirection;
  
  if (isEqual) {
    // When values are equal, show a gradient that's green in the middle and black on both sides
    gradientDirection = 'linear-gradient(90deg, #081111 0%, #419369 50%, #081111 100%)'; // Black to green to black for tie
  } else if (artist1Rank && artist2Rank) {
    // When both have ranks, lower rank is better
    const isArtist2BetterRank = artist2Rank < artist1Rank;
    gradientDirection = isArtist2BetterRank
      ? 'linear-gradient(90deg, #081111 50%, #419369 100%)' // Green on right (better rank)
      : 'linear-gradient(90deg, #419369 0%, #081111 50%)'; // Green on left (better rank)
  } else if (metric.includes("Rank") || metric.includes("Ranking")) {
    // Legacy support for pure ranking metrics
    gradientDirection = isArtist2Higher 
      ? 'linear-gradient(90deg, #419369 0%, #081111 50%)' // Green on lower (left) if right is higher (worse)
      : 'linear-gradient(90deg, #081111 50%, #419369 100%)'; // Green on lower (right) if left is higher (worse)
  } else {
    // Default: higher values are better
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
      <div className="text-white font-bold text-sm sm:text-lg">
        {formatNumber(artist1Value)}
        {artist1Rank && <span className="text-xs sm:text-sm font-normal ml-2">({artist1Rank}{getOrdinalSuffix(artist1Rank)})</span>}
      </div>
      
      {/* Metric Label (Center) */}
      <div className="text-white text-sm sm:text-base font-medium flex flex-col items-center leading-tight">
        <span>{metric}</span>
        {subtitle && <span className="text-[8px] sm:text-[10px] uppercase tracking-wide text-emerald-300/70 mt-0.5">{subtitle}</span>}
      </div>
      
      {/* Artist 2 Value (Right) */}
      <div className="text-white font-bold text-sm sm:text-lg text-right">
        {artist2Rank && <span className="text-xs sm:text-sm font-normal mr-2">({artist2Rank}{getOrdinalSuffix(artist2Rank)})</span>}
        {formatNumber(artist2Value)}
      </div>
    </div>
  );
};

export default ComparisonBar; 