import { roleRotator } from '@/lib/data'

/**
 * An infinite strip of role titles. The track holds two identical groups so
 * the -50% translation loops seamlessly; the duplicate is hidden from
 * assistive technology and a static list carries the same content.
 */
export function Marquee() {
  const group = (
    <div className="marquee__group" aria-hidden="true">
      {roleRotator.map((role) => (
        <span className="marquee__item" key={role}>
          {role}
          <span className="marquee__sep"> ◆ </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee">
      <div className="marquee__track">
        {group}
        {group}
      </div>

      <p className="sr-only">Roles held: {roleRotator.join(', ')}.</p>
    </div>
  )
}
