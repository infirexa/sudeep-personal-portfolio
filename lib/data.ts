/**
 * The single source of truth for everything on this site.
 *
 * Every fact below is transcribed from the source documents in the project
 * root — two Curriculum Vitae pages, three signed employer letters and one
 * Form B1 bar licence. Nothing here is inferred, embellished or invented:
 * no email address, no social profiles, no metrics that the documents do
 * not support.
 */

import { assets } from './generated-assets'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Address {
  line1: string
  line2: string
  district: string
  state: string
  postalCode: string
  country: string
}

export interface PersonalDetails {
  fullName: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  maritalStatus: string
  religion: string
  languages: string[]
  fatherName: string
  address: Address
  mobile: string
  phoneHref: string
  whatsappHref: string
  hometown: string
  currentCity: string
}

export interface ExperienceEntry {
  id: string
  title: string
  organisation: string
  location: string
  start: string
  end: string
  current: boolean
  /** true ⇔ a signed employer letter is on file and shown in the gallery */
  verified: boolean
  /** key into `documents` */
  documentId?: string
  /** quoted verbatim from the employer's letter */
  highlight?: string
}

export type DocumentKind = 'employer-letter' | 'cv-page' | 'third-party-licence'

export interface DocumentAsset {
  id: string
  title: string
  issuer: string
  kind: DocumentKind
  /** third-party documents are never presented as Sudeep's own credential */
  thirdParty: boolean
  /**
   * Featured documents lead the Credentials gallery — the signed employer
   * letters that verify the career claims. The Curriculum Vitae pages are
   * redundant with the downloadable CV, and the bar licence belongs to a
   * third party, so they sit in the secondary group below the main gallery.
   */
  featured: boolean
  issuedTo?: string
  validFrom?: string
  validTo?: string
  fee?: string
  thumbnail: string
  preview: string
  width: number
  height: number
  thumbWidth: number
  thumbHeight: number
  alt: string
  caption: string
  disclaimer?: string
}

export interface EducationEntry {
  id: string
  qualification: string
  board: string
}

export interface Stat {
  id: string
  label: string
  value: number
  suffix?: string
  caption: string
}

export interface SiteConfig {
  name: string
  url: string
  description: string
  locale: string
  themeColor: string
}

/* ------------------------------------------------------------------ */
/*  Site                                                               */
/* ------------------------------------------------------------------ */

export const siteConfig: SiteConfig = {
  name: 'Sudeep Singh',
  // Under a static export this value is baked in at build time. Set
  // NEXT_PUBLIC_SITE_URL before deploying — see the README.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  description:
    'Sudeep Singh, hospitality professional in New Delhi NCR. Service Captain and Bar Steward with experience at Radisson Blu Hotel, The Forte Grand and Gourmet Gallery.',
  locale: 'en_IN',
  themeColor: '#F4F3F1',
}

/* ------------------------------------------------------------------ */
/*  Person                                                             */
/* ------------------------------------------------------------------ */

export const personal: PersonalDetails = {
  fullName: 'Sudeep Singh',
  firstName: 'Sudeep',
  lastName: 'Singh',
  dateOfBirth: '10/07/1999',
  gender: 'Male',
  nationality: 'Indian',
  maritalStatus: 'Unmarried',
  religion: 'Hindu',
  languages: ['Hindi', 'English'],
  fatherName: 'Sh. Rajaram Singh',
  address: {
    line1: 'Vill-Bagi',
    line2: 'Po-Raund Ramoli',
    district: 'Tehri Garhwal',
    state: 'Uttarakhand',
    postalCode: '249165',
    country: 'India',
  },
  mobile: '9760337193',
  phoneHref: 'tel:+919760337193',
  whatsappHref: 'https://wa.me/919760337193',
  hometown: 'Tehri Garhwal',
  currentCity: 'New Delhi',
}

/** Quoted verbatim from the Curriculum Vitae. */
export const careerObjective =
  'To Pursue a highly challenging and creative career in a dynamic, growth oriented organization where performance is rewarded, and I can apply my existing knowledge and creativity, acquire new skills and serve my best to the organization.'

export const strengths: string[] = [
  'Honest & Hardworking',
  'Positive Attitude',
  'Responsible',
]

export const computerSkills = 'Basic knowledge of computer'

export const education: EducationEntry[] = [
  { id: 'secondary', qualification: '10th Passed', board: 'U.K Board' },
  { id: 'senior-secondary', qualification: '12th Passed', board: 'U.K Board' },
]

/* ------------------------------------------------------------------ */
/*  Experience — the union of both Curriculum Vitae pages              */
/* ------------------------------------------------------------------ */

export const experience: ExperienceEntry[] = [
  {
    id: 'noida-kora-house',
    title: 'Service Captain',
    organisation: 'Noida Kora House (Bluchi Company)',
    location: 'UPSC Pandara Road, New Delhi',
    start: 'Oct 2020',
    end: 'Till Date',
    current: true,
    verified: false,
  },
  {
    id: 'radisson-blu',
    title: 'Asst Captain',
    organisation: 'Radisson Blu Hotel',
    location: 'Greater Noida',
    start: '20.02.2019',
    end: '20.03.2020',
    current: false,
    verified: true,
    documentId: 'radisson-blu',
    highlight:
      'We wish him all the very best in his future endeavours.',
  },
  {
    id: 'jvh-enterprise',
    title: 'Asst Manager',
    organisation: 'JVH Enterprise (Jingalal Sweets & Restaurant)',
    location: 'Sitapur, Lucknow, U.P.',
    start: 'Jan 2019',
    end: 'April 2019',
    current: false,
    verified: false,
  },
  {
    id: 'sol-food',
    title: 'Captain',
    organisation: 'Sol Food, Silver OKE',
    location: 'Ghitroni',
    start: 'April 2018',
    end: 'Dec 2018',
    current: false,
    verified: false,
  },
  {
    id: 'parle-bar',
    title: 'Bar Tender',
    organisation: 'Parle Bar',
    location: 'Uttam Nagar Janak Cinema, New Delhi',
    start: 'Oct 2017',
    end: 'March 2018',
    current: false,
    verified: false,
  },
  {
    id: 'forte-grand',
    title: 'Bar Steward',
    organisation: 'The Forte Grand Restaurant & Bar',
    location: 'Chunky Puri, New Delhi',
    start: '10.01.2017',
    end: '15.01.2019',
    current: false,
    verified: true,
    documentId: 'forte-grand',
    highlight:
      'During this working tenure we found him honest, sincere, hardworking, intelligent & always punctual at his time.',
  },
  {
    id: 'odc-joshi-group',
    title: 'Service & Captain',
    organisation: 'ODC Joshi Group',
    location: 'Green Park, New Delhi',
    start: 'Jan 2017',
    end: 'Sep 2017',
    current: false,
    verified: false,
  },
  {
    id: 'gourmet-gallery',
    title: 'Bar Tender & Bar Service',
    organisation: 'Gourmet Gallery Fine Dining & Resto Bar',
    location: 'South Ex Part-II, New Delhi',
    start: '15.05.2015',
    end: '16.12.2016',
    current: false,
    verified: true,
    documentId: 'gourmet-gallery',
    highlight:
      'During the above period, he was found to be sincere, honest and hard-working. He left job on his own accord for better prospects.',
  },
]

/** A note about the provenance of the timeline, shown under it. */
export const experienceSourceNote =
  'Compiled from two versions of the Curriculum Vitae; some tenures overlap as recorded in the source documents.'

/* ------------------------------------------------------------------ */
/*  Documents                                                          */
/* ------------------------------------------------------------------ */

const a = assets

export const documents: DocumentAsset[] = [
  {
    id: 'radisson-blu',
    title: 'Experience letter: Radisson Blu Hotel',
    issuer: 'Radisson Blu Hotel, Greater Noida',
    kind: 'employer-letter',
    thirdParty: false,
    featured: true,
    thumbnail: a['radisson-blu'].thumbnail,
    preview: a['radisson-blu'].preview,
    width: a['radisson-blu'].width,
    height: a['radisson-blu'].height,
    thumbWidth: a['radisson-blu'].thumbWidth,
    thumbHeight: a['radisson-blu'].thumbHeight,
    alt: 'Signed experience letter from Radisson Blu Hotel, Greater Noida, recording Sudeep Singh as Asst Captain from 20 February 2019 to 20 March 2020, signed by Mahender Singh, HR Manager.',
    caption:
      'Radisson Blu Hotel, Greater Noida. Asst Captain, 20.02.2019 to 20.03.2020.',
  },
  {
    id: 'forte-grand',
    title: 'Experience letter: The Forte Grand',
    issuer: 'The Forte Grand Restaurant & Bar, Chunky Puri, New Delhi',
    kind: 'employer-letter',
    thirdParty: false,
    featured: true,
    thumbnail: a['forte-grand'].thumbnail,
    preview: a['forte-grand'].preview,
    width: a['forte-grand'].width,
    height: a['forte-grand'].height,
    thumbWidth: a['forte-grand'].thumbWidth,
    thumbHeight: a['forte-grand'].thumbHeight,
    alt: 'Signed experience letter from The Forte Grand Restaurant & Bar, Chunky Puri, New Delhi, recording Sudeep Singh as Bar Steward from 10 January 2017 to 15 January 2019, signed by Parveen Mehta, General Manager.',
    caption:
      'The Forte Grand Restaurant & Bar, Chunky Puri. Bar Steward, 10.01.2017 to 15.01.2019.',
  },
  {
    id: 'gourmet-gallery',
    title: 'Experience letter: Gourmet Gallery',
    issuer: 'Gourmet Gallery Fine Dining & Resto Bar, South Ex Part-II, New Delhi',
    kind: 'employer-letter',
    thirdParty: false,
    featured: true,
    thumbnail: a['gourmet-gallery'].thumbnail,
    preview: a['gourmet-gallery'].preview,
    width: a['gourmet-gallery'].width,
    height: a['gourmet-gallery'].height,
    thumbWidth: a['gourmet-gallery'].thumbWidth,
    thumbHeight: a['gourmet-gallery'].thumbHeight,
    alt: 'Signed experience letter from Gourmet Gallery Fine Dining & Resto Bar, South Ex Part-II, New Delhi, recording Sudeep Singh as Bar Tender and Bar Service from 15 May 2015 to 16 December 2016.',
    caption:
      'Gourmet Gallery Fine Dining & Resto Bar, South Ex Part-II. Bar Tender & Bar Service, 15.05.2015 to 16.12.2016.',
  },
  {
    id: 'cv-page-1',
    title: 'Curriculum Vitae, page 1',
    issuer: 'Curriculum Vitae of Sudeep Singh',
    kind: 'cv-page',
    thirdParty: false,
    featured: false,
    thumbnail: a['cv-page-1'].thumbnail,
    preview: a['cv-page-1'].preview,
    width: a['cv-page-1'].width,
    height: a['cv-page-1'].height,
    thumbWidth: a['cv-page-1'].thumbWidth,
    thumbHeight: a['cv-page-1'].thumbHeight,
    alt: 'First page of Sudeep Singh’s curriculum vitae, listing his personal details, career objective, strengths, education and four positions.',
    caption: 'Curriculum Vitae, page 1 of 2.',
  },
  {
    id: 'cv-page-2',
    title: 'Curriculum Vitae, page 2',
    issuer: 'Curriculum Vitae of Sudeep Singh',
    kind: 'cv-page',
    thirdParty: false,
    featured: false,
    thumbnail: a['cv-page-2'].thumbnail,
    preview: a['cv-page-2'].preview,
    width: a['cv-page-2'].width,
    height: a['cv-page-2'].height,
    thumbWidth: a['cv-page-2'].thumbWidth,
    thumbHeight: a['cv-page-2'].thumbHeight,
    alt: 'Second page of Sudeep Singh’s curriculum vitae, listing computer skills, education and four positions.',
    caption: 'Curriculum Vitae, page 2 of 2.',
  },
  {
    id: 'form-b1',
    title: 'Form B1, bar licence',
    issuer: 'Office of the Deputy Commissioner, District of South Andaman',
    kind: 'third-party-licence',
    thirdParty: true,
    featured: false,
    issuedTo: 'M/S Wild Orchid Resort, Havelock',
    validFrom: '08.06.2018',
    validTo: '31.03.2019',
    fee: 'Rs 50,000',
    thumbnail: a['form-b1'].thumbnail,
    preview: a['form-b1'].preview,
    width: a['form-b1'].width,
    height: a['form-b1'].height,
    thumbWidth: a['form-b1'].thumbWidth,
    thumbHeight: a['form-b1'].thumbHeight,
    alt: 'Form B1 bar licence issued by the Office of the Deputy Commissioner, District of South Andaman, to M/S Wild Orchid Resort, Havelock, valid from 8 June 2018 to 31 March 2019, with a stated licence fee of Rs 50,000.',
    caption:
      'Form B1 bar licence, issued by the Office of the Deputy Commissioner, District of South Andaman to M/S Wild Orchid Resort, Havelock. Valid 08.06.2018 to 31.03.2019, licence fee Rs 50,000.',
    disclaimer:
      'Third-party regulatory document. It is not a personal credential of Sudeep Singh and is shown for reference only.',
  },
]

/* ------------------------------------------------------------------ */
/*  Derived values                                                     */
/* ------------------------------------------------------------------ */

/** Roles, in the order they appear on the timeline — used by the hero rotator. */
export const roleRotator: string[] = Array.from(
  new Set(experience.map((entry) => entry.title)),
)

/** The signed employer letters — the documents that lead the gallery. */
export const featuredDocuments: DocumentAsset[] = documents.filter(
  (doc) => doc.featured,
)

/** Everything else on file, grouped below the main gallery. */
export const otherDocuments: DocumentAsset[] = documents.filter(
  (doc) => !doc.featured,
)

/** The three most recent roles — previewed on the home page. */
export const latestExperience: ExperienceEntry[] = experience.slice(0, 3)

/** Every number below is countable from the documents above. */
export const stats: Stat[] = [
  {
    id: 'years',
    label: 'Years in hospitality',
    value: 11,
    suffix: '+',
    caption: 'From Gourmet Gallery in May 2015 to the present.',
  },
  {
    id: 'roles',
    label: 'Roles held',
    value: experience.length,
    caption: 'Across hotels, restaurants, bars and banqueting.',
  },
  {
    id: 'letters',
    label: 'Employer letters',
    value: documents.filter((d) => d.kind === 'employer-letter').length,
    caption: 'Signed letters on file: Radisson Blu, The Forte Grand, Gourmet Gallery.',
  },
  {
    id: 'documents',
    label: 'Documents archived',
    value: documents.length,
    caption: 'Three employer letters, two CV pages and one third-party licence.',
  },
]

export const personalDetailRows: Array<{ label: string; value: string }> = [
  { label: "Father's name", value: personal.fatherName },
  { label: 'Date of birth', value: personal.dateOfBirth },
  { label: 'Gender', value: personal.gender },
  { label: 'Nationality', value: personal.nationality },
  { label: 'Marital status', value: personal.maritalStatus },
  { label: 'Religion', value: personal.religion },
  { label: 'Languages known', value: personal.languages.join(' & ') },
]

export const portrait = {
  src: a.portrait.preview,
  duotoneSrc: a.portrait.duotone,
  duotoneDarkSrc: a.portrait.duotoneDark,
  thumbnail: a.portrait.thumbnail,
  width: a.portrait.width,
  height: a.portrait.height,
  alt: 'Portrait of Sudeep Singh in a dark suit and tie, seated.',
}
