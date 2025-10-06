#!/usr/bin/env node

/**
 * Post-build script to trigger Google Trends pre-population
 * This runs after the build completes and triggers the pre-populate API
 */

const https = require('https');
const http = require('http');

// Get the base URL from environment or use localhost for development
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

console.log('Post-build: Triggering Google Trends pre-population...');
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
    // Only run pre-population in production or when explicitly requested
    const shouldPrePopulate = process.env.NODE_ENV === 'production' || 
                             process.env.PRE_POPULATE === 'true' ||
                             process.env.VERCEL === '1';
    
    if (!shouldPrePopulate) {
      console.log('Skipping pre-population (not in production environment)');
      console.log('To force pre-population, set PRE_POPULATE=true');
      return;
    }
    
    // Check if SERPAPI_KEY is available
    if (!process.env.SERPAPI_KEY) {
      console.log('SERPAPI_KEY not found, skipping pre-population');
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
      }
    } else {
      console.log('Pre-population failed:');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${response.data.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.log('Error during pre-population:');
    console.log(error.message);
    
    // Don't fail the build if pre-population fails
    console.log('Build will continue despite pre-population error');
  }
}

// Run the script
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
