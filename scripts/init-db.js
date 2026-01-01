#!/usr/bin/env node

/**
 * Initialize the database table for artist trends
 * Run this once after setting up Neon database
 * 
 * Usage: node scripts/init-db.js
 */

// Import the function (using dynamic import for ES modules)
async function main() {
	console.log('🚀 Initializing database table...');
	console.log('📝 This will create the "artist_trends" table if it doesn\'t exist\n');
	
	try {
		// Dynamic import for ES modules
		const { initializeTrendsTable } = await import('../lib/db/trends.js');
		await initializeTrendsTable();
		
		console.log('\n✅ Database table initialized successfully!');
		console.log('📊 You can now start using the database to store artist trends.');
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Failed to initialize database:', error);
		console.error('\n💡 Make sure:');
		console.error('   1. Neon database is connected to your Vercel project');
		console.error('   2. POSTGRES_URL or DATABASE_URL environment variable is set');
		console.error('   3. You\'re running this from the project root');
		console.error('\n📋 Error details:', error.message);
		process.exit(1);
	}
}

main();







