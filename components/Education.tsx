'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { EDUCATION } from '@/lib/data'
import Section from '@/components/Section'

function logoUrl(path: string): string {
  const v = process.env.NEXT_PUBLIC_LOGO_VERSION
  return v ? `${path}?v=${encodeURIComponent(v)}` : path
}

const courseChipClass =
  'rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium leading-tight tracking-wide text-white/75 sm:text-[13px]'

const tagChipClass =
  'rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-1 text-xs font-medium text-emerald-100/85'

export default function Education() {
  const reduceMotion = useReducedMotion()

  return (
    <Section
      id="education"
      title="Education"
      subtitle="Honours CS at Carleton — specialization, GPA, and coursework that backs the work on this site."
    >
      <div className="mx-auto max-w-4xl">
        {EDUCATION.map((edu, index) => (
          <motion.article
            key={`${edu.school}-${edu.years}`}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] ring-1 ring-inset ring-white/[0.03]"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: index * 0.06 }}
          >
            <div className="flex flex-col gap-8 p-6 sm:flex-row sm:items-start sm:gap-10 sm:p-8">
              {edu.logo && (
                <div className="mx-auto shrink-0 sm:mx-0">
                  <div className="relative mx-auto h-20 w-28 max-w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white p-1.5 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.32)] sm:h-[5.25rem] sm:w-[8.5rem] sm:p-2">
                    <Image
                      src={logoUrl(edu.logo)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 112px, 136px"
                      unoptimized
                      className="object-contain object-center"
                    />
                  </div>
                </div>
              )}
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/85 sm:text-xs">
                  Computer Science
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                  {edu.degree}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/70 sm:text-base">{edu.school}</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-white/50 sm:justify-start">
                  <span>{edu.years}</span>
                  {edu.gpa ? (
                    <>
                      <span className="text-white/25" aria-hidden>
                        ·
                      </span>
                      <span className="font-mono text-emerald-200/90">{edu.gpa}</span>
                    </>
                  ) : null}
                </div>
                {edu.tags && edu.tags.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start" aria-label="Focus areas">
                    {edu.tags.map((tag) => (
                      <li key={tag}>
                        <span className={tagChipClass}>{tag}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {edu.courses && edu.courses.length > 0 ? (
              <div className="border-t border-white/[0.06] bg-black/[0.12] px-6 py-7 sm:px-8">
                <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Related coursework
                </h4>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                  Selected courses — theory and systems alongside software engineering and math.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Related coursework">
                  {edu.courses.map((course) => (
                    <li key={course}>
                      <span className={courseChipClass}>{course}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
