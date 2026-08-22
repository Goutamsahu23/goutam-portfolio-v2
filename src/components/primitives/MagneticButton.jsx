import { motion } from 'framer-motion'
import { transition } from '../../lib/motion'
import { useMagnetic } from '../../hooks/useMagnetic'

/**
 * A button or link that leans toward the cursor, with its label leaning a
 * little further so the two surfaces separate under the pointer. Falls back to
 * a static element when motion is reduced or the pointer is coarse.
 */
export default function MagneticButton({
  children,
  as = 'button',
  strength,
  clamp,
  className = '',
  contentClassName = '',
  ...rest
}) {
  const { ref, enabled, handlers, style, contentStyle } = useMagnetic({ strength, clamp })
  const Component = motion[as] ?? motion.button

  return (
    <Component
      ref={ref}
      data-cursor="link"
      className={`relative inline-flex items-center justify-center ${className}`}
      style={style}
      whileHover={enabled ? { scale: 1.02 } : undefined}
      whileTap={enabled ? { scale: 0.97 } : undefined}
      transition={transition.hover}
      {...handlers}
      {...rest}
    >
      <motion.span
        className={`pointer-events-none inline-flex items-center gap-2 ${contentClassName}`}
        style={contentStyle}
      >
        {children}
      </motion.span>
    </Component>
  )
}
