#!/usr/bin/env node

/**
 * Initialize the database table for artist trends
 * Run this once after setting up Neon database
 * 
 * Usage: npx tsx scripts/init-db.ts
 */

import { initializeTrendsTable } from '../lib/db/trends';

async function main() {
	console.log('🚀 Initializing database table...');
	console.log('📝 This will create the "artist_trends" table if it doesn\'t exist\n');
	
	try {
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
		process.exit(1);
	}
}

main();












