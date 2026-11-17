'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { EDUCATION } from '@/lib/data'
import { logoUrl } from '@/lib/logoUrl'
import Section from '@/components/Section'
import { Poneglyph } from '@/components/fx/QuestBits'
import ShowMore from '@/components/ShowMore'
import { useState } from 'react'

function KeyRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3 font-mono text-[13px] sm:grid-cols-[6.5rem_1fr]">
      <dt className="text-ops-dim">{k}:</dt>
      <dd className="min-w-0 text-dark-text/85">{children}</dd>
    </div>
  )
}

export default function Education() {
  const reduceMotion = useReducedMotion()
  const [allCourses, setAllCourses] = useState(false)
  const COURSE_LIMIT = 5

  return (
    <Section
      id="education"
      index="03"
      command="cat ~/education.md"
      title="Education"
      subtitle="honours cs at carleton — specialization, gpa, and the coursework behind the work above."
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {EDUCATION.map((edu, index) => {
          const file = `${edu.school.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.md`
          return (
            <motion.article
              key={`${edu.school}-${edu.years}`}
              className="ops-panel ops-ticks"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: index * 0.06 }}
            >
              <div className="ops-head">
                <span className="text-dark-text/70">{file}</span>
                <span className="ml-auto text-ops-dim">r--r--r--</span>
              </div>

              <div className="flex flex-col gap-7 p-6 sm:flex-row sm:items-start sm:gap-9 sm:p-8">
                {edu.logo && (
                  <div className="relative h-24 w-32 shrink-0 sm:h-28 sm:w-36">
                    <Image
                      src={logoUrl(edu.logo)}
                      alt=""
                      fill
                      sizes="144px"
                      unoptimized
                      className="object-contain object-left drop-shadow-[0_0_18px_rgba(236,232,218,0.08)]"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-ops-dim">
                    <span className="text-dark-accent">#</span> computer science
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-dark-text sm:text-2xl">
                    {edu.degree}
                  </h3>
                  <dl className="mt-5 space-y-2">
                    <KeyRow k="school">{edu.school}</KeyRow>
                    <KeyRow k="years">{edu.years}</KeyRow>
                    {edu.gpa ? (
                      <KeyRow k="gpa">
                        <span className="phosphor text-dark-accent">{edu.gpa}</span>
                      </KeyRow>
                    ) : null}
                    {edu.tags && edu.tags.length > 0 ? (
                      <KeyRow k="focus">
                        <span className="flex flex-wrap gap-1.5">
                          {edu.tags.map((tag) => (
                            <span key={tag} className="border border-ops-ok/30 bg-ops-ok/[0.06] px-2 py-0.5 text-xs text-ops-ok">
                              {tag}
                            </span>
                          ))}
                        </span>
                      </KeyRow>
                    ) : null}
                  </dl>
                </div>
              </div>

              {edu.courses && edu.courses.length > 0 ? (
                <div className="border-t border-ops-line bg-dark-bg/40 px-6 py-6 sm:px-8">
                  <h4 className="font-mono text-xs text-ops-dim">
                    <span className="text-dark-accent">##</span> related coursework{' '}
                    <span className="text-ops-dim">({edu.courses.length})</span>
                    <Poneglyph index={1} className="ml-2" />
                  </h4>
                  <ul
                    className="mt-4 grid gap-x-6 gap-y-1.5 font-mono text-[13px] text-dark-text/75 sm:grid-cols-2 lg:grid-cols-3"
                    aria-label="Related coursework"
                  >
                    {edu.courses.map((course, ci) => (
                      <li key={course} className={`gap-2 ${!allCourses && ci >= COURSE_LIMIT ? 'hidden lg:flex' : 'flex'}`}>
                        <span className="text-ops-dim" aria-hidden>
                          -
                        </span>
                        {course}
                      </li>
                    ))}
                  </ul>
                  <ShowMore
                    expanded={allCourses}
                    hidden={Math.max(0, edu.courses.length - COURSE_LIMIT)}
                    onToggle={() => setAllCourses((v) => !v)}
                    className="mt-4"
                  />
                </div>
              ) : null}
            </motion.article>
          )
        })}
      </div>
    </Section>
  )
}
