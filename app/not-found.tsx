import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      id="main"
      className="section"
      style={{ display: 'grid', placeItems: 'center', minHeight: '70svh' }}
    >
      <div style={{ textAlign: 'center' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          404
        </p>
        <h1 className="h2" style={{ marginTop: '1rem' }}>
          That page is not on the menu
        </h1>
        <p className="lead" style={{ margin: '1.5rem auto 0' }}>
          The page you were looking for does not exist. The rest of the site is
          still here.
        </p>
        <p style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn btn--primary">
            <span>Back to the portfolio</span>
          </Link>
        </p>
      </div>
    </main>
  )
}
