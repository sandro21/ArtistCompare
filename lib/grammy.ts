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
  
  // If no exact match, try partial match (in case of slight variations)
  const partialMatch = grammyData.find((artist: GrammyData) =>
    artist.artist.toLowerCase().includes(artistName.toLowerCase()) ||
    artistName.toLowerCase().includes(artist.artist.toLowerCase())
  );
  
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
