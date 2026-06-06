import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://artist-compare.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og/'],
      disallow: '/api/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
