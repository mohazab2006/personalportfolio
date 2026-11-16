'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Section from '@/components/Section'

/**
 * "Offline": the person behind the work. Kept factual and understated on purpose —
 * one designed detail per card does the talking (rank ladder, attempt pips, tally, log pose).
 */

const SIEGE_RANKS = ['copper', 'bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond', 'champion']
const view = { once: true, amount: 0.35 } as const

function Card({
  label,
  status,
  title,
  body,
  children,
  delay,
}: {
  label: string
  status: string
  title: string
  body: string
  children: React.ReactNode
  delay: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      className="ops-panel group flex flex-col transition-colors hover:border-dark-accent/40"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={view}
      transition={{ duration: 0.55, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ops-head">
        <span className="text-dark-text/70">{label}</span>
        <span className="ml-auto text-ops-dim">{status}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold tracking-tight text-dark-text sm:text-2xl">{title}</h3>
        <div className="my-5">{children}</div>
        <p className="mt-auto text-sm leading-relaxed text-dark-text/65">{body}</p>
      </div>
    </motion.article>
  )
}

/** Siege rank ladder with the current tier lit. */
function RankLadder() {
  const reduce = useReducedMotion()
  const at = SIEGE_RANKS.indexOf('emerald')
  return (
    <div>
      <div className="flex gap-1" aria-hidden>
        {SIEGE_RANKS.map((r, i) => (
          <motion.span
            key={r}
            className={`h-2 flex-1 ${i < at ? 'bg-dark-text/25' : i === at ? 'bg-[#3ddc97] shadow-[0_0_12px_rgba(61,220,151,0.7)]' : 'bg-ops-line'}`}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={view}
            transition={{ duration: 0.3, delay: reduce ? 0 : 0.25 + i * 0.06 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10.5px] text-ops-dim">
        <span>copper</span>
        <span className="text-[#3ddc97]">emerald iii</span>
        <span>champion</span>
      </div>
    </div>
  )
}

/** Six attempts: five deaths, one clear. */
function AttemptPips() {
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="img" aria-label="Six attempts: five failed, the sixth cleared">
      {Array.from({ length: 6 }, (_, i) => (
        <motion.span
          key={i}
          className={`flex h-7 w-7 items-center justify-center border font-mono text-[11px] ${
            i < 5 ? 'border-ops-err/40 text-ops-err/70' : 'border-[#f0c85a] bg-[#f0c85a]/10 text-[#f0c85a] shadow-[0_0_14px_-2px_rgba(240,200,90,0.7)]'
          }`}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ duration: 0.25, delay: reduce ? 0 : 0.3 + i * 0.12 }}
        >
          {i < 5 ? '✕' : '✓'}
        </motion.span>
      ))}
      <span className="ml-1 whitespace-nowrap font-mono text-[11px] text-ops-dim">try 6</span>
    </div>
  )
}

/** Round-counter tally. */
function Tally() {
  const reduce = useReducedMotion()
  const groups = 3
  return (
    <div className="flex items-end gap-4" aria-hidden>
      {Array.from({ length: groups }, (_, g) => (
        <div key={g} className="relative flex h-9 gap-[5px]">
          {Array.from({ length: 4 }, (_, i) => (
            <motion.span
              key={i}
              className="w-[3px] bg-[#c0392b]"
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={view}
              style={{ originY: 1 }}
              transition={{ duration: 0.18, delay: reduce ? 0 : 0.3 + (g * 5 + i) * 0.05 }}
            />
          ))}
          <motion.span
            className="absolute left-[-4px] top-1/2 h-[3px] w-[34px] -rotate-[28deg] bg-[#c0392b]"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={view}
            style={{ originX: 0 }}
            transition={{ duration: 0.2, delay: reduce ? 0 : 0.3 + (g * 5 + 4) * 0.05 }}
          />
        </div>
      ))}
      <span className="font-mono text-[11px] text-ops-dim">and counting</span>
    </div>
  )
}

/** A log pose: the needle hunts, then settles. */
function LogPose() {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-14 w-14 rounded-full border border-ops-line-strong" aria-hidden>
        <div className="absolute inset-[5px] rounded-full border border-dashed border-ops-line" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[46%] w-[2px] -translate-x-1/2 origin-bottom bg-gradient-to-t from-transparent to-[#46a0ff]"
          style={{ translateY: '-100%' }}
          initial={reduce ? false : { rotate: -120 }}
          whileInView={{ rotate: [-120, 70, -30, 25, 8] }}
          viewport={view}
          transition={{ duration: 2.2, delay: reduce ? 0 : 0.4, ease: 'easeOut' }}
        />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dark-text/70" />
      </div>
      <span className="font-mono text-[11px] text-ops-dim">bearing locked</span>
    </div>
  )
}

export default function Offline() {
  return (
    <Section
      id="offline"
      index="05"
      command="whoami --offline"
      title="Offline"
      subtitle="the hours that aren't spent shipping."
    >
      <p className="-mt-4 mb-10 max-w-2xl text-lg leading-relaxed text-dark-text/80 sm:text-xl">
        I don&apos;t play games casually. I study them: mechanics, routes, frame data, the meta, and only then the run. It&apos;s
        the same loop I use on a new stack.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          label="rainbow six siege"
          status="ranked"
          title="Emerald III"
          body="A game about information: drones, sound, angles, timing. The same reason security clicks for me."
          delay={0}
        >
          <RankLadder />
        </Card>
        <Card
          label="elden ring"
          status="multiple runs"
          title="Consort Radahn, six tries"
          body="The first five were research. Learn the moveset, not the panic roll."
          delay={0.08}
        >
          <AttemptPips />
        </Card>
        <Card
          label="treyarch zombies"
          status="lore archivist"
          title="Element 115 to the Dark Aether"
          body="Favourite storyline in games. Eight-hour lore breakdowns in one sitting, and the reason this site has easter eggs."
          delay={0.16}
        >
          <Tally />
        </Card>
        <Card
          label="one piece"
          status="still sailing"
          title="The long game"
          body="The best setup-to-payoff in fiction: threads that land a thousand chapters later."
          delay={0.24}
        >
          <LogPose />
        </Card>
      </div>
    </Section>
  )
}
