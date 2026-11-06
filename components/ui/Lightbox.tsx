'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import type { DocumentAsset } from '@/lib/data'
import { useScrollLock } from '@/lib/hooks'

interface LightboxProps {
  documents: DocumentAsset[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

const EASE = [0.16, 1, 0.3, 1] as const

export function Lightbox({
  documents,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const isOpen = index !== null
  const doc = isOpen ? documents[index] : null

  useScrollLock(isOpen)

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  // Preload the neighbouring documents so paging feels instant.
  useEffect(() => {
    if (index === null) return
    const next = documents[(index + 1) % documents.length]
    if (next) new window.Image().src = next.preview
  }, [index, documents])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (index === null) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onIndexChange((index + 1) % documents.length)
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onIndexChange((index - 1 + documents.length) % documents.length)
        return
      }
      if (event.key !== 'Tab') return

      // Manual focus trap — no dependency needed.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [index, documents.length, onClose, onIndexChange],
  )

  return (
    <AnimatePresence>
      {isOpen && doc && (
        <div className="lightbox">
          <motion.div
            className="lightbox__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            className="lightbox__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            aria-describedby="lightbox-caption"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <button
              ref={closeRef}
              type="button"
              className="icon-btn lightbox__close"
              onClick={onClose}
              aria-label="Close document viewer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </button>

            <figure className="lightbox__figure">
              <Image
                src={doc.preview}
                alt={doc.alt}
                width={doc.width}
                height={doc.height}
                unoptimized
                priority
              />
            </figure>

            <div className="lightbox__info">
              {doc.thirdParty && (
                <span className="badge badge--third-party">Third-party document</span>
              )}

              <h2 id="lightbox-title" className="lightbox__title">
                {doc.title}
              </h2>

              <p id="lightbox-caption" className="lightbox__caption">
                {doc.caption}
              </p>

              {doc.issuedTo && (
                <p className="lightbox__caption">
                  <strong>Issued to:</strong> {doc.issuedTo}
                </p>
              )}

              {(doc.validFrom || doc.validTo) && (
                <p className="lightbox__caption">
                  <strong>Valid:</strong> {doc.validFrom} to {doc.validTo}
                  {doc.fee ? ` · Fee ${doc.fee}` : ''}
                </p>
              )}

              {doc.disclaimer && (
                <p className="lightbox__disclaimer">{doc.disclaimer}</p>
              )}

              <div className="lightbox__controls">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() =>
                    onIndexChange((index - 1 + documents.length) % documents.length)
                  }
                  aria-label="Previous document"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M9 1L3 7l6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onIndexChange((index + 1) % documents.length)}
                  aria-label="Next document"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M5 1l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                    />
                  </svg>
                </button>
                <p className="lightbox__counter" aria-live="polite">
                  {index + 1} / {documents.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
