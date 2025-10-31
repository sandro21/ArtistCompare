import { notFound } from "next/navigation";
import { Metadata } from "next";
import { deobfuscateArtistNames } from "../../../lib/seo-utils";
import RedirectClient from "./RedirectClient";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = deobfuscateArtistNames(slug);

  if (!decoded) {
    return {
      title: "Artist Comparison Not Found",
    };
  }

  const { artist1, artist2 } = decoded;
  // Handle different deployment scenarios
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                   'https://artistcompare.com';
  const ogImageUrl = `${baseUrl}/api/og/${slug}`;
  const comparisonUrl = `${baseUrl}/compare/${slug}`;

  const title = `${artist1} vs ${artist2} - Artist Comparison`;
  const description = `Compare ${artist1} vs ${artist2} with comprehensive stats: Billboard charts, Grammy awards, Spotify streams, and more. See who's more successful!`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      url: comparisonUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${artist1} vs ${artist2} - Artist Comparison`,
        },
      ],
      siteName: 'Artist Compare',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: comparisonUrl,
    },
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


