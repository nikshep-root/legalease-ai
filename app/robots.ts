import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/'],
    },
    sitemap: 'https://legalease-ai-591134707706.us-central1.run.app/sitemap.xml',
  }
}
