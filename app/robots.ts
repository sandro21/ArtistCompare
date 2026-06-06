import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://artistcompare.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/og/', '/api/og/'],
      disallow: '/api/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
