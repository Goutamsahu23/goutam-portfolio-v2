import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMotionPreference } from '../../lib/motionPreference'

/**
 * Depth by differential scroll speed. Reads raw scroll progress rather than a
 * spring, because Lenis has already smoothed the input — springing it again
 * introduces visible lag against neighbouring elements.
 */
export default function ParallaxBox({
  children,
  distance = 70,
  className = '',
  scale = false,
  ...rest
}) {
  const ref = useRef(null)
  const { motion: allowMotion } = useMotionPreference()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06])

  if (!allowMotion) {
    return (
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, scale: scale ? scaleValue : undefined }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
