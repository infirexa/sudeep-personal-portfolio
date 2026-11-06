'use client'

import { motion, useScroll, useSpring } from 'motion/react'

/**
 * A 2px crimson bar across the top of the viewport showing scroll progress.
 * Driven by a MotionValue so React never re-renders during the scroll.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.001,
  })

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}
