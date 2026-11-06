import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import {
  careerObjective,
  computerSkills,
  education,
  personal,
  personalDetailRows,
  portrait,
  strengths,
} from '@/lib/data'

export function Profile() {
  return (
    <div className="profile">
      <Reveal className="profile__media">
        <figure className="profile__portrait">
          <Image
            src={portrait.duotoneSrc}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            unoptimized
          />
        </figure>

        <p className="meta" style={{ marginTop: '1rem' }}>
          Currently in {personal.currentCity}, India. From {personal.hometown},{' '}
          {personal.address.state}.
        </p>
      </Reveal>

      <Reveal className="profile__bio" delay={0.06}>
        <p className="lead">
          Sudeep Singh is a hospitality professional based in {personal.currentCity},
          with a career that has run from bar service on the floor to captaincy on
          the pass, across fine dining, lounges, banqueting and a five-star hotel.
        </p>

        <blockquote className="profile__quote">
          {careerObjective}
          <cite>Career objective, as stated on the Curriculum Vitae</cite>
        </blockquote>

        <div className="chips">
          {strengths.map((strength) => (
            <span className="chip" key={strength}>
              {strength}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal className="profile__facts" delay={0.12}>
        <div className="datalist">
          {personalDetailRows.map((row) => (
            <div className="datalist__row" key={row.label}>
              <span className="datalist__label">{row.label}</span>
              <span className="datalist__value">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="datalist" style={{ marginTop: '0.75rem' }}>
          {education.map((entry) => (
            <div className="datalist__row" key={entry.id}>
              <span className="datalist__label">{entry.qualification}</span>
              <span className="datalist__value">{entry.board}</span>
            </div>
          ))}
          <div className="datalist__row">
            <span className="datalist__label">Computer skills</span>
            <span className="datalist__value">{computerSkills}</span>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
