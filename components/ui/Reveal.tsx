'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useInViewOnce } from '@/lib/hooks'
import { cx } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'header'
}

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. Stagger siblings with `delay={index * 0.07}`.
 *
 * The `data-reveal` attribute is the contract for three fallbacks: the
 * print block, the <noscript> style and the reduced-motion override in
 * globals.css. It is emitted unconditionally, because the server has no
 * way to know the visitor's motion preference — `useReducedMotion()`
 * returns null during SSR, so a JavaScript branch would ship `opacity: 0`
 * to everyone and pop it in later for reduced-motion users.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 0.7,
  className,
  as = 'div',
}: RevealProps) {
  const { ref, isVisible } = useInViewOnce<HTMLElement>()
  const Cmp = motion[as] as typeof motion.div

  return (
    <Cmp
      ref={ref as React.Ref<HTMLDivElement>}
      data-reveal=""
      className={cx(className)}
      initial={{ opacity: 0, y }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Cmp>
  )
}
