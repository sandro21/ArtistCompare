import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { deobfuscateArtistNames } from '../../../lib/seo-utils'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artists = deobfuscateArtistNames(slug)
  
  if (!artists) {
    return {
      title: 'Artist Comparison Not Found | Artist Compare',
      description: 'The requested artist comparison could not be found.',
    }
  }
  
  const { artist1, artist2 } = artists
  
  return {
    title: `${artist1} vs ${artist2} - Artist Comparison | Artist Compare`,
    description: `Compare ${artist1} and ${artist2} - detailed stats, Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data. See who's the better artist!`,
    keywords: [
      `${artist1} vs ${artist2}`,
      `${artist1} comparison`,
      `${artist2} comparison`,
      `${artist1} stats`,
      `${artist2} stats`,
      `${artist1} vs ${artist2} stats`,
      'music artist comparison',
      'billboard charts',
      'grammy awards',
      'spotify streams',
      'artist battle'
    ],
    openGraph: {
      title: `${artist1} vs ${artist2} - Artist Comparison`,
      description: `Compare ${artist1} and ${artist2} with detailed music statistics, charts, and awards data.`,
      images: [
        {
          url: `/api/og-image?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`,
          width: 1200,
          height: 630,
          alt: `${artist1} vs ${artist2} comparison`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist1} vs ${artist2} - Artist Comparison`,
      description: `Compare ${artist1} and ${artist2} with detailed music statistics and charts.`,
      images: [`/api/og-image?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`],
    },
    alternates: {
      canonical: `/compare/${slug}`,
    },
  }
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const artists = deobfuscateArtistNames(slug)
  
  if (!artists) {
    notFound()
  }
  
  // Add structured data for the comparison
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${artists.artist1} vs ${artists.artist2} - Artist Comparison`,
    "description": `Compare ${artists.artist1} and ${artists.artist2} with detailed music statistics, charts, and awards data.`,
    "url": `https://artist-compare.vercel.app/compare/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Artist Comparison",
      "itemListElement": [
        {
          "@type": "MusicGroup",
          "name": artists.artist1,
          "url": `https://artist-compare.vercel.app/compare/${slug}`
        },
        {
          "@type": "MusicGroup", 
          "name": artists.artist2,
          "url": `https://artist-compare.vercel.app/compare/${slug}`
        }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://artist-compare.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Artist Comparison",
          "item": `https://artist-compare.vercel.app/compare/${slug}`
        }
      ]
    }
  }
  
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body>
        {/* Redirect to main page with pre-selected artists */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.location.href = '/?artist1=${encodeURIComponent(artists.artist1)}&artist2=${encodeURIComponent(artists.artist2)}';
            `
          }}
        />
        <div style={{ textAlign: 'center', padding: '2rem', color: '#10b981' }}>
          <h1>Redirecting to comparison...</h1>
          <p>If you are not redirected automatically, <a href="/?artist1=${encodeURIComponent(artists.artist1)}&artist2=${encodeURIComponent(artists.artist2)}" style={{ color: '#10b981' }}>click here</a>.</p>
        </div>
      </body>
    </html>
  )
}
