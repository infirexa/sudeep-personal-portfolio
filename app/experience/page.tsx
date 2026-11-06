import type { Metadata } from 'next'
import { Experience } from '@/components/sections/Experience'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'The full career timeline for Sudeep Singh: eight hospitality roles in New Delhi NCR and Lucknow since May 2015.',
  alternates: { canonical: '/experience/' },
}

export default function ExperiencePage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Experience"
        title="Where he has worked"
        lede="Eight roles across hotels, restaurants, bars and banqueting. Three of them are verified by a signed letter from the employer."
      />

      <section className="section">
        <div className="container">
          <Experience />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="next-page">
            <p className="eyebrow">Next</p>
            <h2 className="h3" style={{ marginTop: '0.75rem' }}>
              The paperwork
            </h2>
            <p className="meta" style={{ marginTop: '0.6rem', maxWidth: '44ch' }}>
              The three employer letters behind these roles, scanned from the
              originals.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              <a href="/credentials/" className="btn btn--ghost">
                <span>Open the gallery →</span>
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
