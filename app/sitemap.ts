import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://artist-compare.vercel.app' // Update with your actual domain
  
  // Popular artist comparisons for SEO
  const popularComparisons = [
    'drake-vs-kanye-west',
    'taylor-swift-vs-ariana-grande',
    'the-weeknd-vs-bruno-mars',
    'billie-eilish-vs-olivia-rodrigo',
    'post-malone-vs-travis-scott',
    'ed-sheeran-vs-john-mayer',
    'beyonce-vs-rihanna',
    'justin-bieber-vs-shawn-mendes',
    'drake-vs-travis-scott',
    'taylor-swift-vs-billie-eilish'
  ];
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];
  
  const comparisonPages = popularComparisons.map(comparison => ({
    url: `${baseUrl}/compare/${comparison}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  return [...staticPages, ...comparisonPages];
}
