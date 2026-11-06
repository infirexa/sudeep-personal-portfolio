import { Reveal } from '@/components/ui/Reveal'
import { latestExperience } from '@/lib/data'

/**
 * The three most recent roles — a teaser for the full timeline.
 */
export function ExperiencePreview() {
  return (
    <ol className="role-preview">
      {latestExperience.map((entry, index) => (
        <Reveal as="li" key={entry.id} delay={index * 0.07}>
          <article className="role-preview__item">
            <p className="timeline__dates">
              <span>{entry.start}</span>
              <span>to {entry.end}</span>
            </p>
            <h3 className="h3" style={{ marginTop: '0.4rem' }}>
              {entry.title}
            </h3>
            <p className="timeline__org">
              {entry.organisation} · {entry.location}
            </p>
          </article>
        </Reveal>
      ))}
    </ol>
  )
}
