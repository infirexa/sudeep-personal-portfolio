'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useTypewriter } from '@/lib/hooks'

interface TypewriterProps {
  phrases: string[]
}

/**
 * Cycles through the role titles with a typewriter effect.
 *
 * Under reduced motion it renders the first role as static text. The full
 * list is exposed to screen readers separately — a live region that changes
 * constantly would be far too noisy.
 */
export function Typewriter({ phrases }: TypewriterProps) {
  const reduce = useReducedMotion()
  const { text } = useTypewriter(phrases)

  if (reduce) {
    return (
      <p className="hero__rotator">
        <span>{phrases[0] ?? ''}</span>
      </p>
    )
  }

  return (
    <p className="hero__rotator">
      <span aria-hidden="true">
        {text}
        <motion.span
          className="hero__caret"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </span>
      <span className="sr-only">{phrases.join(' · ')}</span>
      <noscript>{phrases[0]}</noscript>
    </p>
  )
}
