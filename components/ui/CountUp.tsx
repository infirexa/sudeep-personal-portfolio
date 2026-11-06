'use client'

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { useInViewOnce } from '@/lib/hooks'

interface CountUpProps {
  value: number
  suffix?: string
  duration?: number
}

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * The number is written to the DOM through a MotionValue child, so React
 * never re-renders during the animation. A <noscript> fallback carries the
 * final figure for anyone without JavaScript, where the counter would
 * otherwise sit at zero.
 */
export function CountUp({ value, suffix, duration = 1.6 }: CountUpProps) {
  const reduce = useReducedMotion()
  const counter = useMotionValue(0)
  const rounded = useTransform(counter, (v) => Math.round(v).toString())
  const { ref, isVisible } = useInViewOnce<HTMLSpanElement>()

  useEffect(() => {
    if (!isVisible) return
    if (reduce) {
      counter.set(value)
      return
    }
    const controls = animate(counter, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [isVisible, value, duration, reduce, counter])

  return (
    <span ref={ref}>
      <span className="metric__motion">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </span>
      <noscript>{`${value}${suffix ?? ''}`}</noscript>
    </span>
  )
}
