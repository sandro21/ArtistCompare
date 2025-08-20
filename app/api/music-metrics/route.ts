import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistName = searchParams.get('artistName');
  const spotifyId = searchParams.get('spotifyId');

  if (!artistName || !spotifyId) {
    return NextResponse.json(
      { error: 'Artist name and Spotify ID are required' },
      { status: 400 }
    );
  }

  try {
    // Fetch artist metrics and ranking in parallel
    const [metricsData, rankingData] = await Promise.all([
      fetchArtistMetrics(artistName, spotifyId),
      fetchArtistRanking(artistName)
    ]);

    return NextResponse.json({
      artistName,
      spotifyId,
      ...metricsData,
      ...rankingData
    });

  } catch (error) {
    console.error('Error fetching music metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music metrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Function to fetch artist metrics from individual artist page
async function fetchArtistMetrics(artistName: string, spotifyId: string) {
  const url = `https://www.musicmetricsvault.com/artists/${encodeURIComponent(artistName)}/${spotifyId}`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for artist metrics`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract total streams
  let totalStreams = '';
  $('h2').each((_index: number, element: any) => {
    const text = $(element).text().trim();
    if (text === 'Total plays') {
      const parentDiv = $(element).closest('div');
      const nextDiv = parentDiv.next('div');
      totalStreams = nextDiv.find('div').first().text().trim();
      return false; // break the loop
    }
  });

  // Extract monthly listeners
  let monthlyListeners = '';
  $('h2').each((_index: number, element: any) => {
    const text = $(element).text().trim();
    if (text === 'Monthly listeners') {
      const parentDiv = $(element).closest('div');
      const nextDiv = parentDiv.next('div');
      monthlyListeners = nextDiv.text().trim();
      return false; // break the loop
    }
  });

  // Extract followers
  let followers = '';
  $('h2').each((_index: number, element: any) => {
    const text = $(element).text().trim();
    if (text === 'Followers') {
      const parentDiv = $(element).closest('div');
      const nextDiv = parentDiv.next('div');
      followers = nextDiv.text().trim();
      return false; // break the loop
    }
  });

  return {
    totalStreams,
    monthlyListeners,
    followers
  };
}

// Function to fetch artist ranking from most popular artists page
async function fetchArtistRanking(artistName: string) {
  try {
    // Fetch both rankings in parallel
    const [monthlyListenersRank, streamRank] = await Promise.all([
      fetchRankingFromPage(artistName, 'https://www.musicmetricsvault.com/most-popular-artists-spotify'),
      fetchRankingFromPage(artistName, 'https://www.musicmetricsvault.com/most-streamed-artists-spotify')
    ]);

    return {
      monthlyListenersRank,
      streamRank
    };
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return {
      monthlyListenersRank: null,
      streamRank: null
    };
  }
}

// Helper function to fetch ranking from a specific page
async function fetchRankingFromPage(artistName: string, url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for rankings from ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  let ranking = null;

  // Look for the artist in the table rows
  $('tr').each((_index: number, row: any) => {
    const $row = $(row);
    
    // Check if this row contains the artist name
    const xShowAttr = $row.attr('x-show');
    if (xShowAttr && xShowAttr.includes(`'${artistName}'`)) {
      // Extract the ranking number from the first td
      const rankingText = $row.find('td:first-child div').text().trim();
      const parsedRanking = parseInt(rankingText);
      if (!isNaN(parsedRanking)) {
        ranking = parsedRanking;
        return false; // break the loop
      }
    }
  });

  return ranking;
}
