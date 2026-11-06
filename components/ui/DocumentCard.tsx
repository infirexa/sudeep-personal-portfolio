'use client'

import Image from 'next/image'
import type { DocumentAsset } from '@/lib/data'

const KIND_LABEL: Record<string, string> = {
  'employer-letter': 'Experience letter',
  'cv-page': 'Curriculum Vitae',
  'third-party-licence': 'Third-party licence',
}

interface DocumentCardProps {
  doc: DocumentAsset
  onOpen: (doc: DocumentAsset, event: React.MouseEvent) => void
}

/**
 * A single scanned document, framed like a sheet of paper on a desk.
 */
export function DocumentCard({ doc, onOpen }: DocumentCardProps) {
  return (
    <button
      type="button"
      className="doc-card"
      onClick={(event) => onOpen(doc, event)}
      aria-label={`Open ${doc.title}`}
    >
      <span className="doc-card__thumb">
        <Image
          src={doc.thumbnail}
          alt={doc.alt}
          width={doc.thumbWidth}
          height={doc.thumbHeight}
          unoptimized
        />
      </span>

      <span className="doc-card__meta">
        <span className="doc-card__kind">{KIND_LABEL[doc.kind]}</span>
        <span className="doc-card__title">{doc.title}</span>
        <span className="doc-card__issuer">{doc.issuer}</span>
        {doc.thirdParty ? (
          <span className="badge badge--third-party doc-card__badge">
            Third-party document
          </span>
        ) : null}
      </span>
    </button>
  )
}
