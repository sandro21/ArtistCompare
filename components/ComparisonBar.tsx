import React from 'react';

interface ComparisonBarProps {
  artist1Value: number;
  artist2Value: number;
  metric: string;
  subtitle?: string;
  artist1Rank?: number | null;
  artist2Rank?: number | null;
  labelClassName?: string; // optional extra classes for the metric label container
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

// Helper function to format numbers for mobile (shorter format)
const formatNumberMobile = (num: number): string => {
  if (num >= 1000000000) {
    const billions = (num / 1000000000).toFixed(1);
    return `${billions}b`;
  } else if (num >= 1000000) {
    const millions = (num / 1000000).toFixed(1);
    return `${millions}m`;
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
  labelClassName,
}) => {
  // Determine which value is higher to set gradient direction
  let isArtist2Higher = artist2Value > artist1Value;
  let isEqual = artist1Value === artist2Value;

  // For bars with ranking data, use ranking to determine better performance (lower rank is better)
  // Otherwise, use the raw values (higher is better)
  let gradientDirection;
  
  if (isEqual) {
    // When values are equal, show a gradient that's green (70% opacity) in the middle and black on both sides
    gradientDirection = 'linear-gradient(90deg, #081111 0%, rgba(94,233,181,0.7) 50%, #081111 100%)'; // Black to green (70%) to black for tie
  } else if (artist1Rank && artist2Rank) {
    // When both have ranks, lower rank is better
    const isArtist2BetterRank = artist2Rank < artist1Rank;
    gradientDirection = isArtist2BetterRank
      ? 'linear-gradient(90deg, #081111 50%, rgba(94,233,181,0.7) 100%)' // Green (70%) on right (better rank)
      : 'linear-gradient(90deg, rgba(94,233,181,0.7) 0%, #081111 50%)'; // Green (70%) on left (better rank)
  } else if (metric.includes("Rank") || metric.includes("Ranking")) {
    // Legacy support for pure ranking metrics
    gradientDirection = isArtist2Higher 
      ? 'linear-gradient(90deg, rgba(94,233,181,0.7) 0%, #081111 50%)' // Green (70%) on lower (left) if right is higher (worse)
      : 'linear-gradient(90deg, #081111 50%, rgba(94,233,181,0.7) 100%)'; // Green (70%) on lower (right) if left is higher (worse)
  } else {
    // Default: higher values are better
    gradientDirection = isArtist2Higher 
      ? 'linear-gradient(90deg, #081111 50%, rgba(94,233,181,0.7) 100%)'  // Dark to green (70%) (right side higher)
      : 'linear-gradient(90deg, rgba(94,233,181,0.7) 0%, #081111 50%)'; // Green (70%) to dark (left side higher)
  }
  return (
    <div
      style={{
        borderRadius: '4.4375rem',
        border: '0 solid #000',
        background: gradientDirection,
        width: '100%',
      }}
      className="flex justify-between items-center px-6 py-2.5 mb-4"
    >
      {/* Artist 1 Value (Left) */}
      <div className="text-white font-bold text-base sm:text-lg">
        <span className="sm:hidden">{formatNumberMobile(artist1Value)}</span>
        <span className="hidden sm:inline">{formatNumber(artist1Value)}</span>
        {artist1Rank && <span className="text-sm sm:text-sm font-normal ml-2 hidden sm:inline">({artist1Rank}{getOrdinalSuffix(artist1Rank)})</span>}
      </div>
      
      {/* Metric Label (Center) */}
      <div className={`text-white text-m sm:text-lg font-medium flex flex-col items-center leading-tight text-center w-[50px] sm:w-auto whitespace-normal break-words ${labelClassName ?? ''}`}>
        <span>{metric}</span>
        {subtitle && <span className="text-[8px] sm:text-[10px] uppercase tracking-wide text-[#5EE9B5]/70 mt-0.5">{subtitle}</span>}
      </div>
      
      {/* Artist 2 Value (Right) */}
      <div className="text-white font-bold text-lg sm:text-lg text-right">
        {artist2Rank && <span className="text-sm sm:text-sm font-normal mr-2 hidden sm:inline">({artist2Rank}{getOrdinalSuffix(artist2Rank)})</span>}
        <span className="sm:hidden">{formatNumberMobile(artist2Value)}</span>
        <span className="hidden sm:inline">{formatNumber(artist2Value)}</span>
      </div>
    </div>
  );
};

export default ComparisonBar; 