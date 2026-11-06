'use client'

import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { ReactNode } from 'react'
import { clamp } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  external?: boolean
  variant?: 'primary' | 'ghost' | 'light'
  className?: string
  ariaLabel?: string
}

/**
 * A button that leans toward the cursor.
 *
 * The offset is applied to an inner span rather than the anchor itself, so
 * the hit area never moves — otherwise the pointer can escape the element
 * mid-hover and the button jitters.
 */
export function MagneticButton({
  children,
  href,
  external = false,
  variant = 'primary',
  className,
  ariaLabel,
}: MagneticButtonProps) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 20 })
  const springY = useSpring(y, { stiffness: 260, damping: 20 })

  const enabled = !reduce

  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.28
    const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.28
    x.set(clamp(offsetX, -10, 10))
    y.set(clamp(offsetY, -10, 10))
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const inner = (
    <motion.span style={{ x: springX, y: springY }}>{children}</motion.span>
  )

  const classes = [
    'btn',
    variant === 'primary' && 'btn--primary',
    variant === 'ghost' && 'btn--ghost',
    variant === 'light' && 'btn--light',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          aria-label={ariaLabel}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
        >
          {inner}
        </a>
      )
    }

    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {inner}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      aria-label={ariaLabel}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {inner}
    </button>
  )
}
