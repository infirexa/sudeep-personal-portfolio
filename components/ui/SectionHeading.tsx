import Link from 'next/link'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  action?: { href: string; label: string }
}

/**
 * The numbered section header used throughout the page.
 *
 * A vertical stack: eyebrow, headline, lede. Never a headline on the left
 * with a floating explainer paragraph on the right.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
}: SectionHeadingProps) {
  return (
    <header className="section__head">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

      <h2 className="h2">{title}</h2>

      {lede ? <p className="lead section__lede">{lede}</p> : null}

      {action ? (
        <Link href={action.href} className="link-arrow">
          {action.label}
          <svg
            className="btn__arrow"
            width="13"
            height="13"
            viewBox="0 0 14 14"
            aria-hidden="true"
          >
            <path
              d="M1 7h11M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            />
          </svg>
        </Link>
      ) : null}
    </header>
  )
}
