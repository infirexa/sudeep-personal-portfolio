import Link from 'next/link'
import { personal } from '@/lib/data'
import { NAV_LINKS } from '@/lib/navigation'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p style={{ fontWeight: 600 }}>{personal.fullName}</p>
          <p className="meta">Service Captain · {personal.currentCity}, India</p>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/cv/">CV</Link>
          <a href={personal.phoneHref}>Call</a>
          <a
            href={personal.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  )
}
