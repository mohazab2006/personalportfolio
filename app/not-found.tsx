import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-purple-500">404</h1>
        <h2 className="mb-4 text-3xl font-bold text-light-text dark:text-dark-text">
          Page Not Found
        </h2>
        <p className="mb-8 text-light-text/70 dark:text-dark-text/70">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-medium text-white transition-all hover:bg-purple-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Go Home
        </Link>
      </div>
    </div>
  )
}

