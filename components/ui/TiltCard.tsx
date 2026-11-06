'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import type { ReactNode } from 'react'
import { clamp } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** maximum rotation in degrees */
  max?: number
}

/**
 * A card that tilts toward the pointer with a crimson glare sweeping across
 * it. Disabled on coarse pointers and under reduced motion.
 */
export function TiltCard({ children, className, max = 10 }: TiltCardProps) {
  const reduce = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 })

  const glare = useMotionTemplate`radial-gradient(20rem circle at ${glareX}% ${glareY}%, rgba(165, 15, 40, 0.12), rgba(165, 15, 40, 0) 62%)`

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const relX = (event.clientX - rect.left) / rect.width
    const relY = (event.clientY - rect.top) / rect.height

    rotateX.set(clamp((0.5 - relY) * max * 2, -max, max))
    rotateY.set(clamp((relX - 0.5) * max * 2, -max, max))
    glareX.set(relX * 100)
    glareY.set(relY * 100)
  }

  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 1000,
      }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="tilt-card__glare"
        style={{ background: glare }}
      />
    </motion.div>
  )
}
