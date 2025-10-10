// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://artist-compare.com/",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://artist-compare.com/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

    const comparePages: MetadataRoute.Sitemap = [
    "https://artist-compare.com/compare/drake-vs-kendrick-lamar-d15b7c84",
    "https://artist-compare.com/compare/cardi-b-vs-nicki-minaj-94bb9875",
    "https://artist-compare.com/compare/lil-durk-vs-youngboy-never-broke-again-acde8c3f",
    "https://artist-compare.com/compare/kanye-west-vs-drake-53c75e5a",
    "https://artist-compare.com/compare/taylor-swift-vs-kanye-west-bb9cb9e0",
    "https://artist-compare.com/compare/2pac-vs-the-notorious-big-8b4481f1",
    "https://artist-compare.com/compare/young-thug-vs-gunna-55b90ee8",
    "https://artist-compare.com/compare/young-thug-vs-future-ca9adc91"
  ].map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...comparePages];
}
