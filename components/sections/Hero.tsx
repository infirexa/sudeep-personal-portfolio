'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { Fragment, useRef } from 'react'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Typewriter } from '@/components/ui/Typewriter'
import { personal, portrait, roleRotator } from '@/lib/data'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // MotionValues bound to `style` — React never re-renders during scroll.
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 60])

  const words = personal.fullName.split(' ')

  return (
    <section id="top" ref={heroRef} className="hero">
      <div className="hero__glow" aria-hidden="true">
        <motion.div
          className="hero__glow-motion"
          style={{ opacity: glowOpacity, y: glowY }}
        />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <motion.p
            className="eyebrow"
            data-anim=""
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          >
            Hospitality · {personal.currentCity}, India
          </motion.p>

          <h1 className="display hero__name">
            {words.map((word, index) => (
              <Fragment key={word}>
                <span className="mask" data-anim="">
                  <motion.span
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: reduce ? 0 : 0.14 + index * 0.06,
                      ease: EASE,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
                {/* The space lives outside the clipping mask — inside it, the
                    trailing space is clipped and the words run together. */}
                {index < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>

          <Typewriter phrases={roleRotator} />

          <motion.p
            className="lead hero__positioning"
            data-anim=""
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          >
            Eleven years on the floor across fine dining, lounges, banqueting and
            a five-star hotel. Three of those roles are backed by letters signed
            by the employer.
          </motion.p>

          <motion.div
            className="hero__cta"
            data-anim=""
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease: EASE }}
          >
            <MagneticButton href="/cv/">
              Download CV
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

            <MagneticButton
              href={personal.whatsappHref}
              external
              variant="ghost"
            >
              WhatsApp
            </MagneticButton>

            <MagneticButton href={personal.phoneHref} variant="ghost">
              Call {personal.mobile}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          className="hero__media"
          data-anim=""
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
        >
          <motion.figure
            className="hero__portrait"
            style={{ y: portraitY }}
          >
            <span className="hero__portrait-frame" aria-hidden="true" />
            <Image
              src={portrait.duotoneSrc}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              unoptimized
              preload
            />
          </motion.figure>

          <div className="hero__card">
            <p className="hero__card-label">Currently</p>
            <p className="hero__card-value">
              Service Captain, Noida Kora House, New Delhi
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
