import { redirect, notFound } from "next/navigation";
import { deobfuscateArtistNames } from "../../../lib/seo-utils";

export default async function CompareSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decoded = deobfuscateArtistNames(slug);

  if (!decoded) {
    // If slug is invalid or hash mismatch, show 404
    notFound();
  }

  const { artist1, artist2 } = decoded;

  // Redirect to the homepage with query params, which pre-populates and renders the comparison
  const target = `/?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`;
  redirect(target);
}


