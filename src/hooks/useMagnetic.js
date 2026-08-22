import { useCallback, useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { spring } from '../lib/motion'
import { useMotionPreference } from '../lib/motionPreference'

/**
 * Pointer attraction. The element leans toward the cursor by `strength` of the
 * distance from its own centre; the returned `contentStyle` leans a little
 * further, which is what separates this from a plain translate.
 */
export function useMagnetic({ strength = 0.32, clamp = 26 } = {}) {
  const { motion: allowMotion, pointerFine } = useMotionPreference()
  const enabled = allowMotion && pointerFine
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, spring.magnetic)
  const springY = useSpring(y, spring.magnetic)
  const contentX = useTransform(springX, (value) => value * 0.45)
  const contentY = useTransform(springY, (value) => value * 0.45)

  const onPointerMove = useCallback(
    (event) => {
      if (!enabled || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const offsetX = event.clientX - (rect.left + rect.width / 2)
      const offsetY = event.clientY - (rect.top + rect.height / 2)
      x.set(Math.max(-clamp, Math.min(clamp, offsetX * strength)))
      y.set(Math.max(-clamp, Math.min(clamp, offsetY * strength)))
    },
    [clamp, enabled, strength, x, y],
  )

  const onPointerLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return {
    ref,
    enabled,
    handlers: enabled ? { onPointerMove, onPointerLeave } : {},
    style: enabled ? { x: springX, y: springY } : undefined,
    contentStyle: enabled ? { x: contentX, y: contentY } : undefined,
  }
}

export default useMagnetic
