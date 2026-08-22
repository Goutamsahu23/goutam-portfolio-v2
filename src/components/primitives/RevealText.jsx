import { useRef } from 'react'
import { motion } from 'framer-motion'
import { transition, viewport } from '../../lib/motion'
import { useMotionPreference } from '../../lib/motionPreference'
import { useSplitReveal } from '../../hooks/useSplitReveal'

/**
 * Scroll-triggered text reveal. `children` must be a plain string — split-type
 * rewrites the node's contents, so element children would be destroyed.
 *
 * Splitting is treated as a heavy effect wholesale. Compact viewports and
 * reduced-motion visitors get a plain fade: on a throttled phone, splitting
 * every headline on the page is the single most expensive thing the site does,
 * and it buys an effect that reads as noise at that size anyway.
 */
export default function RevealText({
  as: Tag = 'span',
  type = 'lines',
  delay = 0,
  start,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const { heavyMotion } = useMotionPreference()

  useSplitReveal(ref, { type, enabled: heavyMotion, delay, start })

  if (!heavyMotion) {
    return (
      <Tag className={className} {...rest}>
        <motion.span
          className="inline-block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={transition.fade}
        >
          {children}
        </motion.span>
      </Tag>
    )
  }

  return (
    <>
      {/* Hidden until the hook has split the text, otherwise the un-split string
          paints for a frame before the pieces are pushed off their baseline. */}
      <Tag ref={ref} className={className} style={{ opacity: 0 }} {...rest}>
        {children}
      </Tag>
      {/* Character splitting hides the visible copy from assistive tech, so the
          text has to exist somewhere readable. */}
      {type === 'chars' ? <span className="sr-only">{children}</span> : null}
    </>
  )
}
