import { NextResponse } from 'next/server';
import { initializeTrendsTable } from '@/lib/db/trends';

/**
 * API endpoint to initialize the database table
 * Call this once: GET /api/init-db
 * 
 * This creates the artist_trends table if it doesn't exist
 */
export async function GET() {
	try {
		console.log('🚀 Initializing database table...');
		await initializeTrendsTable();
		
		return NextResponse.json({
			ok: true,
			message: 'Database table initialized successfully!',
			table: 'artist_trends'
		});
	} catch (error) {
		console.error('❌ Failed to initialize database:', error);
		
		return NextResponse.json(
			{
				ok: false,
				error: 'Failed to initialize database',
				details: error instanceof Error ? error.message : 'Unknown error',
				hint: 'Make sure POSTGRES_URL or DATABASE_URL is set in your environment variables'
			},
			{ status: 500 }
		);
	}
}



