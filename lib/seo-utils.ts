import crypto from 'crypto';

// Simple obfuscation to make URLs less predictable
const SECRET_KEY = process.env.URL_SECRET_KEY || 'artist-compare-secret-2024';

export function obfuscateArtistNames(artist1: string, artist2: string): string {
  // Replace spaces with hyphens and remove special characters for URL safety
  const cleanArtist1 = artist1.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  const cleanArtist2 = artist2.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  const combined = `${cleanArtist1}-vs-${cleanArtist2}`;
  const hash = crypto.createHmac('sha256', SECRET_KEY).update(combined).digest('hex').substring(0, 8);
  return `${combined}-${hash}`;
}

export function deobfuscateArtistNames(obfuscated: string): { artist1: string; artist2: string } | null {
  try {
    // Handle URL decoding first
    const decoded = decodeURIComponent(obfuscated);
    const parts = decoded.split('-');
    if (parts.length < 3) return null;
    
    const hash = parts.pop();
    const combined = parts.join('-');
    
    // Verify the hash
    const expectedHash = crypto.createHmac('sha256', SECRET_KEY).update(combined).digest('hex').substring(0, 8);
    if (hash !== expectedHash) return null;
    
    const vsIndex = combined.lastIndexOf('-vs-');
    if (vsIndex === -1) return null;
    
    const artist1 = combined.substring(0, vsIndex).replace(/-/g, ' ');
    const artist2 = combined.substring(vsIndex + 4).replace(/-/g, ' ');
    
    return {
      artist1: artist1.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      artist2: artist2.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    };
  } catch {
    return null;
  }
}

export function generateComparisonUrl(artist1: string, artist2: string): string {
  const obfuscated = obfuscateArtistNames(artist1, artist2);
  return `/compare/${obfuscated}`;
}

// Rate limiting for API calls (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}
