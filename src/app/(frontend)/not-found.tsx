import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">We couldn&apos;t find that page</h1>
      <p className="mt-4 text-muted">It may have moved — but the burgers haven&apos;t.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/menu" className="btn-primary">View the menu</Link>
        <Link href="/" className="btn-outline">Home</Link>
      </div>
    </div>
  )
}
