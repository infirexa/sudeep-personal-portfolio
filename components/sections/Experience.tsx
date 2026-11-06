'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { experience, experienceSourceNote } from '@/lib/data'

/**
 * The career timeline.
 *
 * The crimson rail is drawn as the section scrolls past — `scaleY` is a
 * compositor-only transform, so nothing re-lays-out per frame.
 */
export function Experience() {
  const reduce = useReducedMotion()
  const railRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 65%', 'end 65%'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
    skipInitialAnimation: true,
  })

  return (
    <>
      <div className="timeline" ref={railRef}>
        <div className="timeline__rail" aria-hidden="true" />
        <motion.div
          className="timeline__progress"
          aria-hidden="true"
          style={{ scaleY: reduce ? 1 : progress }}
        />

        {experience.map((entry, index) => (
        <Reveal
          className={`timeline__entry${entry.current ? ' timeline__entry--current' : ''}`}
          key={entry.id}
          delay={index * 0.05}
        >
          <p className="timeline__dates">
            <span>{entry.start}</span>
            <span>to {entry.end}</span>
          </p>

          <div className="timeline__body">
            <h3 className="h3" style={{ marginTop: '0.4rem' }}>
              {entry.title}
            </h3>

            <p className="timeline__org">
              {entry.organisation} · {entry.location}
            </p>

            {entry.verified ? (
              <p style={{ marginTop: '0.75rem' }}>
                <span className="badge badge--verified">
                  Employer letter on file
                </span>
              </p>
            ) : null}

            {entry.highlight ? (
              <blockquote className="timeline__highlight">
                “{entry.highlight}”
                <cite>{entry.organisation}</cite>
              </blockquote>
            ) : null}
          </div>
        </Reveal>
        ))}
      </div>

      <p className="meta timeline__note">{experienceSourceNote}</p>
    </>
  )
}
