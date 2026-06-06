import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { deobfuscateArtistNames } from "../../../lib/seo-utils";
import RedirectClient from "./RedirectClient";

// Resolve public origin from request host so OG URLs use the canonical domain,
// not the auth-protected *.vercel.app deployment URL.
async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto') || 'https';
      return `${proto}://${host}`;
    }
  } catch { /* headers unavailable */ }
  return 'https://artistcompare.com';
}

const SECTION_TITLES: Record<string, string> = {
  streams:   'Spotify Stats',
  billboard: 'Billboard Charts',
  grammy:    'Grammy Awards',
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const decoded = deobfuscateArtistNames(slug);

  if (!decoded) {
    return { title: 'Artist Comparison Not Found' };
  }

  const { artist1, artist2 } = decoded;
  const baseUrl = await getBaseUrl();
  const comparisonUrl = `${baseUrl}/compare/${slug}`;

  // Section-specific share embed
  const share = sp.share;
  const d     = sp.d;
  if (share && d) {
    try {
      const ogRelativeUrl  = decodeURIComponent(atob(d));
      const absoluteOgUrl  = `${baseUrl}${ogRelativeUrl}`;
      const section = SECTION_TITLES[share] ?? share;
      const title   = `${artist1} vs ${artist2} — ${section}`;
      const description = `${artist1} vs ${artist2} on ${section}. See the full breakdown on ArtistCompare.com`;
      return {
        title,
        description,
        openGraph: {
          type: 'website', title, description,
          url: `${comparisonUrl}?share=${share}`,
          images: [{ url: absoluteOgUrl, width: 1200, height: 630, alt: title, type: 'image/png' }],
          siteName: 'ArtistCompare',
        },
        twitter: { card: 'summary_large_image', title, description, images: [absoluteOgUrl] },
        alternates: { canonical: comparisonUrl },
      };
    } catch { /* fall through */ }
  }

  // Default comparison metadata
  const ogImageUrl = `${baseUrl}/api/og/${slug}`;
  const title = `${artist1} vs ${artist2} - Artist Comparison`;
  const description = `Compare ${artist1} vs ${artist2} with comprehensive stats: Billboard charts, Grammy awards, Spotify streams, and more.`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      url: comparisonUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${artist1} vs ${artist2}`, type: 'image/png' }],
      siteName: 'ArtistCompare',
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImageUrl] },
    alternates: { canonical: comparisonUrl },
  };
}

export default async function CompareSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decoded = deobfuscateArtistNames(slug);

  if (!decoded) {
    // If slug is invalid or hash mismatch, show 404
    notFound();
  }

  const { artist1, artist2 } = decoded;
  const target = `/?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`;

  // Render page with metadata (for crawlers) and client-side redirect (for users)
  return <RedirectClient target={target} />;
}


