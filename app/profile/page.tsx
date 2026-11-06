import type { Metadata } from 'next'
import { Profile } from '@/components/sections/Profile'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Profile',
  description:
    'Personal details, career objective, strengths and education for Sudeep Singh, hospitality professional in New Delhi NCR.',
  alternates: { canonical: '/profile/' },
}

export default function ProfilePage() {
  return (
    <main id="main">
      <PageHeader
        eyebrow="Profile"
        title="A career on the floor"
        lede="Eleven years across fine dining, lounges, banqueting and hotel service, from bar tender to service captain."
      />

      <section className="section">
        <div className="container">
          <Profile />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="next-page">
            <p className="eyebrow">Next</p>
            <h2 className="h3" style={{ marginTop: '0.75rem' }}>
              Where he has worked
            </h2>
            <p className="meta" style={{ marginTop: '0.6rem', maxWidth: '44ch' }}>
              Eight roles since May 2015, three of them backed by a signed
              letter from the employer.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              <a href="/experience/" className="btn btn--ghost">
                <span>See the full timeline →</span>
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
