import { motion } from 'framer-motion'
import { variants, viewport } from '../../lib/motion'
import { useMotionPreference } from '../../lib/motionPreference'

/**
 * Block-level scroll reveal for anything that is not text: images, slabs, rows.
 * `variant="slab"` travels further and settles slower, for full-bleed blocks.
 */
export default function Reveal({
  children,
  variant = 'item',
  delay = 0,
  className = '',
  as = 'div',
  ...rest
}) {
  const { motion: allowMotion } = useMotionPreference()
  const Component = motion[as] ?? motion.div
  const resolved = variant === 'slab' ? variants.riseSlab(allowMotion) : variants.riseItem(allowMotion)

  return (
    <Component
      className={className}
      variants={resolved}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Component>
  )
}
