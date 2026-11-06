import type { Metadata } from 'next'
import Link from 'next/link'
import { PrintButton } from '@/components/cv/PrintButton'
import {
  careerObjective,
  computerSkills,
  education,
  experience,
  personal,
  strengths,
} from '@/lib/data'

export const metadata: Metadata = {
  title: 'Curriculum Vitae',
  description:
    'Printable curriculum vitae of Sudeep Singh, hospitality professional, New Delhi NCR.',
  alternates: { canonical: '/cv/' },
}

export default function CvPage() {
  return (
    <main className="cv-page" id="main">
      <div className="cv-toolbar no-print">
        <Link href="/" className="btn btn--ghost">
          <span>← Back to portfolio</span>
        </Link>
        <PrintButton />
        <p className="cv-toolbar__note">Optimised for A4 printing</p>
      </div>

      <article className="cv-sheet">
        <header className="cv-head">
          <div>
            <h1 className="cv-head__name">{personal.fullName}</h1>
            <p className="cv-head__role">Service Captain · Hospitality</p>
          </div>
          <div className="cv-head__contact">
            <p>
              <a className="cv-link" href={personal.phoneHref}>
                +91 {personal.mobile}
              </a>
            </p>
            <p>
              {personal.address.line1}, {personal.address.line2}
              <br />
              {personal.address.district}, {personal.address.state}{' '}
              {personal.address.postalCode}
            </p>
            <p>Currently in {personal.currentCity}, India</p>
          </div>
        </header>

        <section className="cv-section">
          <h2 className="cv-section__title">Career objective</h2>
          <p className="cv-text">{careerObjective}</p>
        </section>

        <section className="cv-section">
          <h2 className="cv-section__title">Personal details</h2>
          <div className="cv-rows">
            <div className="cv-row">
              <span className="cv-row__label">Father&apos;s name</span>
              <span className="cv-row__value">{personal.fatherName}</span>
            </div>
            <div className="cv-row">
              <span className="cv-row__label">Date of birth</span>
              <span className="cv-row__value">{personal.dateOfBirth}</span>
            </div>
            <div className="cv-row">
              <span className="cv-row__label">Gender</span>
              <span className="cv-row__value">{personal.gender}</span>
            </div>
            <div className="cv-row">
              <span className="cv-row__label">Nationality</span>
              <span className="cv-row__value">{personal.nationality}</span>
            </div>
            <div className="cv-row">
              <span className="cv-row__label">Marital status</span>
              <span className="cv-row__value">{personal.maritalStatus}</span>
            </div>
            <div className="cv-row">
              <span className="cv-row__label">Religion</span>
              <span className="cv-row__value">{personal.religion}</span>
            </div>
            <div className="cv-row">
              <span className="cv-row__label">Languages known</span>
              <span className="cv-row__value">
                {personal.languages.join(' & ')}
              </span>
            </div>
            <div className="cv-row">
              <span className="cv-row__label">Computer skills</span>
              <span className="cv-row__value">{computerSkills}</span>
            </div>
          </div>
        </section>

        <section className="cv-section">
          <h2 className="cv-section__title">Education</h2>
          <div className="cv-rows">
            {education.map((entry) => (
              <div className="cv-row" key={entry.id}>
                <span className="cv-row__label">{entry.qualification}</span>
                <span className="cv-row__value">{entry.board}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2 className="cv-section__title">Strengths</h2>
          <p className="cv-text">{strengths.join(' · ')}</p>
        </section>

        <section className="cv-section">
          <h2 className="cv-section__title">Working experience</h2>
          <div className="cv-exp">
            {experience.map((entry) => (
              <div className="cv-exp__row" key={entry.id}>
                <span className="cv-exp__dates">
                  {entry.start} to {entry.end}
                </span>
                <div>
                  <p className="cv-exp__role">{entry.title}</p>
                  <p className="cv-exp__org">
                    {entry.organisation} · {entry.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="cv-sign">
          <p className="meta">
            I hereby declare that the above-mentioned details are complete and
            correct to the best of my knowledge.
          </p>
          <div style={{ textAlign: 'right' }}>
            <p className="cv-sign__name">{personal.fullName}</p>
            <p className="meta">Place: {personal.currentCity}</p>
          </div>
        </footer>
      </article>
    </main>
  )
}
