import { MagneticButton } from '@/components/ui/MagneticButton'
import { personal } from '@/lib/data'

export function Contact() {
  return (
    <div className="contact__grid">
      <div className="contact__item">
        <p className="contact__label">Telephone</p>
        <p className="contact__value">
          <a href={personal.phoneHref}>+91 {personal.mobile}</a>
        </p>
      </div>

      <div className="contact__item">
        <p className="contact__label">WhatsApp</p>
        <p className="contact__value">
          <a href={personal.whatsappHref} target="_blank" rel="noopener noreferrer">
            Message directly
          </a>
        </p>
      </div>

      <div className="contact__item">
        <p className="contact__label">Based in</p>
        <p className="contact__value contact__value--small">
          {personal.address.line1}, {personal.address.line2},{' '}
          {personal.address.district}, {personal.address.state}{' '}
          {personal.address.postalCode}
        </p>
      </div>

      <div className="contact__actions">
        <MagneticButton href="/cv/" variant="light">
          Download CV
          <svg
            className="btn__arrow"
            width="13"
            height="13"
            viewBox="0 0 14 14"
            aria-hidden="true"
          >
            <path
              d="M7 1v10M3 7l4 4 4-4M1 13h12"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            />
          </svg>
        </MagneticButton>

        <MagneticButton href={personal.whatsappHref} external variant="light">
          WhatsApp
        </MagneticButton>

        <MagneticButton href={personal.phoneHref} variant="light">
          Call
        </MagneticButton>
      </div>
    </div>
  )
}
