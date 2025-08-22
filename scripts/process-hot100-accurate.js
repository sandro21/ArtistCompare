const fs = require('fs');
const csv = require('csv-parser');
const https = require('https');

// Configuration
const HOT100_CSV_URL = 'https://raw.githubusercontent.com/utdata/rwd-billboard-data/main/data-out/hot-100-current.csv';
const OUTPUT_FILE = 'data/billboard-hot100-stats.json';
const MIN_YEAR = 1990; // CAN BE CHANGED! MIN YEAR

console.log('1. Starting accurate Hot 100 data processing...');
console.log(`2. Processing data from ${MIN_YEAR} onwards`);
console.log(`3. Source: ${HOT100_CSV_URL}`);

function normalizeArtistName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    // Don't remove "the" or other words - keep original structure
    // Don't remove punctuation - features like "Drake Featuring Rihanna" should stay distinct
    .replace(/\s+/g, ' ') // Only collapse multiple spaces
    .trim();
}

function splitArtistCollaborations(performerText) {
  if (!performerText) return [];
  
  // Split on common collaboration indicators
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
  
  // Apply each split pattern
  splitPatterns.forEach(pattern => {
    let newArtists = [];
    artists.forEach(artist => {
      const split = artist.split(pattern);
      newArtists.push(...split);
    });
    artists = newArtists;
  });
  
  // Clean up each artist name
  return artists
    .map(artist => artist.trim())
    .filter(artist => artist.length > 0)
    .filter(artist => {
      // Filter out common filler words that aren't artist names
      const lowerArtist = artist.toLowerCase();
      return !['the', 'and', 'or', 'his', 'her', 'orchestra', 'band', 'choir'].includes(lowerArtist);
    })
    .map(artist => {
      // Clean up common prefixes/suffixes
      return artist
        .replace(/^(the\s+)/i, '') // Remove leading "The"
        .replace(/\s+(featuring|feat\.?|ft\.?|with).*$/i, '') // Remove trailing featuring clauses
        .trim();
    })
    .filter(artist => artist.length > 0);
}

function normalizeSongTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\s+/g, ' ') // Only collapse multiple spaces - keep punctuation for distinctness
    .trim();
}

function createSongKey(title, performer) {
  return `${normalizeSongTitle(title)}|||${normalizeArtistName(performer)}`;
}

function findArtistMatch(performer, targetArtist) {
  const normalizedPerformer = normalizeArtistName(performer);
  const normalizedTarget = normalizeArtistName(targetArtist);
  
  // Exact match first
  if (normalizedPerformer === normalizedTarget) {
    return { match: true, type: 'exact' };
  }
  
  // Check if performer contains target (for features/collaborations)
  // But use word boundaries to avoid false matches
  const words = normalizedTarget.split(' ');
  const allWordsFound = words.every(word => {
    if (word.length <= 2) return true; // Skip short words like "ft", "x", etc.
    return normalizedPerformer.includes(word);
  });
  
  if (allWordsFound && normalizedTarget.length >= 3) {
    return { match: true, type: 'partial' };
  }
  
  return { match: false, type: 'none' };
}

async function downloadAndProcessHot100() {
  console.log('📥 Downloading Hot 100 CSV data...');
  
  const allEntries = [];
  let totalRows = 0;
  let filteredRows = 0;
  
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
          
          // Filter by year
          const chartDate = new Date(row.chart_week);
          const chartYear = chartDate.getFullYear();
          
          if (chartYear < MIN_YEAR) {
            return; // Skip rows before MIN_YEAR
          }
          
          // Validate required fields
          if (!row.performer || !row.title || !row.peak_pos) {
            return; // Skip invalid rows
          }
          
          const peakPosition = parseInt(row.peak_pos);
          const currentPosition = parseInt(row.current_week);
          
          if (isNaN(peakPosition) || peakPosition < 1 || peakPosition > 100) {
            return; // Skip invalid peak positions
          }
          
          filteredRows++;
          allEntries.push({
            performer: row.performer.trim(),
            title: row.title.trim(),
            peakPosition: peakPosition,
            currentPosition: isNaN(currentPosition) ? peakPosition : currentPosition,
            chartWeek: row.chart_week,
            chartYear: chartYear
          });
        })
        .on('end', () => {
          console.log(`✅ Downloaded and filtered data:`);
          console.log(`   Total rows processed: ${totalRows.toLocaleString()}`);
          console.log(`   Rows after filtering: ${filteredRows.toLocaleString()}`);
          console.log(`   Filtered out: ${(totalRows - filteredRows).toLocaleString()} rows`);
          
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
      // Keep the best (lowest number) peak position
      if (entry.peakPosition < existing.bestPeakPosition) {
        existing.bestPeakPosition = entry.peakPosition;
      }
      existing.appearances++;
      existing.chartYears.add(entry.chartYear);
    }
  });
  
  console.log(`📊 Found ${uniqueSongs.size.toLocaleString()} unique songs`);
  
  // Step 2: Group unique songs by individual artists (split collaborations)
  const performerStats = new Map();
  
  uniqueSongs.forEach((song, songKey) => {
    // Split the performer into individual artists
    const individualArtists = splitArtistCollaborations(song.performer);
    
    // Count this song for each individual artist
    individualArtists.forEach(artist => {
      if (!performerStats.has(artist)) {
        performerStats.set(artist, {
          entries: 0,
          top10s: 0,
          number1s: 0
        });
      }
      
      const stats = performerStats.get(artist);
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
  
  performerStats.forEach((stats, performer) => {
    finalStats[performer] = {
      hot100: {
        entries: stats.entries,
        top10s: stats.top10s,
        number1s: stats.number1s
      }
      // Removed detailed song info - only keeping essential numbers
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
      version: '1.0.0'
    },
    artists: finalStats
  };
  
  console.log('💾 Saving processed data...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log(`✅ Hot 100 stats saved to ${OUTPUT_FILE}`);
  console.log(`📊 Processed ${Object.keys(finalStats).length.toLocaleString()} unique artists`);
  
  // Show some sample stats for verification
  console.log('\n🔍 Sample stats for verification:');
  const sampleArtists = ['Drake', 'Taylor Swift', 'The Beatles', 'Madonna', 'Elton John'];
  
  sampleArtists.forEach(artistName => {
    // Try to find exact or partial match
    let found = null;
    let matchType = 'none';
    
    // First try exact match
    for (const [performer, stats] of Object.entries(finalStats)) {
      if (normalizeArtistName(performer) === normalizeArtistName(artistName)) {
        found = stats;
        matchType = 'exact';
        break;
      }
    }
    
    // Then try partial match
    if (!found) {
      for (const [performer, stats] of Object.entries(finalStats)) {
        if (normalizeArtistName(performer).includes(normalizeArtistName(artistName))) {
          found = stats;
          matchType = 'partial';
          break;
        }
      }
    }
    
    if (found) {
      console.log(`   ${artistName} (${matchType}): ${found.hot100.entries} entries, ${found.hot100.top10s} top 10s, ${found.hot100.number1s} #1s`);
    } else {
      console.log(`   ${artistName}: Not found`);
    }
  });
  
  console.log('\n✨ Processing complete! Check the numbers against Billboard.com for accuracy.');
}

// Run the processor
if (require.main === module) {
  downloadAndProcessHot100()
    .then(() => {
      console.log('🎉 Hot 100 processing completed successfully!');
    })
    .catch(error => {
      console.error('❌ Error processing Hot 100 data:', error);
      process.exit(1);
    });
}

module.exports = { downloadAndProcessHot100 };
