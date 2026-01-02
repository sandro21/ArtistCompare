const fs = require('fs');
const csv = require('csv-parser');
const https = require('https');

// Configuration
const BILLBOARD200_CSV_URL = 'https://raw.githubusercontent.com/utdata/rwd-billboard-data/refs/heads/main/data-out/billboard-200-current.csv';
const OUTPUT_FILE = 'data/billboard200-stats-test.json';
const MIN_YEAR = 1990;

// List of 50 popular artists to test (includes artists with known capitalization issues)
const TEST_ARTISTS = [
  'Jay Z', 'JAY Z', 'Jay-Z', 'JAY-Z', // Test capitalization variants
  'Drake', 'Taylor Swift', 'The Weeknd', 'Ariana Grande', 'Ed Sheeran',
  'Post Malone', 'Billie Eilish', 'Dua Lipa', 'The Beatles', 'Eminem',
  'Kanye West', 'Kendrick Lamar', 'Rihanna', 'Beyoncé', 'Bruno Mars',
  'Justin Bieber', 'Adele', 'The Weeknd', 'Travis Scott', 'Lil Nas X',
  'Cardi B', 'Nicki Minaj', 'SZA', 'Doja Cat', 'Megan Thee Stallion',
  'Bad Bunny', 'J Balvin', 'The Rolling Stones', 'Queen', 'Elton John',
  'Madonna', 'Michael Jackson', 'Prince', 'David Bowie', 'Bob Dylan',
  'Stevie Wonder', 'Marvin Gaye', 'Aretha Franklin', 'Whitney Houston',
  'Mariah Carey', 'Celine Dion', 'Shania Twain', 'Garth Brooks', 'Kenny Chesney',
  'Luke Combs', 'Morgan Wallen', 'Chris Stapleton', 'Miranda Lambert'
];

console.log('🧪 TEST MODE: Processing Billboard 200 data for 50 popular artists only...');
console.log(`📅 Processing data from ${MIN_YEAR} onwards`);
console.log(`🔗 Source: ${BILLBOARD200_CSV_URL}`);
console.log(`📝 Testing with ${TEST_ARTISTS.length} artists`);

function normalizeArtistName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize artist name for grouping - converts to lowercase with dashes
 * This merges variants like "Jay Z", "JAY Z", "Jay-Z", "JAY-Z" into "jay-z"
 */
function normalizeForGrouping(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces (including multiple) with single dash
    .replace(/[^\w-]/g, '')      // Remove special characters except alphanumeric and dashes
    .replace(/-+/g, '-')         // Collapse multiple dashes into single dash
    .replace(/^-|-$/g, '');      // Remove leading/trailing dashes
}

function splitArtistCollaborations(performerText) {
  if (!performerText) return [];
  
  const splitPatterns = [
    / featuring /i,
    / feat\.? /i,
    / ft\.? /i,
    / & /i,
    / and /i,
    / x /i,
    / with /i,
    /,/
  ];
  
  let artists = [performerText];
  
  splitPatterns.forEach(pattern => {
    let newArtists = [];
    artists.forEach(artist => {
      const split = artist.split(pattern);
      newArtists.push(...split);
    });
    artists = newArtists;
  });
  
  return artists
    .map(artist => artist.trim())
    .filter(artist => artist.length > 0)
    .filter(artist => {
      const lowerArtist = artist.toLowerCase();
      return !['the', 'and', 'or', 'his', 'her', 'orchestra', 'band', 'choir'].includes(lowerArtist);
    })
    .map(artist => {
      return artist
        .replace(/^(the\s+)/i, '')
        .replace(/\s+(featuring|feat\.?|ft\.?|with).*$/i, '')
        .trim();
    })
    .filter(artist => artist.length > 0);
}

function normalizeAlbumTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function createAlbumKey(title, performer) {
  return `${normalizeAlbumTitle(title)}|||${normalizeArtistName(performer)}`;
}

// Check if artist should be included in test
function shouldIncludeArtist(artistName) {
  const normalized = normalizeForGrouping(artistName);
  // Check if any test artist (normalized) matches
  return TEST_ARTISTS.some(testArtist => normalizeForGrouping(testArtist) === normalized);
}

function downloadAndProcessBillboard200() {
  return new Promise((resolve, reject) => {
    const allEntries = [];
    let totalRows = 0;
    let filteredRows = 0;
    let testArtistRows = 0;

    console.log('📥 Downloading Billboard 200 CSV data...');
    
    https.get(BILLBOARD200_CSV_URL, (response) => {
      response
        .pipe(csv())
        .on('data', (row) => {
          totalRows++;
          const chartYear = new Date(row.chart_week).getFullYear();
          const peakPosition = parseInt(row.peak_pos);
          const currentPosition = parseInt(row.current_week);
          const weeksOnChart = parseInt(row.wks_on_chart) || 0;
          
          // Filter for year and valid positions
          if (chartYear >= MIN_YEAR && !isNaN(peakPosition) && peakPosition >= 1 && peakPosition <= 200) {
            filteredRows++;
            
            // Check if this entry involves any of our test artists
            const individualArtists = splitArtistCollaborations(row.performer.trim());
            const hasTestArtist = individualArtists.some(artist => shouldIncludeArtist(artist));
            
            if (hasTestArtist) {
              testArtistRows++;
              allEntries.push({
                performer: row.performer.trim(),
                title: row.title.trim(),
                peakPosition: peakPosition,
                currentPosition: isNaN(currentPosition) ? peakPosition : currentPosition,
                chartWeek: row.chart_week,
                chartYear: chartYear,
                weeksOnChart: weeksOnChart
              });
            }
          }
        })
        .on('end', () => {
          console.log(`✅ Downloaded and filtered data:`);
          console.log(`   Total rows processed: ${totalRows.toLocaleString()}`);
          console.log(`   Rows after filtering: ${filteredRows.toLocaleString()}`);
          console.log(`   Rows with test artists: ${testArtistRows.toLocaleString()}`);
          
          processBillboard200Data(allEntries);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function processBillboard200Data(entries) {
  console.log('🔄 Processing Billboard 200 entries by artist...');
  
  // Step 1: Group entries by unique albums (title + performer combination)
  const uniqueAlbums = new Map();
  
  entries.forEach(entry => {
    const albumKey = createAlbumKey(entry.title, entry.performer);
    
    if (!uniqueAlbums.has(albumKey)) {
      uniqueAlbums.set(albumKey, {
        title: entry.title,
        performer: entry.performer,
        bestPeakPosition: entry.peakPosition,
        totalWeeksOnChart: entry.weeksOnChart,
        chartYears: new Set([entry.chartYear])
      });
    } else {
      const existing = uniqueAlbums.get(albumKey);
      if (entry.peakPosition < existing.bestPeakPosition) {
        existing.bestPeakPosition = entry.peakPosition;
      }
      if (entry.weeksOnChart > existing.totalWeeksOnChart) {
        existing.totalWeeksOnChart = entry.weeksOnChart;
      }
      existing.chartYears.add(entry.chartYear);
    }
  });
  
  console.log(`📊 Found ${uniqueAlbums.size.toLocaleString()} unique albums`);
  
  // Step 2: Group unique albums by individual artists (split collaborations)
  // Use normalized keys to merge capitalization variants
  const performerStats = new Map();
  
  uniqueAlbums.forEach((album, albumKey) => {
    const individualArtists = splitArtistCollaborations(album.performer);
    
    individualArtists.forEach(artist => {
      // Only process if this artist is in our test list
      if (!shouldIncludeArtist(artist)) {
        return;
      }
      
      // Normalize the artist name for grouping (merges variants like "Jay Z" and "JAY-Z")
      const normalizedKey = normalizeForGrouping(artist);
      
      if (!performerStats.has(normalizedKey)) {
        performerStats.set(normalizedKey, {
          entries: 0,
          top10s: 0,
          number1s: 0,
          wks_on_chart: 0
        });
      }
      
      const stats = performerStats.get(normalizedKey);
      stats.entries++;
      stats.wks_on_chart += album.totalWeeksOnChart;
      
      if (album.bestPeakPosition <= 10) {
        stats.top10s++;
      }
      
      if (album.bestPeakPosition === 1) {
        stats.number1s++;
      }
    });
  });
  
  // Step 3: Create final output structure
  const finalStats = {};
  
  performerStats.forEach((stats, normalizedKey) => {
    finalStats[normalizedKey] = {
      billboard200: {
        entries: stats.entries,
        top10s: stats.top10s,
        number1s: stats.number1s,
        wks_on_chart: stats.wks_on_chart
      }
    };
  });
  
  // Add metadata
  const output = {
    metadata: {
      generated_at: new Date().toISOString(),
      source_url: BILLBOARD200_CSV_URL,
      min_year: MIN_YEAR,
      total_artists: Object.keys(finalStats).length,
      total_unique_albums: uniqueAlbums.size,
      version: '1.0.0-test',
      test_mode: true,
      test_artists: TEST_ARTISTS
    },
    artists: finalStats
  };
  
  console.log('💾 Saving processed data...');
  
  // Format JSON with one artist per line for better readability and smaller diffs
  const metadataStr = JSON.stringify(output.metadata);
  const artistsEntries = Object.entries(finalStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, stats]) => `  ${JSON.stringify(name)}:${JSON.stringify(stats)}`)
    .join(',\n');
  const formattedJson = `{\n"metadata":${metadataStr},\n"artists":{\n${artistsEntries}\n}\n}`;
  
  fs.writeFileSync(OUTPUT_FILE, formattedJson);
  
  console.log(`✅ Billboard 200 test stats saved to ${OUTPUT_FILE}`);
  console.log(`📊 Processed ${Object.keys(finalStats).length.toLocaleString()} unique artists (normalized)`);
  
  // Show stats for verification
  console.log('\n🔍 Stats for verification:');
  const sampleArtists = ['Jay Z', 'Drake', 'Taylor Swift', 'The Beatles', 'Madonna', 'Elton John'];
  
  sampleArtists.forEach(artistName => {
    const normalizedKey = normalizeForGrouping(artistName);
    const stats = finalStats[normalizedKey];
    
    if (stats) {
      console.log(`   ${artistName} (${normalizedKey}): ${stats.billboard200.entries} entries, ${stats.billboard200.top10s} top 10s, ${stats.billboard200.number1s} #1s, ${stats.billboard200.wks_on_chart} weeks`);
    } else {
      console.log(`   ${artistName} (${normalizedKey}): Not found`);
    }
  });
  
  console.log('\n✨ Test processing complete! Check the numbers against Billboard.com for accuracy.');
}

// Run the processor
if (require.main === module) {
  downloadAndProcessBillboard200()
    .then(() => {
      console.log('🎉 Billboard 200 test processing completed successfully!');
    })
    .catch(error => {
      console.error('❌ Error processing Billboard 200 data:', error);
      process.exit(1);
    });
}

module.exports = { downloadAndProcessBillboard200 };

