import type { Metadata } from 'next'
import { Contact } from '@/components/sections/Contact'
import { PageHeader } from '@/components/ui/PageHeader'
import { personal } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Sudeep Singh, hospitality professional in New Delhi NCR. Call or message directly on WhatsApp.',
  alternates: { canonical: '/contact/' },
}

export default function ContactPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        lede="Open to roles as Service Captain, Bar Steward or Assistant Captain in New Delhi NCR."
      />

      <section className="section contact on-crimson">
        <div className="container">
          <Contact />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="next-page">
            <p className="eyebrow">Also</p>
            <h2 className="h3" style={{ marginTop: '0.75rem' }}>
              A printable CV
            </h2>
            <p className="meta" style={{ marginTop: '0.6rem', maxWidth: '44ch' }}>
              The same details as this site, laid out for A4. It is generated from
              the same data, so it never falls out of date.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              <a href="/cv/" className="btn btn--ghost">
                <span>Open the CV →</span>
              </a>
            </p>
            <p className="meta" style={{ marginTop: '2rem' }}>
              Currently in {personal.currentCity}, India · from{' '}
              {personal.hometown}, {personal.address.state}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
