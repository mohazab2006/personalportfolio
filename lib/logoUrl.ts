/**
 * Optional `?v=` for logo paths so updated files under `/public/logos` with the same
 * filename are less likely to stick in CDN/browser caches after deploy.
 * Override anytime with `NEXT_PUBLIC_LOGO_VERSION` in `.env.local`.
 */
export function logoUrl(path: string): string {
  const v =
    process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.trim()
  return v ? `${path}?v=${encodeURIComponent(v)}` : path
}
