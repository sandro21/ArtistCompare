#!/usr/bin/env node

/**
 * Standalone script to trigger Google Trends pre-population
 * Can be run manually or via npm run pre-populate
 * curl -X POST "https://artist-compare.vercel.app/api/google-trends?action=pre-populate"
 */

const https = require('https');
const http = require('http');

// Get the base URL from environment or use localhost for development
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

console.log('Manual Google Trends pre-population...');
console.log(`Target URL: ${BASE_URL}/api/google-trends?action=pre-populate`);

// Function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      method: 'POST',
      timeout: 300000, // 5 minutes timeout for pre-population
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Main execution
async function main() {
  try {
    // Check if SERPAPI_KEY is available
    if (!process.env.SERPAPI_KEY) {
      console.log('SERPAPI_KEY not found in environment variables');
      console.log('Please set SERPAPI_KEY in your .env.local file');
      return;
    }
    
    console.log('Starting Google Trends pre-population...');
    
    const response = await makeRequest(`${BASE_URL}/api/google-trends?action=pre-populate`);
    
    if (response.status === 200 && response.data.ok) {
      console.log('Pre-population completed successfully!');
      console.log(`${response.data.message}`);
      
      if (response.data.details) {
        console.log(`Total cached: ${response.data.details.totalCached} artists`);
        console.log(`API calls made: ${response.data.details.totalBatches}`);
        
        // Show batch results
        if (response.data.details.results) {
          console.log('\nBatch Results:');
          response.data.details.results.forEach((result, index) => {
            const status = result.status === 'success' ? 'SUCCESS' : 'FAILED';
            console.log(`  ${status} Batch ${result.batch}: ${result.artists.join(', ')}`);
            if (result.status === 'error') {
              console.log(`     Error: ${result.error}`);
            }
          });
        }
      }
    } else {
      console.log('Pre-population failed:');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${response.data.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.log('Error during pre-population:');
    console.log(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Make sure your Next.js app is running on the target URL');
    }
  }
}

// Run the script
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
