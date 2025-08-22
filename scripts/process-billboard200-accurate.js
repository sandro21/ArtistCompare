const fs = require('fs');
const csv = require('csv-parser');
const https = require('https');

// Configuration
const BILLBOARD200_CSV_URL = 'https://raw.githubusercontent.com/utdata/rwd-billboard-data/refs/heads/main/data-out/billboard-200-current.csv';
const OUTPUT_FILE = 'data/billboard200-stats.json';
const MIN_YEAR = 1990; // Only include data from 1990 onwards

console.log('🎵 Starting accurate Billboard 200 data processing...');
console.log(`📅 Processing data from ${MIN_YEAR} onwards`);
console.log(`🔗 Source: ${BILLBOARD200_CSV_URL}`);

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

function normalizeAlbumTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\s+/g, ' ') // Only collapse multiple spaces - keep punctuation for distinctness
    .trim();
}

function createAlbumKey(title, performer) {
  return `${normalizeAlbumTitle(title)}|||${normalizeArtistName(performer)}`;
}

function downloadAndProcessBillboard200() {
  return new Promise((resolve, reject) => {
    const allEntries = [];
    let totalRows = 0;
    let filteredRows = 0;

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
        })
        .on('end', () => {
          console.log(`✅ Downloaded and filtered data:`);
          console.log(`   Total rows processed: ${totalRows.toLocaleString()}`);
          console.log(`   Rows after filtering: ${filteredRows.toLocaleString()}`);
          console.log(`   Filtered out: ${(totalRows - filteredRows).toLocaleString()} rows`);
          
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
      // Keep the best (lowest number) peak position
      if (entry.peakPosition < existing.bestPeakPosition) {
        existing.bestPeakPosition = entry.peakPosition;
      }
      // Use the maximum weeks on chart seen for this album
      if (entry.weeksOnChart > existing.totalWeeksOnChart) {
        existing.totalWeeksOnChart = entry.weeksOnChart;
      }
      existing.chartYears.add(entry.chartYear);
    }
  });
  
  console.log(`📊 Found ${uniqueAlbums.size.toLocaleString()} unique albums`);
  
  // Step 2: Group unique albums by individual artists (split collaborations)
  const performerStats = new Map();
  
  uniqueAlbums.forEach((album, albumKey) => {
    // Split the performer into individual artists
    const individualArtists = splitArtistCollaborations(album.performer);
    
    // Count this album for each individual artist
    individualArtists.forEach(artist => {
      if (!performerStats.has(artist)) {
        performerStats.set(artist, {
          entries: 0,
          top10s: 0,
          number1s: 0,
          wks_on_chart: 0
        });
      }
      
      const stats = performerStats.get(artist);
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
  
  performerStats.forEach((stats, performer) => {
    finalStats[performer] = {
      billboard200: {
        entries: stats.entries,
        top10s: stats.top10s,
        number1s: stats.number1s,
        wks_on_chart: stats.wks_on_chart
      }
      // Removed detailed album info - only keeping essential numbers
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
      version: '1.0.0'
    },
    artists: finalStats
  };
  
  console.log('💾 Saving processed data...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log(`✅ Billboard 200 stats saved to ${OUTPUT_FILE}`);
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
      console.log(`   ${artistName} (${matchType}): ${found.billboard200.entries} entries, ${found.billboard200.top10s} top 10s, ${found.billboard200.number1s} #1s, ${found.billboard200.wks_on_chart} weeks`);
    } else {
      console.log(`   ${artistName}: Not found`);
    }
  });
  
  console.log('\n✨ Processing complete! Check the numbers against Drake reference data.');
}

// Run the processor
if (require.main === module) {
  downloadAndProcessBillboard200()
    .then(() => {
      console.log('🎉 Billboard 200 processing completed successfully!');
    })
    .catch(error => {
      console.error('❌ Error processing Billboard 200 data:', error);
      process.exit(1);
    });
}

module.exports = { downloadAndProcessBillboard200 };
