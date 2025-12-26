import { neon } from '@neondatabase/serverless';

// Get database connection from environment variable
// Vercel automatically adds POSTGRES_URL or DATABASE_URL when you connect Neon
const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL || '');

// Artist trend data structure (matches what you're currently using)
export interface ArtistTrendData {
	date: string;
	value: number;
}

/**
 * Initialize the database table
 * This creates the table structure to store artist trends
 * Call this once when setting up
 */
export async function initializeTrendsTable() {
	try {
		await sql`
			CREATE TABLE IF NOT EXISTS artist_trends (
				artist_name TEXT PRIMARY KEY,
				trend_data JSONB NOT NULL,
				updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			)
		`;
		
		// Create index for faster lookups on updated_at (for checking expiration)
		await sql`
			CREATE INDEX IF NOT EXISTS idx_artist_trends_updated_at 
			ON artist_trends(updated_at)
		`;
		
		// Also initialize query logs table
		await initializeQueryLogsTable();
		
		console.log('✅ Database tables initialized');
		return true;
	} catch (error) {
		console.error('❌ Error initializing database table:', error);
		throw error;
	}
}

/**
 * Get trend data for a single artist from database
 * Returns null if artist not found or data is expired (>1 month old)
 */
export async function getArtistTrends(artistName: string): Promise<ArtistTrendData[] | null> {
	try {
		const result = await sql`
			SELECT trend_data, updated_at 
			FROM artist_trends 
			WHERE artist_name = ${artistName}
		`;
		
		// Artist not in database
		if (result.length === 0) {
			return null;
		}
		
		// Check if data is expired (older than 1 month)
		const updatedAt = new Date(result[0].updated_at);
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
		
		if (updatedAt < oneMonthAgo) {
			// Data expired, return null so it gets refreshed
			return null;
		}
		
		// Return the trend data
		return result[0].trend_data as ArtistTrendData[];
	} catch (error) {
		console.error(`Error fetching trends for ${artistName}:`, error);
		return null;
	}
}

/**
 * Get trend data for multiple artists at once
 * Returns a Map: artist name -> trend data (or null if not found/expired)
 * This is more efficient than calling getArtistTrends multiple times
 */
export async function getMultipleArtistTrends(
	artistNames: string[]
): Promise<Map<string, ArtistTrendData[] | null>> {
	const result = new Map<string, ArtistTrendData[] | null>();
	
	if (artistNames.length === 0) {
		return result;
	}
	
	try {
		// Query all artists at once using SQL ANY operator
		const dbResult = await sql`
			SELECT artist_name, trend_data, updated_at 
			FROM artist_trends 
			WHERE artist_name = ANY(${artistNames})
		`;
		
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
		
		// Initialize all as null (not found)
		artistNames.forEach(name => result.set(name, null));
		
		// Fill in found artists (if not expired)
		for (const row of dbResult) {
			const updatedAt = new Date(row.updated_at);
			
			// Only use data if it's not expired
			if (updatedAt >= oneMonthAgo) {
				result.set(row.artist_name, row.trend_data as ArtistTrendData[]);
			}
			// If expired, leave as null so it gets refreshed
		}
		
		return result;
	} catch (error) {
		console.error('Error fetching multiple artist trends:', error);
		// On error, return all as null (safer to refresh)
		artistNames.forEach(name => result.set(name, null));
		return result;
	}
}

/**
 * Save or update trend data for a single artist
 * Uses INSERT ... ON CONFLICT to update if artist already exists
 */
export async function saveArtistTrends(
	artistName: string,
	trendData: ArtistTrendData[]
): Promise<boolean> {
	try {
		await sql`
			INSERT INTO artist_trends (artist_name, trend_data, updated_at)
			VALUES (${artistName}, ${JSON.stringify(trendData)}::jsonb, NOW())
			ON CONFLICT (artist_name) 
			DO UPDATE SET 
				trend_data = ${JSON.stringify(trendData)}::jsonb,
				updated_at = NOW()
		`;
		
		return true;
	} catch (error) {
		console.error(`Error saving trends for ${artistName}:`, error);
		return false;
	}
}

/**
 * Save trend data for multiple artists
 * Saves them one by one (simple and reliable)
 */
export async function saveMultipleArtistTrends(
	artists: Array<{ name: string; data: ArtistTrendData[] }>
): Promise<{ saved: number; failed: number }> {
	if (artists.length === 0) {
		return { saved: 0, failed: 0 };
	}
	
	let saved = 0;
	let failed = 0;
	
	// Save each artist individually
	for (const artist of artists) {
		const success = await saveArtistTrends(artist.name, artist.data);
		if (success) saved++;
		else failed++;
	}
	
	return { saved, failed };
}

/**
 * Check which artists are missing or expired from database
 * Returns array of artist names that need to be fetched from API
 */
export async function getMissingArtists(artistNames: string[]): Promise<string[]> {
	if (artistNames.length === 0) {
		return [];
	}
	
	try {
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
		
		// Get all artists that exist and are NOT expired
		const dbResult = await sql`
			SELECT artist_name 
			FROM artist_trends 
			WHERE artist_name = ANY(${artistNames})
			AND updated_at >= ${oneMonthAgo}
		`;
		
		const foundArtists = new Set(dbResult.map(row => row.artist_name));
		
		// Return artists that are NOT in the found set (missing or expired)
		return artistNames.filter(name => !foundArtists.has(name));
	} catch (error) {
		console.error('Error checking missing artists:', error);
		// On error, assume all are missing (safer to refresh)
		return artistNames;
	}
}

/**
 * Get database status (for debugging/admin purposes)
 * Shows all artists in database with their info
 */
export async function getDatabaseStatus() {
	try {
		const result = await sql`
			SELECT 
				artist_name,
				jsonb_array_length(trend_data) as data_points,
				updated_at
			FROM artist_trends
			ORDER BY updated_at DESC
		`;
		
		return result.map(row => {
			const ageMs = new Date().getTime() - new Date(row.updated_at).getTime();
			const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
			
			return {
				artist: row.artist_name,
				dataPoints: parseInt(row.data_points) || 0,
				updatedAt: row.updated_at,
				ageDays: ageDays
			};
		});
	} catch (error) {
		console.error('Error getting database status:', error);
		return [];
	}
}

/**
 * Initialize the query logs table
 * Tracks all artist comparisons for analytics
 */
export async function initializeQueryLogsTable() {
	try {
		await sql`
			CREATE TABLE IF NOT EXISTS query_logs (
				id SERIAL PRIMARY KEY,
				artist_a TEXT NOT NULL,
				artist_b TEXT NOT NULL,
				created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			)
		`;
		
		// Create indexes for common queries
		await sql`
			CREATE INDEX IF NOT EXISTS idx_query_logs_artists 
			ON query_logs(artist_a, artist_b)
		`;
		
		await sql`
			CREATE INDEX IF NOT EXISTS idx_query_logs_created_at 
			ON query_logs(created_at DESC)
		`;
		
		console.log('✅ Query logs table initialized');
		return true;
	} catch (error) {
		console.error('❌ Error initializing query logs table:', error);
		throw error;
	}
}

/**
 * Log a query/comparison to the database
 */
export async function logQuery(
	artistA: string,
	artistB: string
): Promise<boolean> {
	try {
		await sql`
			INSERT INTO query_logs (artist_a, artist_b)
			VALUES (${artistA}, ${artistB})
		`;
		return true;
	} catch (error) {
		console.error('Error logging query:', error);
		return false;
	}
}

/**
 * Get query statistics
 * Returns popular comparisons and total queries
 */
export async function getQueryStatistics(limit: number = 10) {
	try {
		// Get most popular comparisons
		const popularComparisons = await sql`
			SELECT 
				artist_a,
				artist_b,
				COUNT(*) as query_count,
				MAX(created_at) as last_queried
			FROM query_logs
			GROUP BY artist_a, artist_b
			ORDER BY query_count DESC
			LIMIT ${limit}
		`;
		
		// Get total query count
		const totalQueries = await sql`
			SELECT COUNT(*) as count FROM query_logs
		`;
		
		return {
			totalQueries: parseInt(totalQueries[0]?.count || '0'),
			popularComparisons: popularComparisons.map(row => ({
				artistA: row.artist_a,
				artistB: row.artist_b,
				queryCount: parseInt(row.query_count),
				lastQueried: row.last_queried
			}))
		};
	} catch (error) {
		console.error('Error getting query statistics:', error);
		return {
			totalQueries: 0,
			popularComparisons: []
		};
	}
}

