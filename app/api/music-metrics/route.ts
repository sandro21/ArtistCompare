import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Simple in-memory cache for top tracks to avoid repeated requests
interface CacheEntry { data: any; expires: number }
const TOP_TRACKS_CACHE = new Map<string, CacheEntry>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistName = searchParams.get('artistName');
  const spotifyId = searchParams.get('spotifyId');
  const topTracksOnly = searchParams.get('topTracksOnly') === 'true';

  if (!artistName || !spotifyId) {
    return NextResponse.json(
      { error: 'Artist name and Spotify ID are required' },
      { status: 400 }
    );
  }

  try {
    if (topTracksOnly) {
      // Handle top tracks request with caching
      const cacheKey = `${artistName}-${spotifyId}`;
      const cached = TOP_TRACKS_CACHE.get(cacheKey);
      
      if (cached && cached.expires > Date.now()) {
        return NextResponse.json({ tracks: cached.data, cached: true });
      }

      const topTracks = await fetchTopTracks(artistName, spotifyId);
      TOP_TRACKS_CACHE.set(cacheKey, { data: topTracks, expires: Date.now() + TTL_MS });
      
      return NextResponse.json({ 
        tracks: topTracks, 
        cached: false, 
        fetchedAt: new Date().toISOString() 
      });
    } else {
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
    }

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

// Function to fetch top tracks from Music Metrics Vault
async function fetchTopTracks(artistName: string, spotifyId: string) {
  // First, try Kworb.net (faster but limited to top artists)
  try {
    console.log(`Trying Kworb.net for artist ${spotifyId}...`);
    const kworbTracks = await fetchTopTracksFromKworb(spotifyId);
    if (kworbTracks && kworbTracks.length > 0) {
      console.log(`Success: Kworb.net returned ${kworbTracks.length} tracks for ${spotifyId}`);
      return kworbTracks;
    }
  } catch (error) {
    console.log(`Kworb.net failed for ${spotifyId}, falling back to Music Metrics Vault:`, error instanceof Error ? error.message : error);
  }

  // Fallback to Music Metrics Vault (slower but more comprehensive)
  console.log(`Using Music Metrics Vault fallback for artist ${spotifyId}...`);
  return await fetchTopTracksFromMusicMetrics(artistName, spotifyId);
}

// Function to fetch top tracks from Kworb.net (fast but limited)
async function fetchTopTracksFromKworb(spotifyId: string) {
  const url = `https://kworb.net/spotify/artist/${spotifyId}_songs.html`;
  
  const response = await fetch(url, { 
    headers: { 
      'User-Agent': 'artist-compare/1.0 (+https://example.com)' 
    },
    signal: AbortSignal.timeout(5000) // 5 second timeout
  });

  if (!response.ok) {
    throw new Error(`Kworb.net HTTP ${response.status}`);
  }

  const html = await response.text();
  
  // Parse Kworb.net HTML (similar to old implementation)
  const marker = '</tr></thead><tbody>';
  const idx = html.indexOf(marker);
  if (idx === -1) throw new Error('No data table found on Kworb.net');
  
  const body = html.slice(idx + marker.length);
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/gm;
  const rows: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = rowRegex.exec(body)) && rows.length < 10) {
    rows.push(m[0]);
  }

  const tracks: any[] = [];
  for (const row of rows) {
    const linkMatch = row.match(/<a href=\"(https:\/\/open.spotify.com\/track\/[^\"']+)\"[^>]*>([^<]+)<\/a>/);
    if (!linkMatch) continue;
    
    let title = linkMatch[2].trim();
    title = title.replace(/^\*\s*/, '');
    const url = linkMatch[1];

    // Extract all <td> contents
    const tdMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gm)].map(r => r[1]);
    if (tdMatches.length < 3) continue;
    
    const totalStreamsRaw = tdMatches[1];
    const dailyStreamsRaw = tdMatches[2];
    const totalStreams = parseNumber(totalStreamsRaw);
    const dailyStreams = dailyStreamsRaw ? parseNumber(dailyStreamsRaw) : null;
    
    tracks.push({
      name: title,
      url,
      totalStreams,
      totalStreamsFormatted: totalStreams.toLocaleString('en-US'),
      dailyStreams,
      dailyStreamsFormatted: dailyStreams !== null ? dailyStreams.toLocaleString('en-US') : null,
      albumImage: null, // Will be enriched with Spotify API
      albumName: null
    });
    
    if (tracks.length === 5) break;
  }

  if (tracks.length === 0) {
    throw new Error('No tracks parsed from Kworb.net');
  }

  // Enrich with album covers from Spotify API
  return await enrichKworbTracksWithAlbumCovers(tracks);
}

// Function to enrich Kworb tracks with album covers (similar to old implementation)
async function enrichKworbTracksWithAlbumCovers(tracks: any[]) {
  const { getTrackDetails } = await import('../../../lib/spotify');
  
  const enrichedTracks = await Promise.allSettled(
    tracks.map(async (track) => {
      try {
        const trackIdMatch = track.url.match(/track\/([a-zA-Z0-9]+)/);
        if (trackIdMatch) {
          const trackDetails = await getTrackDetails(trackIdMatch[1]);
          return {
            ...track,
            albumImage: trackDetails.albumImage,
            albumName: trackDetails.albumName,
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch album for track ${track.name}:`, error);
      }
      return track;
    })
  );

  return enrichedTracks.map((result, index) => 
    result.status === 'fulfilled' ? result.value : tracks[index]
  );
}

// Helper function to parse numbers from strings (for Kworb.net)
function parseNumber(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

// Function to fetch top tracks from Music Metrics Vault (comprehensive but slower)
async function fetchTopTracksFromMusicMetrics(artistName: string, spotifyId: string) {
  const url = `https://www.musicmetricsvault.com/artists/${encodeURIComponent(artistName)}/${spotifyId}`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for top tracks`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const tracks: any[] = [];

  // Find the "Most popular tracks" section and extract the table data
  $('h2').each((_index: number, element: any) => {
    const text = $(element).text().trim();
    if (text === 'Most popular tracks') {
      // Navigate to the table within this section
      const parentDiv = $(element).closest('div');
      const tableContainer = parentDiv.parent().find('table');
      
      // Extract data from table rows (skip header)
      tableContainer.find('tbody tr').each((rowIndex: number, row: any) => {
        if (rowIndex >= 5) return false; // Only get top 5 tracks

        const $row = $(row);
        
        // Extract image
        const imgElement = $row.find('img').first();
        const albumImage = imgElement.attr('data-src') || imgElement.attr('src') || null;
        
        // Extract track name and Spotify URL
        const trackCell = $row.find('td:nth-child(2)');
        const trackName = trackCell.find('.font-medium').text().trim();
        const spotifyLink = trackCell.find('a[href*="spotify.com"]').attr('href') || '';
        
        // Extract play count
        const playsCell = $row.find('td:nth-child(3)');
        const playsText = playsCell.text().trim().replace(/,/g, '');
        const totalStreams = parseInt(playsText) || 0;
        
        if (trackName && totalStreams > 0) {
          tracks.push({
            name: trackName,
            url: spotifyLink,
            totalStreams,
            totalStreamsFormatted: totalStreams.toLocaleString('en-US'),
            dailyStreams: null, // Music Metrics Vault doesn't provide daily streams
            dailyStreamsFormatted: null,
            albumImage,
            albumName: null // Could be extracted if needed, but not required per user request
          });
        }
      });
      
      return false; // break the outer loop
    }
  });

  return tracks;
}