import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '../../../lib/seo-utils'

export async function GET(request: NextRequest) {
  // Rate limiting to prevent abuse
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(ip, 5, 60000)) { // 5 requests per minute
    return new NextResponse('Rate limit exceeded', { status: 429 })
  }
  
  const { searchParams } = new URL(request.url)
  const artist1 = searchParams.get('artist1')
  const artist2 = searchParams.get('artist2')
  
  if (!artist1 || !artist2) {
    return new NextResponse('Missing artist parameters', { status: 400 })
  }
  
  // Enhanced OG image with better design
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2d5a27;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#34d399;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Background pattern -->
      <circle cx="200" cy="150" r="80" fill="#10b981" opacity="0.1"/>
      <circle cx="1000" cy="480" r="120" fill="#34d399" opacity="0.1"/>
      <circle cx="950" cy="100" r="60" fill="#10b981" opacity="0.15"/>
      
      <!-- Main title -->
      <text x="600" y="180" font-family="Arial, sans-serif" font-size="56" font-weight="bold" text-anchor="middle" fill="url(#textGradient)">
        ${artist1} vs ${artist2}
      </text>
      
      <!-- VS separator -->
      <rect x="580" y="200" width="40" height="4" fill="#10b981" rx="2"/>
      
      <!-- Subtitle -->
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="#ffffff">
        Artist Comparison
      </text>
      
      <!-- Features -->
      <text x="600" y="340" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#cccccc">
        Billboard Charts • Grammy Awards • RIAA Certifications • Spotify Streams
      </text>
      
      <!-- Brand -->
      <text x="600" y="580" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#10b981">
        Artist Compare
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
