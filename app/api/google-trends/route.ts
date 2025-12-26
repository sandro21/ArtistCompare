import { NextResponse } from 'next/server';
import { 
	getMultipleArtistTrends, 
	saveArtistTrends, 
	saveMultipleArtistTrends,
	getDatabaseStatus,
	getQueryStatistics
} from '@/lib/db/trends';

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
			
			// Prepare artist data for database storage
			const artistsToSave = batch.map((artistName, index) => {
				const artistData = timelineData.map((item: any) => ({
					date: item.date,
					value: item.values[index]?.extracted_value || 0
				}));
				
				return {
					name: artistName,
					data: artistData
				};
			});
			
			// Save all artists to database
			const saveResult = await saveMultipleArtistTrends(artistsToSave);
			totalCached += saveResult.saved;
			
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

		// Check database for both artists at once (more efficient)
		let artistAData = null;
		let artistBData = null;
		let apiCallsMade = 0;

		// Get both artists from database
		const dbResults = await getMultipleArtistTrends([a, b]);
		artistAData = dbResults.get(a) || null;
		artistBData = dbResults.get(b) || null;

		// If both artists are in database, combine and return
		if (artistAData && artistBData) {
			const combinedData = combineArtistData(artistAData, artistBData, a, b);
			const filteredData = filterDataByRange(combinedData, range);
			
			return NextResponse.json({
				ok: true,
				data: filteredData,
				params: { a, b, range },
				fromDatabase: true,
				source: 'database',
				apiCallsMade: 0,
				totalDataPoints: combinedData.length,
				filteredDataPoints: filteredData.length
			});
		}

		// Make API call for both artists and update both in database (refreshes cached data)
		if (!artistAData || !artistBData) {
			const queryString = `${a},${b}`;
			const response = await fetch(`https://serpapi.com/search?engine=google_trends&q=${queryString}&date=all&data_type=TIMESERIES&api_key=${apiKey}`);
			const data = await response.json();
			
			// Process artist data from API response
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
			
			// Update both artists in database (saves new ones, refreshes existing ones)
			await saveArtistTrends(a, apiArtistAData);
			await saveArtistTrends(b, apiArtistBData);
			
			artistAData = apiArtistAData;
			artistBData = apiArtistBData;
			
			apiCallsMade = 1;
		}

		// Combine the data for comparison
		const combinedData = combineArtistData(artistAData, artistBData, a, b);
		const filteredData = filterDataByRange(combinedData, range);
		
		return NextResponse.json({
			ok: true,
			data: filteredData,
			params: { a, b, range },
			fromDatabase: apiCallsMade === 0,
			source: apiCallsMade === 0 ? 'database' : 'api-call',
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

// POST endpoint for pre-populate and database management
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
	
	if (action === 'database-status' || action === 'db-status') {
		try {
			const dbData = await getDatabaseStatus();
			
			return NextResponse.json({
				ok: true,
				totalArtists: dbData.length,
				artists: dbData,
				totalDataPoints: dbData.reduce((sum, artist) => sum + artist.dataPoints, 0)
			});
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to get database status', details: error instanceof Error ? error.message : 'Unknown error' },
				{ status: 500 }
			);
		}
	}
	
	// Legacy support: redirect old cache-status to database-status
	if (action === 'cache-status') {
		try {
			const dbData = await getDatabaseStatus();
			
			return NextResponse.json({
				ok: true,
				totalArtists: dbData.length,
				artists: dbData,
				totalDataPoints: dbData.reduce((sum, artist) => sum + artist.dataPoints, 0),
				note: 'cache-status is deprecated, use database-status instead'
			});
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to get database status', details: error instanceof Error ? error.message : 'Unknown error' },
				{ status: 500 }
			);
		}
	}
	
	if (action === 'query-stats' || action === 'query-statistics') {
		try {
			const limit = parseInt(searchParams.get('limit') || '10');
			const stats = await getQueryStatistics(limit);
			
			return NextResponse.json({
				ok: true,
				...stats
			});
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to get query statistics', details: error instanceof Error ? error.message : 'Unknown error' },
				{ status: 500 }
			);
		}
	}
	
	return NextResponse.json({
		error: 'Invalid action'
	}, { status: 400 });
}

// helper function to filter data by range: (all, 10yr, 5yr, 1yr)
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
		case '10y': {
			const tenYearsAgo = new Date();
			tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
			return data.filter(item => new Date(item.date) >= tenYearsAgo);
		}
		case 'all':
		default: {
			return data; // Return all data
		}
	}
}

