'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Remounts on every navigation, so each page gets its own entrance.
 * The App Router's `template.tsx` is the idiomatic way to do this — no
 * AnimatePresence wiring and no exit animations to coordinate.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="page-transition"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
