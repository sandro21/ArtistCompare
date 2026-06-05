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
    "https://artist-compare.com/compare/drake-vs-jay-z-a4e6e20e",
    "https://artist-compare.com/compare/drake-vs-kendrick-lamar-d15b7c84",
    "https://artist-compare.com/compare/olivia-rodrigo-vs-sabrina-carpenter-d3ab9b93",
    "https://artist-compare.com/compare/cardi-b-vs-latto-75b720fe",
    "https://artist-compare.com/compare/taylor-swift-vs-bad-bunny-385fdc95",
    "https://artist-compare.com/compare/kanye-west-vs-drake-53c75e5a",
    "https://artist-compare.com/compare/cardi-b-vs-nicki-minaj-94bb9875",
  ].map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...comparePages];
}
