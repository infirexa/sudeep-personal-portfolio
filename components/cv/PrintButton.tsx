'use client'

interface PrintButtonProps {
  label?: string
  className?: string
}

/**
 * Triggers the browser's print dialogue, which every major browser offers
 * "Save as PDF" inside. The CV is rendered from the same data as the site,
 * so the printed output can never drift out of date.
 */
export function PrintButton({
  label = 'Print / Save as PDF',
  className = 'btn btn--primary',
}: PrintButtonProps) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      <span>{label}</span>
    </button>
  )
}
