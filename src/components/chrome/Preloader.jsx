import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { duration, ease, transition } from '../../lib/motion'
import { useMotionPreference } from '../../lib/motionPreference'

const SESSION_KEY = 'latent-space:intro'

/**
 * Cold open. Holds the page until fonts have resolved — the hero's split-text
 * reveal measures glyphs, so it must not run against a fallback face — then
 * lifts away. Shown once per session.
 */
export default function Preloader({ name, onComplete }) {
  const { reducedMotion } = useMotionPreference()
  const lenis = useLenis()
  const [phase, setPhase] = useState(() =>
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)
      ? 'done'
      : 'loading',
  )
  const progress = useMotionValue(0)
  const readout = useTransform(progress, (value) => String(Math.round(value)).padStart(3, '0'))
  const barScale = useTransform(progress, [0, 100], [0, 1])

  useEffect(() => {
    if (phase === 'done') {
      onComplete?.()
      return
    }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    lenis?.stop()

    let cancelled = false
    const controls = animate(progress, 100, {
      duration: reducedMotion ? duration.quick : duration.intro,
      ease: ease.collapse,
    })

    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.all([controls.finished, fonts]).then(() => {
      if (cancelled) return
      sessionStorage.setItem(SESSION_KEY, '1')
      // Hero motion starts while the panel is still lifting, so the two reads
      // as one continuous move rather than a handoff.
      onComplete?.()
      setPhase('exiting')
    })

    return () => {
      cancelled = true
      controls.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, lenis])

  const release = () => {
    setPhase('done')
    lenis?.start()
  }

  return (
    <AnimatePresence>
      {phase !== 'done' ? (
        <motion.div
          className="bg-ink fixed inset-0 z-[100] flex flex-col justify-between"
          initial={false}
          exit={{ y: '-101%' }}
          transition={{ duration: reducedMotion ? duration.instant : duration.slow, ease: ease.drift }}
          onAnimationComplete={() => {
            if (phase === 'exiting') release()
          }}
          animate={phase === 'exiting' ? { y: '-101%' } : { y: 0 }}
        >
          <div className="shell flex items-start justify-between pt-6">
            <span className="label">Latent Space</span>
            <span className="label hidden sm:block">Portfolio / {new Date().getFullYear()}</span>
          </div>

          <motion.div
            className="shell flex items-end justify-between gap-8 pb-8"
            animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
            transition={transition.fade}
          >
            {/* Not a heading: the hero owns the document's h1, and the cold open
                shouldn't put a second one in the outline while it is up. */}
            <p className="font-display text-hero text-bone max-w-[12ch] leading-[0.9]">{name}</p>
            <p className="font-mono text-title text-ash leading-none tabular-nums">
              <motion.span>{readout}</motion.span>
            </p>
          </motion.div>

          <div className="bg-hairline h-px w-full">
            <motion.div className="bg-signal h-px w-full origin-left" style={{ scaleX: barScale }} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
