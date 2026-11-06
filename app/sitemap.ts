import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/profile/`, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: `${siteConfig.url}/experience/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/credentials/`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${siteConfig.url}/contact/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteConfig.url}/cv/`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  return routes
}
