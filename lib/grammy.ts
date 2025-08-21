import grammyData from '../data/grammy.json';

interface GrammyData {
  artist: string;
  wins: number;
  nominations: number;
}

/**
 * Get Grammy wins and nominations for a specific artist
 * @param artistName - The name of the artist to search for
 * @returns Object containing wins and nominations, or null if not found
 */
export function getGrammyData(artistName: string): { wins: number; nominations: number } | null {
  // First, try exact match
  const exactMatch = grammyData.find((artist: GrammyData) => 
    artist.artist.toLowerCase() === artistName.toLowerCase()
  );
  
  if (exactMatch) {
    return {
      wins: exactMatch.wins,
      nominations: exactMatch.nominations
    };
  }
  
  // If no exact match, try very restrictive partial match for slight variations only
  // Only match if the names are very similar (difference of a few characters)
  const partialMatch = grammyData.find((artist: GrammyData) => {
    const artistLower = artist.artist.toLowerCase().trim();
    const searchLower = artistName.toLowerCase().trim();
    
    // Only allow partial match if:
    // 1. The search name is at least 80% of the database name length
    // 2. AND one contains the other as a substantial part (not just 1-2 characters)
    if (searchLower.length < artistLower.length * 0.8) return false;
    if (artistLower.length < searchLower.length * 0.8) return false;
    
    // Check for substantial overlap (at least 4 characters and 70% similarity)
    const minLength = Math.min(artistLower.length, searchLower.length);
    if (minLength < 4) return false;
    
    return artistLower.includes(searchLower) || searchLower.includes(artistLower);
  });
  
  if (partialMatch) {
    return {
      wins: partialMatch.wins,
      nominations: partialMatch.nominations
    };
  }
  
  // Return null if no match found
  return null;
}

/**
 * Get all Grammy data
 * @returns Array of all Grammy data
 */
export function getAllGrammyData(): GrammyData[] {
  return grammyData;
}
