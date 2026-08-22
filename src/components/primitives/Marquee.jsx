import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useMotionPreference } from '../../lib/motionPreference'

/**
 * Continuous horizontal ticker. Linear timing is deliberate and the one place
 * it is correct — an eased marquee visibly stalls at the loop seam. The track
 * holds two identical copies and translates exactly -50%, so the seam is
 * invisible; the duplicate is hidden from assistive tech.
 *
 * Paused while off-screen: an infinite animation outside the viewport is pure
 * main-thread cost.
 */
export default function Marquee({
  children,
  seconds = 32,
  reverse = false,
  className = '',
  trackClassName = '',
}) {
  const { motion: allowMotion } = useMotionPreference()
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '20% 0px 20% 0px' })

  return (
    <div ref={ref} className={`group relative w-full overflow-hidden ${className}`}>
      <div
        className="flex w-max"
        style={
          allowMotion
            ? {
                animation: `marquee-slide ${seconds}s linear infinite`,
                animationDirection: reverse ? 'reverse' : 'normal',
                animationPlayState: inView ? 'running' : 'paused',
                willChange: inView ? 'transform' : undefined,
              }
            : undefined
        }
      >
        <div className={`flex shrink-0 items-center ${trackClassName}`}>{children}</div>
        <div aria-hidden className={`flex shrink-0 items-center ${trackClassName}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
