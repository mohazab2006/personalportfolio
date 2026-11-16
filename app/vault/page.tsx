'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import GlitchText from '@/components/fx/GlitchText'
import { readVault, type RootPayload, type VaultContent } from '@/lib/rootEgg'
import { EGGS, clearance, useEggs } from '@/lib/eggs'
import { useIncidentStats } from '@/lib/incident'
import { setTheme } from '@/lib/theme'

/**
 * /vault — exists only for whoever opened the sealed root egg. Its content was never in the
 * page code: it was decrypted from the seal in this browser and kept locally.
 */
export default function VaultPage() {
  const reduce = useReducedMotion()
  const [state, setState] = useState<'checking' | 'denied' | 'open'>('checking')
  const [data, setData] = useState<(RootPayload & { vault: VaultContent }) | null>(null)
  const eggs = useEggs()
  const incidents = useIncidentStats()
  const [scores, setScores] = useState<{ oncall: string | null; wpm: string | null }>({ oncall: null, wpm: null })

  useEffect(() => {
    const v = readVault()
    setData(v)
    setState(v ? 'open' : 'denied')
    if (v) setTheme('root')
    try {
      setScores({ oncall: localStorage.getItem('azab-oncall-best'), wpm: localStorage.getItem('azab-type-best') })
    } catch {
      /* ignore */
    }
  }, [])

  if (state === 'checking') return <main className="min-h-screen" />

  if (state === 'denied') {
    return (
      <main className="relative z-[1] flex min-h-screen items-center px-4 font-mono sm:px-6">
        <div className="mx-auto w-full max-w-xl">
          <p className="text-xs text-ops-dim">
            <span className="text-ops-ok">visitor@azab</span>:~$ cd /vault
          </p>
          <p className="mt-6 text-6xl font-extrabold tracking-tight text-ops-err sm:text-7xl">
            <GlitchText text="403" />
          </p>
          <p className="mt-3 text-sm text-dark-text/80">permission denied. this directory requires root.</p>
          <Link href="/" className="ops-btn mt-8">
            cd ~
          </Link>
        </div>
      </main>
    )
  }

  const v = data!.vault
  const cl = clearance(eggs)
  const stage = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduce ? 0 : 0.9 + i * 0.16, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <main className="relative z-[1] min-h-screen overflow-hidden font-mono">
      {/* Door: two plates part, then stay out of the way */}
      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none fixed inset-y-0 left-0 z-20 w-1/2 border-r border-ops-err/40 bg-[#0b0605]"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.7, 0, 0.2, 1] }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none fixed inset-y-0 right-0 z-20 w-1/2 border-l border-ops-err/40 bg-[#0b0605]"
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.7, 0, 0.2, 1] }}
            aria-hidden
          />
        </>
      )}

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,60,80,0.12),transparent_60%)]" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <motion.p className="text-xs text-ops-dim sm:text-[13px]" {...stage(0)}>
          <span className="text-ops-err">root@azab</span>:/vault# ls
        </motion.p>
        <motion.h1 className="mt-4 text-5xl font-extrabold tracking-tight text-dark-text sm:text-7xl" {...stage(0.5)}>
          <GlitchText text={v.title} burst />
        </motion.h1>
        <motion.p className="mt-3 text-sm text-ops-dim" {...stage(0.8)}>
          sealed {data!.sealedAt} · you are one of very few people to see this page.
        </motion.p>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* Letter */}
          <motion.section className="ops-panel ops-ticks" {...stage(1)}>
            <div className="ops-head">
              <span className="text-dark-text/70">letter.txt</span>
              <span className="ml-auto text-ops-err">r--------</span>
            </div>
            <div className="space-y-4 p-6 font-sans text-[15px] leading-relaxed text-dark-text/85 sm:p-8 sm:text-base">
              {v.letter.map((l, i) => (
                <p key={i} className={i === v.letter.length - 1 ? 'font-mono text-sm text-ops-dim' : ''}>
                  {l}
                </p>
              ))}
            </div>
          </motion.section>

          {/* Dossier */}
          <motion.section className="ops-panel" {...stage(1.4)}>
            <div className="ops-head">
              <span className="text-dark-text/70">dossier · mohamed</span>
            </div>
            <dl className="text-[13px]">
              {v.dossier.map((d) => (
                <div key={d.k} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-dashed border-ops-line px-4 py-2.5 last:border-b-0">
                  <dt className="text-ops-dim">{d.k}</dt>
                  <dd className="text-dark-text/90">{d.v}</dd>
                </div>
              ))}
            </dl>
          </motion.section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* The solver's own record */}
          <motion.section className="ops-panel" {...stage(1.8)}>
            <div className="ops-head">
              <span className="text-dark-text/70">your record</span>
            </div>
            <dl className="text-[13px]">
              {[
                ['clearance', `${cl.title} · root`],
                ['easter eggs', `${eggs.length}/${EGGS.length}`],
                ['incidents survived', String(incidents.survived)],
                ['on-call best', scores.oncall ? `${parseFloat(scores.oncall).toFixed(2)}%` : '—'],
                ['typing best', scores.wpm ? `${scores.wpm} wpm` : '—'],
              ].map(([k, val]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-dashed border-ops-line px-4 py-2.5 last:border-b-0">
                  <dt className="text-ops-dim">{k}</dt>
                  <dd className="text-dark-text/90">{val}</dd>
                </div>
              ))}
            </dl>
          </motion.section>

          {/* Build log */}
          <motion.section className="ops-panel" {...stage(2.1)}>
            <div className="ops-head">
              <span className="text-dark-text/70">git log --oneline</span>
            </div>
            <ol className="space-y-1.5 p-4 text-[13px]">
              {v.log.map((l, i) => (
                <li key={i} className="text-dark-text/85">
                  <span className="text-ops-err">{(0xa3f0 + i * 0x1d7).toString(16)}</span> {l}
                </li>
              ))}
            </ol>
          </motion.section>
        </div>

        <motion.div className="mt-10 flex flex-wrap gap-2.5" {...stage(2.5)}>
          <Link href="/" className="ops-btn ops-btn-primary">
            back to the site
          </Link>
          <button type="button" onClick={() => setTheme('amber')} className="ops-btn">
            theme amber
          </button>
        </motion.div>
      </div>
    </main>
  )
}
