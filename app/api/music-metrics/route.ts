import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { getTrackDetails } from '../../../lib/spotify';
import { parseMetricValue } from '../../../lib/utils/formatters';

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
      // Fetch artist metrics and ranking in parallel with individual error handling
      const [metricsResult, rankingResult] = await Promise.allSettled([
        fetchArtistMetrics(artistName, spotifyId),
        fetchArtistRanking(artistName)
      ]);

      const metricsData = metricsResult.status === 'fulfilled' 
        ? metricsResult.value 
        : { totalStreams: '', monthlyListeners: '', followers: '', error: 'Metrics unavailable' };

      const rankingData = rankingResult.status === 'fulfilled' 
        ? rankingResult.value 
        : { monthlyListenersRank: null, streamRank: null };

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

// Extract a stat value from Music Metrics Vault's card layout (label p → value p)
function extractStatCardValue($: cheerio.CheerioAPI, label: string): string {
  let value = '';
  $('p.text-sm.font-medium.text-gray-500').each((_index, element) => {
    if ($(element).text().trim() === label) {
      value = $(element).next('p.text-2xl.font-bold.text-gray-900').text().trim();
      return false;
    }
  });
  return value;
}

// Function to fetch artist metrics from individual artist page
async function fetchArtistMetrics(artistName: string, spotifyId: string) {
  const url = `https://www.musicmetricsvault.com/artists/${encodeURIComponent(artistName)}/${spotifyId}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout (site is very slow)
      redirect: 'follow' // Follow redirects automatically
    });

    if (!response.ok) {
      console.warn(`Music Metrics Vault returned ${response.status} for artist metrics`);
      throw new Error(`HTTP ${response.status} for artist metrics`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const monthlyListeners = extractStatCardValue($, 'Monthly Listeners');
    const followers = extractStatCardValue($, 'Followers');
    const totalStreams = extractStatCardValue($, 'Total Streams');

    console.log(`✅ Successfully fetched metrics for ${artistName}`);
    return {
      totalStreams,
      monthlyListeners,
      followers
    };
  } catch (error) {
    console.error(`❌ Failed to fetch metrics for ${artistName}:`, error instanceof Error ? error.message : error);
    throw error;
  }
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

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'");
}

function findArtistRankInHtml($: cheerio.CheerioAPI, artistName: string): number | null {
  const normalizedName = artistName.toLowerCase();

  // Primary: Livewire snapshot contains the full ranked artist list
  const snapshotEls = $('[wire\\:snapshot]');
  for (let i = 0; i < snapshotEls.length; i++) {
    const raw = $(snapshotEls[i]).attr('wire:snapshot');
    if (!raw?.includes('allArtists')) continue;

    try {
      const data = JSON.parse(decodeHtmlEntities(raw));
      const allArtists = data?.data?.allArtists?.[0];
      if (!Array.isArray(allArtists)) continue;

      for (const entry of allArtists) {
        const artist = entry?.[0];
        if (artist?.name?.toLowerCase() === normalizedName) {
          const rank = artist._original_rank;
          return typeof rank === 'number' ? rank : null;
        }
      }
    } catch {
      continue;
    }
  }

  // Fallback: JSON-LD ItemList (limited to top entries)
  const jsonLdScripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < jsonLdScripts.length; i++) {
    try {
      const data = JSON.parse($(jsonLdScripts[i]).html() || '');
      if (data['@type'] !== 'ItemList' || !Array.isArray(data.itemListElement)) continue;

      const match = data.itemListElement.find(
        (item: { item?: { name?: string }; position?: number }) =>
          item?.item?.name?.toLowerCase() === normalizedName,
      );
      if (match?.position) return match.position;
    } catch {
      continue;
    }
  }

  // Fallback: visible ranking rows in the initial HTML
  let ranking: number | null = null;
  $('div.flex.items-center.gap-4.p-3').each((_index, element) => {
    const $row = $(element);
    const name = $row.find('h3.text-sm.font-semibold').text().trim();
    if (name.toLowerCase() === normalizedName) {
      const rankText = $row.find('.w-8.text-center span').first().text().trim();
      const parsed = parseInt(rankText, 10);
      if (!isNaN(parsed)) {
        ranking = parsed;
        return false;
      }
    }
  });

  return ranking;
}

// Helper function to fetch ranking from a specific page
async function fetchRankingFromPage(artistName: string, url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    signal: AbortSignal.timeout(15000) // 15 second timeout
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for rankings from ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  return findArtistRankInHtml($, artistName);
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
    },
    signal: AbortSignal.timeout(15000) // 15 second timeout
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for top tracks`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const tracks: any[] = [];

  // Find the "Popular Tracks" section and extract list items
  $('h2').each((_index: number, element: any) => {
    const text = $(element).text().trim();
    if (text === 'Popular Tracks') {
      const section = $(element).closest('.bg-white.rounded-xl, .bg-white.shadow-sm, section, div').first();
      const trackRows = section.find('.divide-y > div.flex.items-center.gap-4');

      trackRows.each((rowIndex: number, row: any) => {
        if (rowIndex >= 5) return false;

        const $row = $(row);
        const trackName = $row.find('p.text-sm.font-medium.text-gray-900').first().text().trim();
        const streamsText = $row.find('.text-right p.text-sm.font-semibold.text-gray-900').first().text().trim();
        const spotifyLink = $row.find('a[href*="spotify.com/track/"]').attr('href') || '';
        const albumImage = $row.find('img').attr('src') || $row.find('img').attr('data-src') || null;
        const totalStreams = parseMetricValue(streamsText);

        if (trackName && totalStreams > 0) {
          tracks.push({
            name: trackName,
            url: spotifyLink,
            totalStreams,
            totalStreamsFormatted: totalStreams.toLocaleString('en-US'),
            dailyStreams: null,
            dailyStreamsFormatted: null,
            albumImage,
            albumName: null,
          });
        }
      });

      return false;
    }
  });

  return tracks;
}