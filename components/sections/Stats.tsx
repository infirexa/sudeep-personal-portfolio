import { CountUp } from '@/components/ui/CountUp'
import { Reveal } from '@/components/ui/Reveal'
import { stats } from '@/lib/data'

/**
 * A flat metric strip. The figures sit directly on the page with a single
 * rule above and below, rather than in four boxes.
 */
export function Stats() {
  return (
    <Reveal className="metrics">
      {stats.map((stat) => (
        <div className="metric" key={stat.id}>
          <span className="metric__number">
            <CountUp value={stat.value} suffix={stat.suffix} />
          </span>
          <span className="metric__label">{stat.label}</span>
          <span className="metric__caption">{stat.caption}</span>
        </div>
      ))}
    </Reveal>
  )
}
