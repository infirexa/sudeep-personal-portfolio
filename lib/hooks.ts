'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * One-shot "has this entered the viewport" check.
 *
 * Deliberately a raw IntersectionObserver rather than motion's `useInView`,
 * so the reveal system stays independent of the animation library.
 */
export function useInViewOnce<T extends Element>(
  options: { rootMargin?: string; threshold?: number } = {},
) {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { rootMargin, threshold } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      // Ancient browser with no observer support — reveal on the next frame
      // rather than never.
      const id = window.requestAnimationFrame(() => setIsVisible(true))
      return () => window.cancelAnimationFrame(id)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          io.disconnect()
        }
      },
      {
        rootMargin: rootMargin ?? '0px 0px -12% 0px',
        threshold: threshold ?? 0.15,
      },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, threshold])

  return { ref, isVisible }
}

/**
 * Subscribes to a media query.
 *
 * `useSyncExternalStore` is the right tool here: the match state lives
 * outside React, and this gives us a server snapshot for free so the first
 * client render always matches the server-rendered HTML.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onStoreChange)
      return () => mql.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Locks body scroll while `active`, compensating for the scrollbar width. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [active])
}

type TypewriterPhase = 'typing' | 'holding' | 'erasing'

/**
 * Typewriter state machine used by the hero role rotator.
 */
export function useTypewriter(
  phrases: string[],
  { typeMs = 55, holdMs = 1400, eraseMs = 30 } = {},
) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<TypewriterPhase>('typing')

  const current = phrases.length > 0 ? phrases[index % phrases.length] : ''

  useEffect(() => {
    if (!current) return

    if (phase === 'typing') {
      if (text.length < current.length) {
        const timer = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          typeMs,
        )
        return () => window.clearTimeout(timer)
      }
      const timer = window.setTimeout(() => setPhase('holding'), 0)
      return () => window.clearTimeout(timer)
    }

    if (phase === 'holding') {
      const timer = window.setTimeout(() => setPhase('erasing'), holdMs)
      return () => window.clearTimeout(timer)
    }

    if (text.length > 0) {
      const timer = window.setTimeout(() => setText(text.slice(0, -1)), eraseMs)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(() => {
      setIndex((i) => (phrases.length > 0 ? (i + 1) % phrases.length : 0))
      setPhase('typing')
    }, 0)
    return () => window.clearTimeout(timer)
  }, [text, phase, current, phrases.length, typeMs, holdMs, eraseMs])

  return { text, phase, index }
}
