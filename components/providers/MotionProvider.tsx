'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * `reducedMotion="user"` makes motion disable transform and layout animations
 * while keeping opacity and colour — the correct behaviour for
 * `prefers-reduced-motion`. Components that change their *structure* (the
 * preloader, the typewriter, the marquee) also branch on `useReducedMotion()`
 * themselves.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.4 }}>
      {children}
    </MotionConfig>
  )
}
