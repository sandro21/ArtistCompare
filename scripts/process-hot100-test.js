const fs = require('fs');
const csv = require('csv-parser');
const https = require('https');

// Configuration
const HOT100_CSV_URL = 'https://raw.githubusercontent.com/utdata/rwd-billboard-data/main/data-out/hot-100-current.csv';
const OUTPUT_FILE = 'data/billboard-hot100-stats-test.json';
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

console.log('🧪 TEST MODE: Processing Hot 100 data for 50 popular artists only...');
console.log(`📅 Processing data from ${MIN_YEAR} onwards`);
console.log(`🔗 Source: ${HOT100_CSV_URL}`);
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

function normalizeSongTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function createSongKey(title, performer) {
  return `${normalizeSongTitle(title)}|||${normalizeArtistName(performer)}`;
}

// Check if artist should be included in test
function shouldIncludeArtist(artistName) {
  const normalized = normalizeForGrouping(artistName);
  // Check if any test artist (normalized) matches
  return TEST_ARTISTS.some(testArtist => normalizeForGrouping(testArtist) === normalized);
}

async function downloadAndProcessHot100() {
  console.log('📥 Downloading Hot 100 CSV data...');
  
  const allEntries = [];
  let totalRows = 0;
  let filteredRows = 0;
  let testArtistRows = 0;
  
  return new Promise((resolve, reject) => {
    https.get(HOT100_CSV_URL, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      response
        .pipe(csv())
        .on('data', (row) => {
          totalRows++;
          
          const chartDate = new Date(row.chart_week);
          const chartYear = chartDate.getFullYear();
          
          if (chartYear < MIN_YEAR) {
            return;
          }
          
          if (!row.performer || !row.title || !row.peak_pos) {
            return;
          }
          
          const peakPosition = parseInt(row.peak_pos);
          const currentPosition = parseInt(row.current_week);
          
          if (isNaN(peakPosition) || peakPosition < 1 || peakPosition > 100) {
            return;
          }
          
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
              chartYear: chartYear
            });
          }
        })
        .on('end', () => {
          console.log(`✅ Downloaded and filtered data:`);
          console.log(`   Total rows processed: ${totalRows.toLocaleString()}`);
          console.log(`   Rows after filtering: ${filteredRows.toLocaleString()}`);
          console.log(`   Rows with test artists: ${testArtistRows.toLocaleString()}`);
          
          processHot100Data(allEntries);
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

function processHot100Data(entries) {
  console.log('🔄 Processing Hot 100 entries by artist...');
  
  // Step 1: Group entries by unique songs (title + performer combination)
  const uniqueSongs = new Map();
  
  entries.forEach(entry => {
    const songKey = createSongKey(entry.title, entry.performer);
    
    if (!uniqueSongs.has(songKey)) {
      uniqueSongs.set(songKey, {
        title: entry.title,
        performer: entry.performer,
        bestPeakPosition: entry.peakPosition,
        appearances: 1,
        chartYears: new Set([entry.chartYear])
      });
    } else {
      const existing = uniqueSongs.get(songKey);
      if (entry.peakPosition < existing.bestPeakPosition) {
        existing.bestPeakPosition = entry.peakPosition;
      }
      existing.appearances++;
      existing.chartYears.add(entry.chartYear);
    }
  });
  
  console.log(`📊 Found ${uniqueSongs.size.toLocaleString()} unique songs`);
  
  // Step 2: Group unique songs by individual artists (split collaborations)
  // Use normalized keys to merge capitalization variants
  const performerStats = new Map();
  
  uniqueSongs.forEach((song, songKey) => {
    const individualArtists = splitArtistCollaborations(song.performer);
    
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
          number1s: 0
        });
      }
      
      const stats = performerStats.get(normalizedKey);
      stats.entries++;
      
      if (song.bestPeakPosition <= 10) {
        stats.top10s++;
      }
      
      if (song.bestPeakPosition === 1) {
        stats.number1s++;
      }
    });
  });
  
  // Step 3: Create final output structure
  const finalStats = {};
  
  performerStats.forEach((stats, normalizedKey) => {
    finalStats[normalizedKey] = {
      hot100: {
        entries: stats.entries,
        top10s: stats.top10s,
        number1s: stats.number1s
      }
    };
  });
  
  // Add metadata
  const output = {
    metadata: {
      generated_at: new Date().toISOString(),
      source_url: HOT100_CSV_URL,
      min_year: MIN_YEAR,
      total_artists: Object.keys(finalStats).length,
      total_unique_songs: uniqueSongs.size,
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
  
  console.log(`✅ Hot 100 test stats saved to ${OUTPUT_FILE}`);
  console.log(`📊 Processed ${Object.keys(finalStats).length.toLocaleString()} unique artists (normalized)`);
  
  // Show stats for verification
  console.log('\n🔍 Stats for verification:');
  const sampleArtists = ['Jay Z', 'Drake', 'Taylor Swift', 'The Beatles', 'Madonna', 'Elton John'];
  
  sampleArtists.forEach(artistName => {
    const normalizedKey = normalizeForGrouping(artistName);
    const stats = finalStats[normalizedKey];
    
    if (stats) {
      console.log(`   ${artistName} (${normalizedKey}): ${stats.hot100.entries} entries, ${stats.hot100.top10s} top 10s, ${stats.hot100.number1s} #1s`);
    } else {
      console.log(`   ${artistName} (${normalizedKey}): Not found`);
    }
  });
  
  console.log('\n✨ Test processing complete! Check the numbers against Billboard.com for accuracy.');
}

// Run the processor
if (require.main === module) {
  downloadAndProcessHot100()
    .then(() => {
      console.log('🎉 Hot 100 test processing completed successfully!');
    })
    .catch(error => {
      console.error('❌ Error processing Hot 100 data:', error);
      process.exit(1);
    });
}

module.exports = { downloadAndProcessHot100 };

