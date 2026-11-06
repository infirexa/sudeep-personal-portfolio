import type { Metadata } from 'next'
import { Credentials } from '@/components/sections/Credentials'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Credentials',
  description:
    'Signed employer letters, the Curriculum Vitae and supporting documents for Sudeep Singh: scans of the originals held on file.',
  alternates: { canonical: '/credentials/' },
}

export default function CredentialsPage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Credentials"
        title="The paperwork"
        lede="Every document here is a scan of the original held on file. The three signed employer letters verify the roles on the timeline; open one to read it in full."
      />

      <section className="section">
        <div className="container">
          <Credentials />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="next-page">
            <p className="eyebrow">Next</p>
            <h2 className="h3" style={{ marginTop: '0.75rem' }}>
              Get in touch
            </h2>
            <p className="meta" style={{ marginTop: '0.6rem', maxWidth: '44ch' }}>
              Call or message directly. Based in New Delhi, from Tehri Garhwal.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              <a href="/contact/" className="btn btn--ghost">
                <span>Contact details →</span>
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
