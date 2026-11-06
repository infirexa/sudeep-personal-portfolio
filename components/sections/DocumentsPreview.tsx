import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { featuredDocuments } from '@/lib/data'

/**
 * A teaser for the three signed employer letters. On the home page they are
 * a preview — clicking through opens the full gallery.
 */
export function DocumentsPreview() {
  return (
    <div className="docs-preview">
      {featuredDocuments.map((doc, index) => (
        <Reveal key={doc.id} delay={index * 0.07}>
          <Link href="/credentials" className="docs-preview__item">
            <span className="docs-preview__thumb">
              <Image
                src={doc.thumbnail}
                alt={doc.alt}
                width={doc.thumbWidth}
                height={doc.thumbHeight}
                unoptimized
              />
            </span>
            <span className="docs-preview__title">{doc.title}</span>
            <span className="docs-preview__issuer">{doc.issuer}</span>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
