// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://artist-compare.vercel.app/",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://artist-compare.vercel.app/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const comparePages: MetadataRoute.Sitemap = [
    "https://artist-compare.vercel.app/compare/drake-vs-kendrick-lamar-d15b7c84",
    "https://artist-compare.vercel.app/compare/cardi-b-vs-nicki-minaj-94bb9875",
    "https://artist-compare.vercel.app/compare/lil-durk-vs-youngboy-never-broke-again-acde8c3f",
    "https://artist-compare.vercel.app/compare/kanye-west-vs-drake-53c75e5a",
    "https://artist-compare.vercel.app/compare/young-thug-vs-gunna-55b90ee8",
    "https://artist-compare.vercel.app/compare/young-thug-vs-future-ca9adc91"
  ].map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...comparePages];
}
