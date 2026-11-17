'use client'

import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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
      className="ops-panel group flex w-[84vw] max-w-[360px] shrink-0 snap-start flex-col transition-colors hover:border-dark-accent/40 sm:w-auto sm:max-w-none"
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



/** Five games, every main-quest easter egg: chips tick on one by one. */
function ZombiesChecklist() {
  const reduce = useReducedMotion()
  const games = ['bo1', 'bo2', 'bo3', 'bo6', 'bo7']
  return (
    <div className="flex flex-wrap gap-1.5" role="img" aria-label="Every main-quest easter egg completed in Black Ops 1, 2, 3, 6 and 7">
      {games.map((g, i) => (
        <motion.span
          key={g}
          className="border border-[#c0392b]/70 bg-[#c0392b]/10 px-2 py-1 font-mono text-[11px] uppercase text-[#ff6b5b]"
          initial={reduce ? false : { opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={view}
          transition={{ duration: 0.2, delay: reduce ? 0 : 0.3 + i * 0.18 }}
        >
          ✓ {g}
        </motion.span>
      ))}
    </div>
  )
}

/** Hours counter that rolls up when the card arrives. */
function HoursCounter({ to }: { to: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, to])
  return (
    <div>
      <span ref={ref} className="font-mono text-4xl font-extrabold tabular-nums text-[#7ad36b]">
        {n.toLocaleString()}+
      </span>
      <span className="ml-2 font-mono text-[11px] text-ops-dim">hrs · gta v</span>
    </div>
  )
}

/** Five nights, five games: every clock reached 6 AM. */
function SixAM() {
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-wrap gap-1.5" role="img" aria-label="Five Nights at Freddy's 1 to 5, all finished">
      {[1, 2, 3, 4, 5].map((g, i) => (
        <motion.span
          key={g}
          className="flex flex-col items-center border border-ops-line-strong px-2 py-1 font-mono"
          initial={reduce ? false : { opacity: 0.2 }}
          whileInView={{ opacity: 1 }}
          viewport={view}
          transition={{ duration: 0.25, delay: reduce ? 0 : 0.3 + i * 0.15 }}
        >
          <span className="text-[13px] font-bold text-[#ffd84a]">6AM</span>
          <span className="text-[9.5px] text-ops-dim">fnaf {g}</span>
        </motion.span>
      ))}
    </div>
  )
}

/** Saga progress: caught up, still reading. */
function SagaProgress() {
  const reduce = useReducedMotion()
  const sagas = ['east blue', 'alabasta', 'sky island', 'water 7', 'thriller bark', 'summit war', 'fish-man', 'dressrosa', 'four emperors', 'final saga']
  return (
    <div>
      <div className="flex gap-[3px]" aria-hidden>
        {sagas.map((s, i) => (
          <motion.span
            key={s}
            title={s}
            className={`h-2 flex-1 ${i === sagas.length - 1 ? 'animate-status-pulse bg-[#46a0ff]' : 'bg-[#46a0ff]/70'}`}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={view}
            style={{ originX: 0 }}
            transition={{ duration: 0.2, delay: reduce ? 0 : 0.25 + i * 0.07 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10.5px] text-ops-dim">
        <span>east blue</span>
        <span className="text-[#46a0ff]">final saga · caught up</span>
      </div>
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

      {/* Phones: swipe sideways instead of a long scroll. Larger screens: a grid. */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        <Card
          label="call of duty zombies"
          status="every main quest"
          title="Every easter egg, five games"
          body="Black Ops 1, 2, 3, 6 and 7, every main-quest egg. Favourite storyline in games, and the reason this site has easter eggs."
          delay={0}
        >
          <ZombiesChecklist />
        </Card>
        <Card
          label="elden ring"
          status="multiple runs"
          title="Consort Radahn, six tries"
          body="The first five were research. Learn the moveset, not the panic roll."
          delay={0.06}
        >
          <AttemptPips />
        </Card>
        <Card
          label="rainbow six siege"
          status="ranked"
          title="Emerald III"
          body="A game about information: drones, sound, angles, timing. The same reason security clicks for me."
          delay={0.12}
        >
          <RankLadder />
        </Card>
        <Card
          label="grand theft auto"
          status="every game, finished"
          title="1,500+ hours in GTA V"
          body="Played and finished every GTA. Los Santos is basically a second hometown at this point."
          delay={0.18}
        >
          <HoursCounter to={1500} />
        </Card>
        <Card
          label="five nights at freddy's"
          status="1 through 5"
          title="Survived every night"
          body="All five games, every night to 6 AM. Pattern recognition under pressure is a transferable skill."
          delay={0.24}
        >
          <SixAM />
        </Card>
        <Card
          label="one piece"
          status="caught up"
          title="Reading every chapter"
          body="The best long game in fiction: setups planted a thousand chapters before they pay off. Four road poneglyphs are hidden on this site, too."
          delay={0.3}
        >
          <SagaProgress />
        </Card>
      </div>
      <p className="mt-2 text-center font-mono text-[11px] text-ops-dim sm:hidden">swipe for more →</p>
    </Section>
  )
}
