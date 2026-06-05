import type { Metadata } from 'next';
import HomeContentWrapper from './HomeContent';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://artistcompare.com';

const SECTION_TITLES: Record<string, string> = {
  streams:  'Streaming Stats',
  billboard: 'Billboard Charts',
  grammy:   'Grammy Awards',
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const share = params.share;   // e.g. "billboard"
  const d     = params.d;       // base64-encoded relative og URL

  if (share && d) {
    try {
      const ogRelativeUrl = atob(d);                   // decode
      const absoluteOgUrl = `${BASE_URL}${ogRelativeUrl}`;
      const a1 = params.artist1 || 'Artist A';
      const a2 = params.artist2 || 'Artist B';
      const section = SECTION_TITLES[share] ?? share;
      const title = `${a1} vs ${a2} — ${section}`;
      const description = `${a1} vs ${a2} on ${section}. See the full breakdown on ArtistCompare.com`;

      return {
        title,
        description,
        openGraph: {
          type: 'website',
          title,
          description,
          url: `${BASE_URL}/?artist1=${encodeURIComponent(a1)}&artist2=${encodeURIComponent(a2)}&share=${share}`,
          images: [{ url: absoluteOgUrl, width: 1200, height: 630, alt: title }],
          siteName: 'ArtistCompare',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [absoluteOgUrl],
        },
      };
    } catch {
      /* invalid base64 — fall through to default */
    }
  }

  return {
    title: 'ArtistCompare — Settle The Debate',
    description: 'Compare music artists side by side with Billboard charts, Grammy awards, Spotify streams and more.',
    openGraph: {
      type: 'website',
      title: 'ArtistCompare — Settle The Debate',
      description: 'Compare music artists side by side with Billboard charts, Grammy awards, Spotify streams and more.',
      url: BASE_URL,
      siteName: 'ArtistCompare',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ArtistCompare — Settle The Debate',
      description: 'Compare music artists side by side with Billboard charts, Grammy awards, Spotify streams and more.',
    },
  };
}

export default function Home() {
  return <HomeContentWrapper />;
}
