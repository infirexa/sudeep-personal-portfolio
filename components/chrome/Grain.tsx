'use client'

import { usePathname } from 'next/navigation'

/**
 * The paper-grain overlay.
 *
 * It is `position: fixed` and a sibling of the page content in the root
 * layout, so it would otherwise sit on top of the CV sheet — and
 * `.page-transition`'s inline transform creates a stacking context that a
 * z-index on the CV cannot escape. Hence the pathname check.
 */
export function Grain() {
  const pathname = usePathname()

  // The CV is a paper artifact, not a page. It gets no grain.
  if (pathname?.startsWith('/cv')) return null

  return <div className="grain" aria-hidden="true" />
}
