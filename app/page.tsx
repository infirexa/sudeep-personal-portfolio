import { DocumentsPreview } from '@/components/sections/DocumentsPreview'
import { ExperiencePreview } from '@/components/sections/ExperiencePreview'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Stats } from '@/components/sections/Stats'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { personJsonLd } from '@/lib/seo'
import { personal, strengths } from '@/lib/data'

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      <main id="main">
        <Hero />
        <Marquee />

        <section id="at-a-glance" className="section">
          <div className="container">
            <div className="bento">
              <div className="bento__metrics">
                <Stats />
              </div>

              <div className="bento__roles">
                <SectionHeading
                  title="Where he has worked"
                  lede="Eight roles since May 2015 across hotels, restaurants, bars and banqueting."
                  action={{ href: '/experience', label: 'See the full timeline' }}
                />
                <ExperiencePreview />
              </div>

              <div className="bento__docs">
                <SectionHeading
                  title="The paperwork"
                  lede="Three employers wrote and signed a letter for these roles. Every document on the site is a scan of the original."
                  action={{ href: '/credentials', label: 'Open the gallery' }}
                />
                <DocumentsPreview />
              </div>
            </div>
          </div>
        </section>

        <section id="profile-summary" className="section section--alt">
          <div className="container">
            <div className="glance">
              <Reveal className="glance__copy">
                <p className="lead">
                  Sudeep Singh is a hospitality professional based in{' '}
                  {personal.currentCity}, with a career that has run from the
                  bar to the pass.
                </p>
                <div className="chips">
                  {strengths.map((strength) => (
                    <span className="chip" key={strength}>
                      {strength}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.08} className="glance__side">
                <dl className="mini-facts">
                  <div>
                    <dt>Currently</dt>
                    <dd>Service Captain, Noida Kora House</dd>
                  </div>
                  <div>
                    <dt>Experience</dt>
                    <dd>Eight roles since May 2015</dd>
                  </div>
                  <div>
                    <dt>Verified by</dt>
                    <dd>Three signed employer letters</dd>
                  </div>
                  <div>
                    <dt>Languages</dt>
                    <dd>{personal.languages.join(' & ')}</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="get-in-touch" className="section contact on-crimson">
          <div className="container">
            <div className="contact-cta">
              <div>
                <p className="eyebrow">Contact</p>
                <h2 className="h2">Get in touch</h2>
                <p className="lead">
                  Open to roles as Service Captain, Bar Steward or Assistant
                  Captain in New Delhi NCR.
                </p>
              </div>

              <div className="contact-cta__actions">
                <MagneticButton href="/contact/" variant="light">
                  Contact details
                  <svg
                    className="btn__arrow"
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 7h11M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                    />
                  </svg>
                </MagneticButton>

                <MagneticButton href="/cv/" variant="light">
                  Download CV
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
