'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
}

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * The header at the top of every sub-page — an optional eyebrow, a large
 * Archivo title and a lede, over a faint crimson bloom.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__glow" aria-hidden="true" />

      <div className="container page-header__inner">
        {eyebrow ? (
          <motion.p
            className="eyebrow"
            data-anim=""
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
        ) : null}

        <motion.h1
          className="page-header__title"
          data-anim=""
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
        >
          {title}
        </motion.h1>

        {lede ? (
          <motion.p
            className="lead page-header__lede"
            data-anim=""
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
          >
            {lede}
          </motion.p>
        ) : null}

        {children ? (
          <motion.div
            data-anim=""
            style={{ marginTop: '1.5rem' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </header>
  )
}
