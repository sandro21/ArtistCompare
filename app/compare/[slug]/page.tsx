import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { deobfuscateArtistNames } from '../../../lib/seo-utils'

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
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

export default function ComparePage({ params }: Props) {
  const { slug } = params
  const artists = deobfuscateArtistNames(slug)
  
  if (!artists) {
    notFound()
  }
  
  // Redirect to main page with pre-selected artists
  // This preserves your existing functionality while providing SEO benefits
  const redirectUrl = `/?artist1=${encodeURIComponent(artists.artist1)}&artist2=${encodeURIComponent(artists.artist2)}`
  redirect(redirectUrl)
}
