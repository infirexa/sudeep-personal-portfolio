import { Archivo, Manrope } from 'next/font/google'

/**
 * Both families are self-hosted by next/font at build time — the browser
 * never makes a request to fonts.googleapis.com.
 *
 * Archivo exposes two variable axes, `wght` (100-900) and `wdth` (62-125).
 * We deliberately do NOT request `wdth`: it is inert unless something sets
 * `font-variation-settings: 'wdth'`, and it costs +58 KB on the latin
 * subset. Tightness comes from `letter-spacing` instead.
 *
 * Note that Archivo's shipped default weight is 600, not 400 — every rule
 * that uses it sets an explicit `font-weight`.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
})

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  fallback: [
    'ui-sans-serif',
    'system-ui',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  adjustFontFallback: true,
  preload: true,
})
