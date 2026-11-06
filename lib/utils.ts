export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | undefined | null>

/** Tiny class-name joiner — avoids pulling in a dependency for one function. */
export function cx(...values: ClassValue[]): string {
  const out: string[] = []

  const walk = (value: ClassValue) => {
    if (!value) return
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value))
      return
    }
    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }
    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) out.push(key)
    }
  }

  values.forEach(walk)
  return out.join(' ')
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Formats a number the way it should appear on a stat tile. */
export function formatStat(value: number): string {
  return value.toLocaleString('en-IN')
}
