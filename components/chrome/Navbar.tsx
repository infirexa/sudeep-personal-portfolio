'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/navigation'

export function Navbar() {
  const reduce = useReducedMotion()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  // The overlay records the route it was opened on. When the route changes —
  // by link, by back button or otherwise — the two no longer match and the
  // overlay closes, with no state synchronisation needed.
  const [menuRoute, setMenuRoute] = useState<string | null>(null)
  const open = menuRoute === pathname

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the overlay when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuRoute(null)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuRoute(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
        <div className="container site-header__inner">
          <Link href="/" className="wordmark" aria-label="Sudeep Singh, home">
            Sudeep Singh
            <span className="wordmark__dot" aria-hidden="true" />
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav__link"
                aria-current={isCurrent(link.href) ? 'page' : undefined}
                data-current={isCurrent(link.href) ? 'true' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className={`nav-toggle${open ? ' nav-toggle--open' : ''}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setMenuRoute(open ? null : pathname)}
          >
            <span className="nav-toggle__bars" aria-hidden="true">
              <span />
              <span />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="nav-overlay"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: reduce ? 0 : 0.06 * index,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={link.href}
                  className="nav-overlay__link"
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                  onClick={() => setMenuRoute(null)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <Link
              href="/cv/"
              className="btn btn--ghost"
              onClick={() => setMenuRoute(null)}
            >
              <span>Download CV</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
