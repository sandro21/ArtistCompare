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
  
  // For now, return a simple text-based OG image
  // In production, you'd want to generate actual images with canvas or a service like Vercel OG
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#1a1a1a"/>
      <text x="600" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#ffffff">
        ${artist1} vs ${artist2}
      </text>
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#cccccc">
        Compare Music Artists - Stats, Charts & Awards
      </text>
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#888888">
        Billboard Charts • Grammy Awards • Spotify Streams
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
