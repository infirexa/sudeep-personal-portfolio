import { personal, siteConfig, experience } from './data'

/**
 * JSON-LD `Person` schema, generated from the same data the page renders.
 *
 * Deliberately omitted:
 *  - `sameAs` — there is no LinkedIn, Instagram or other public profile in the
 *    source documents, so no URLs are invented here.
 *  - `birthDate` — it appears on the Curriculum Vitae, but keeping a personal
 *    identifier out of machine-extractable data at scale is the safer default.
 *    Add `birthDate: personal.dateOfBirth` below if you want it indexed.
 */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personal.fullName,
    jobTitle: 'Service Captain',
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/img/portrait.webp`,
    telephone: `+91-${personal.mobile}`,
    nationality: personal.nationality,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${personal.address.line1}, ${personal.address.line2}`,
      addressLocality: personal.address.district,
      addressRegion: personal.address.state,
      postalCode: personal.address.postalCode,
      addressCountry: personal.address.country,
    },
    knowsAbout: Array.from(new Set(experience.map((e) => e.title))),
    knowsLanguage: personal.languages,
  }
}
