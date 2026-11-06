import type { Metadata, Viewport } from 'next'
import './globals.css'
import { archivo, manrope } from './fonts'
import { siteConfig, personal } from '@/lib/data'
import { MotionProvider } from '@/components/providers/MotionProvider'
import { Footer } from '@/components/chrome/Footer'
import { Preloader } from '@/components/chrome/Preloader'
import { Navbar } from '@/components/chrome/Navbar'
import { ScrollProgress } from '@/components/chrome/ScrollProgress'
import { Grain } from '@/components/chrome/Grain'

export const metadata: Metadata = {
  // Required: OpenGraph and canonical URLs below are relative paths, and
  // under a static export this value is baked in at build time.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Sudeep Singh: Hospitality Professional, New Delhi NCR',
    template: '%s | Sudeep Singh',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: personal.fullName }],
  creator: personal.fullName,
  keywords: [
    'Sudeep Singh',
    'Service Captain',
    'Bar Steward',
    'Bar Tender',
    'Asst Captain',
    'hospitality',
    'restaurant',
    'New Delhi',
    'Greater Noida',
    'Radisson Blu',
    'fine dining',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'Sudeep Singh: Hospitality Professional',
    description: siteConfig.description,
    images: [
      {
        url: '/img/og.png',
        width: 1200,
        height: 630,
        alt: 'Sudeep Singh, Service Captain, New Delhi NCR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sudeep Singh: Hospitality Professional',
    description: siteConfig.description,
    images: ['/img/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: siteConfig.themeColor,
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <MotionProvider>
          <Preloader />
          <ScrollProgress />
          <Grain />
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>

        <noscript>
          <style>{`[data-reveal],.page-transition,[data-anim],[data-anim] *{opacity:1 !important;transform:none !important}.metric__motion{display:none !important}.hero__caret{display:none !important}`}</style>
        </noscript>
      </body>
    </html>
  )
}
