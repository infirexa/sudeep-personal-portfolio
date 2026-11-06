'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { DocumentCard } from '@/components/ui/DocumentCard'
import { Lightbox } from '@/components/ui/Lightbox'
import { Reveal } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'
import {
  documents,
  featuredDocuments,
  otherDocuments,
  type DocumentAsset,
} from '@/lib/data'

/**
 * The Credentials gallery.
 *
 * The three signed employer letters lead — they are the documents that verify
 * the career claims. The Curriculum Vitae pages (redundant with the
 * downloadable CV) and the third-party bar licence sit in a quieter group
 * underneath, still openable in the same viewer.
 */
export function Credentials() {
  const [index, setIndex] = useState<number | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  const open = useCallback(
    (doc: DocumentAsset, event: React.MouseEvent) => {
      openerRef.current = event.currentTarget as HTMLButtonElement
      setIndex(documents.findIndex((d) => d.id === doc.id))
    },
    [],
  )

  const close = useCallback(() => {
    setIndex(null)
    // Return focus to the card that opened the viewer.
    openerRef.current?.focus()
  }, [])

  const change = useCallback((next: number) => setIndex(next), [])

  return (
    <>
      <section aria-labelledby="featured-documents">
        <div className="section__subhead">
          <h3 id="featured-documents" className="h3">
            Signed employer letters
          </h3>
          <p className="meta">
            Three employers wrote and signed a letter for each of these roles.
          </p>
        </div>

        <div className="docs">
          {featuredDocuments.map((doc, index_) => (
            <Reveal key={doc.id} delay={index_ * 0.07}>
              <TiltCard className="doc-card-wrap" max={7}>
                <DocumentCard doc={doc} onOpen={open} />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {otherDocuments.length > 0 ? (
        <section aria-labelledby="other-documents" className="docs-secondary">
          <div className="section__subhead">
            <h3 id="other-documents" className="h3">
              Other documents on file
            </h3>
            <p className="meta">
              The Curriculum Vitae is available in full as a{' '}
              <a href="/cv/" className="link-underline">
                printable CV
              </a>
              .
            </p>
          </div>

          <ul className="doc-list">
            {otherDocuments.map((doc) => (
              <li key={doc.id}>
                <button
                  type="button"
                  className="doc-list__item"
                  onClick={(event) => open(doc, event)}
                >
                  <span className="doc-list__thumb">
                    <Image
                      src={doc.thumbnail}
                      alt=""
                      width={doc.thumbWidth}
                      height={doc.thumbHeight}
                      unoptimized
                    />
                  </span>

                  <span className="doc-list__text">
                    <span className="doc-list__title">{doc.title}</span>
                    <span className="doc-list__issuer">{doc.issuer}</span>
                  </span>

                  {doc.thirdParty ? (
                    <span className="badge badge--third-party">Third-party</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Lightbox
        documents={documents}
        index={index}
        onClose={close}
        onIndexChange={change}
      />
    </>
  )
}
