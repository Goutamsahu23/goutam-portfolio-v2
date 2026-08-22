import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { spring } from '../../lib/motion'

/**
 * A single signal hairline across the top plus a mono readout in the corner.
 * Both read window scroll, which Lenis keeps authoritative.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, spring.firm)
  const readout = useTransform(scrollYProgress, (value) =>
    String(Math.round(value * 100)).padStart(3, '0'),
  )

  return (
    <>
      <motion.div
        aria-hidden
        className="bg-signal fixed top-0 left-0 z-[60] h-px w-full origin-left"
        style={{ scaleX }}
      />
      <div
        aria-hidden
        className="label fixed right-[var(--spacing-gutter)] bottom-6 z-[60] hidden text-[0.5625rem] md:block"
      >
        <motion.span>{readout}</motion.span>
        <span> / 100</span>
      </div>
    </>
  )
}
