import { NextResponse } from 'next/server';

// Single unified cache for all artists (both pre-populated and user-discovered)
const cache = new Map();

// Cache entry structure: { data: [...], timestamp: Date }
interface CacheEntry {
	data: any[];
	timestamp: Date;
}

// Check if cache entry is expired (older than 1 month)
function isCacheExpired(timestamp: Date): boolean {
	const oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	return timestamp < oneMonthAgo;
}

// Function to combine two artists' individual data for comparison
function combineArtistData(artistAData: any[], artistBData: any[], artistA: string, artistB: string) {
	const combinedData = [];
	const maxLength = Math.max(artistAData.length, artistBData.length);
	
	for (let i = 0; i < maxLength; i++) {
		const dateA = artistAData[i]?.date;
		const dateB = artistBData[i]?.date;
		
		// Use the date from whichever array has data at this index
		const date = dateA || dateB;
		
		combinedData.push({
			date: date,
			[artistA]: artistAData[i]?.value || 0,
			[artistB]: artistBData[i]?.value || 0
		});
	}
	
	return combinedData;
}

// Pre-populate popular artists (10 API calls for 50 artists)
async function prePopulatePopularArtists(apiKey: string) {
	const popularArtists = [
		['Drake', 'Kendrick Lamar', 'J. Cole', 'Travis Scott', 'Kanye West'],
		['21 Savage', 'Lil Baby', 'Lil Uzi Vert', 'Eminem', 'Future'],
		['Taylor Swift', 'Ariana Grande', 'Billie Eilish', 'Dua Lipa', 'Olivia Rodrigo'],
		['Beyoncé', 'Rihanna', 'SZA', 'Doja Cat', 'Nicki Minaj'],
		['The Weeknd', 'Post Malone', 'Ed Sheeran', 'Justin Bieber', 'Harry Styles'],
		['BTS', 'BLACKPINK', 'Stray Kids', 'NewJeans', 'SEVENTEEN'],
		['Bad Bunny', 'KAROL G', 'Peso Pluma', 'Feid', 'Shakira'],
		['Burna Boy', 'Wizkid', 'Rema', 'Tems', 'Ayra Starr'],
		['Coldplay', 'Imagine Dragons', 'Linkin Park', 'Arctic Monkeys', 'The 1975'],
		['Morgan Wallen', 'Zach Bryan', 'Luke Combs', 'Lainey Wilson', 'Chris Stapleton']
	];

	let totalCached = 0;
	const results = [];

	for (let i = 0; i < popularArtists.length; i++) {
		const batch = popularArtists[i];
		const queryString = batch.join(',');
		
		try {
			console.log(`Fetching batch ${i + 1}: ${queryString}`);
			const response = await fetch(`https://serpapi.com/search?engine=google_trends&q=${queryString}&date=all&data_type=TIMESERIES&api_key=${apiKey}`);
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			
			const data = await response.json();
			
			if (!data.interest_over_time || !data.interest_over_time.timeline_data) {
				throw new Error('Invalid API response structure');
			}
			
			const timelineData = data.interest_over_time.timeline_data;
			
			// Cache each artist individually in unified cache
			batch.forEach((artistName, index) => {
				const artistData = timelineData.map((item: any) => ({
					date: item.date,
					value: item.values[index]?.extracted_value || 0
				}));
				
				// Store in unified cache
				cache.set(artistName, {
					data: artistData,
					timestamp: new Date()
				});
				totalCached++;
			});
			
			results.push({
				batch: i + 1,
				artists: batch,
				status: 'success',
				cached: batch.length
			});
			
		} catch (error) {
			results.push({
				batch: i + 1,
				artists: batch,
				status: 'error',
				error: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	}
	
	return {
		totalCached,
		totalBatches: popularArtists.length,
		results
	};
}

// Function declaration
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const a = searchParams.get('a');
	const b = searchParams.get('b');
	const range = searchParams.get('range') || 'all';

	if (!a || !b) {
		return NextResponse.json(
			{ error: 'Missing required query params: a and b' },
			{ status: 400 }
		);
	}

	try {
		const apiKey = process.env.SERPAPI_KEY;
		
		if (!apiKey) {
			return NextResponse.json(
				{ error: 'SerpApi key not configured' },
				{ status: 500 }
			);
		}

		// Check each artist individually in unified cache
		let artistAData = null;
		let artistBData = null;
		let apiCallsMade = 0;

		// Check Artist A
		if (cache.has(a) && !isCacheExpired(cache.get(a).timestamp)) {
			artistAData = cache.get(a).data;
		}

		// Check Artist B
		if (cache.has(b) && !isCacheExpired(cache.get(b).timestamp)) {
			artistBData = cache.get(b).data;
		}

		// If both artists are cached, combine and return
		if (artistAData && artistBData) {
			const combinedData = combineArtistData(artistAData, artistBData, a, b);
			const filteredData = filterDataByRange(combinedData, range);
			
			return NextResponse.json({
				ok: true,
				data: filteredData,
				params: { a, b, range },
				cached: true,
				source: 'both-cached',
				apiCallsMade: 0,
				totalDataPoints: combinedData.length,
				filteredDataPoints: filteredData.length
			});
		}

		// Make API call for both artists (but only cache missing ones)
		if (!artistAData || !artistBData) {
			const queryString = `${a},${b}`;
			const response = await fetch(`https://serpapi.com/search?engine=google_trends&q=${queryString}&date=all&data_type=TIMESERIES&api_key=${apiKey}`);
			const data = await response.json();
			
			// Process and cache individual artist data
			const timelineData = data.interest_over_time.timeline_data;
			
			// Process both artists from API response
			const apiArtistAData = timelineData.map((item: any) => ({
				date: item.date,
				value: item.values[0]?.extracted_value || 0
			}));
			
			const apiArtistBData = timelineData.map((item: any) => ({
				date: item.date,
				value: item.values[1]?.extracted_value || 0
			}));
			
			// Only cache missing artists
			if (!artistAData) {
				cache.set(a, {
					data: apiArtistAData,
					timestamp: new Date()
				});
				artistAData = apiArtistAData;
			}
			
			if (!artistBData) {
				cache.set(b, {
					data: apiArtistBData,
					timestamp: new Date()
				});
				artistBData = apiArtistBData;
			}
			
			apiCallsMade = 1;
		}

		// Combine the data for comparison
		const combinedData = combineArtistData(artistAData, artistBData, a, b);
		const filteredData = filterDataByRange(combinedData, range);
		
		return NextResponse.json({
			ok: true,
			data: filteredData,
			params: { a, b, range },
			cached: apiCallsMade === 0,
			source: apiCallsMade === 0 ? 'both-cached' : 'api-call',
			apiCallsMade: apiCallsMade,
			totalDataPoints: combinedData.length,
			filteredDataPoints: filteredData.length
		});
	} catch (error) {
		console.error('SerpApi error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch trends data' },
			{ status: 500 }
		);
	}
}

// POST endpoint for pre-populate and cache management
export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const action = searchParams.get('action');
	
	if (action === 'pre-populate') {
		try {
			const apiKey = process.env.SERPAPI_KEY;
			
			if (!apiKey) {
				return NextResponse.json(
					{ error: 'SerpApi key not configured' },
					{ status: 500 }
				);
			}
			
			const result = await prePopulatePopularArtists(apiKey);
			
			return NextResponse.json({
				ok: true,
				message: `Pre-populated ${result.totalCached} artists using ${result.totalBatches} API calls`,
				details: result
			});
			
		} catch (error) {
			return NextResponse.json(
				{ error: 'Pre-population failed', details: error instanceof Error ? error.message : 'Unknown error' },
				{ status: 500 }
			);
		}
	}
	
	if (action === 'cache-status') {
		const cacheKeys = Array.from(cache.keys());
		const cacheData = cacheKeys.map(key => {
			const entry: CacheEntry = cache.get(key);
			const isExpired = isCacheExpired(entry.timestamp);
			
			// Remove expired entries
			if (isExpired) {
				cache.delete(key);
			}
			
			return {
				artist: key,
				dataPoints: entry.data?.length || 0,
				firstDate: entry.data?.[0]?.date,
				lastDate: entry.data?.[entry.data.length - 1]?.date,
				cachedAt: entry.timestamp,
				isExpired: isExpired,
				cacheAge: Math.floor((Date.now() - entry.timestamp.getTime()) / (1000 * 60 * 60 * 24)) // days
			};
		}).filter(artist => !artist.isExpired); // Only show non-expired artists
		
		return NextResponse.json({
			ok: true,
			cacheSize: cache.size,
			cachedArtists: cacheData,
			totalDataPoints: cacheData.reduce((sum, artist) => sum + artist.dataPoints, 0),
			expiredCount: cacheKeys.length - cacheData.length
		});
	}
	
	if (action === 'clear-cache') {
		cache.clear();
		return NextResponse.json({
			ok: true,
			message: 'Cache cleared'
		});
	}
	
	return NextResponse.json({
		error: 'Invalid action'
	}, { status: 400 });
}

// helper function to filter data by range: (all, 5yr, 1yr)
function filterDataByRange(data: any[], range: string) {
	const now = new Date();
	
	switch (range) {
		case '1y': {
			const oneYearAgo = new Date();
			oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
			return data.filter(item => new Date(item.date) >= oneYearAgo);
		}
		case '5y': {
			const fiveYearsAgo = new Date();
			fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
			return data.filter(item => new Date(item.date) >= fiveYearsAgo);
		}
		case 'all':
		default: {
			return data; // Return all data
		}
	}
}

