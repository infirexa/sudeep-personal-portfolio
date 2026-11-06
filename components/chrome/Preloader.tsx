'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sudeep:intro-seen'
const HARD_TIMEOUT = 2400
const REVEAL_AFTER = 1200

/**
 * A crimson curtain that lifts to reveal the hero.
 *
 * Skipped on repeat visits within the session, and guarded by a hard timeout
 * so a slow font or a stalled image can never trap the visitor behind it.
 */
export function Preloader() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'entering' | 'done'>('idle')
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduce) return

    let seen = false
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      // Safari in private mode throws on sessionStorage access.
      seen = false
    }

    if (seen) return

    const start = Date.now()

    const enter = window.setTimeout(() => setPhase('entering'), 0)

    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(100, Math.round((elapsed / REVEAL_AFTER) * 100))
      setCount(progress)

      if (progress >= 100) {
        window.clearInterval(tick)
        window.clearTimeout(finish)
        try {
          sessionStorage.setItem(STORAGE_KEY, '1')
        } catch {
          // Ignore — the curtain still lifts.
        }
        setPhase('done')
      }
    }, 32)

    // Safety net: even if the counter never completes, the curtain lifts.
    const finish = window.setTimeout(() => {
      window.clearInterval(tick)
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // Ignore.
      }
      setPhase('done')
    }, HARD_TIMEOUT)

    return () => {
      window.clearTimeout(enter)
      window.clearInterval(tick)
      window.clearTimeout(finish)
    }
  }, [reduce])

  if (reduce || phase === 'done') return null

  return (
    <AnimatePresence>
      {phase === 'entering' && (
        <div className="preloader" aria-hidden="true">
          <motion.div
            className="preloader__half"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
          >
            <div className="preloader__mark">
              <span>SS</span>
              <span className="preloader__count">{count}%</span>
            </div>
          </motion.div>
          <motion.div
            className="preloader__half"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.83, 0, 0.17, 1] }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}
