/**
 * The site's primary navigation. Kept in its own module so both the client
 * Navbar and the server-rendered Footer can read it — importing a plain
 * value out of a `'use client'` file would turn it into a client reference.
 */
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/profile', label: 'Profile' },
  { href: '/experience', label: 'Experience' },
  { href: '/credentials', label: 'Credentials' },
  { href: '/contact', label: 'Contact' },
]
