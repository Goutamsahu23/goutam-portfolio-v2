import { motion } from 'framer-motion'
import { duration, ease, viewport } from '../../lib/motion'
import { useMotionPreference } from '../../lib/motionPreference'

/** A 1px rule that draws itself in from the left as it enters view. */
export default function Hairline({ className = '', delay = 0, tone = 'default' }) {
  const { motion: allowMotion } = useMotionPreference()
  const color = tone === 'signal' ? 'bg-signal' : tone === 'ink' ? 'bg-hairline-ink' : 'bg-hairline'

  return (
    <motion.div
      aria-hidden
      className={`h-px w-full origin-left ${color} ${className}`}
      initial={{ scaleX: allowMotion ? 0 : 1 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewport}
      transition={{ duration: duration.slow, ease: ease.drift, delay }}
    />
  )
}
