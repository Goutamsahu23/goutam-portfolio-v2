import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { spring, transition } from '../../lib/motion'
import { useMotionPreference } from '../../lib/motionPreference'

/**
 * Two-part cursor: a hard dot on the raw pointer position and a spring-trailed
 * ring that reacts to intent. Any element can drive it:
 *   data-cursor="link" | "text"
 *   data-cursor-label="OPEN"   → ring fills with signal and shows the label
 *
 * Positioning splits across two elements on purpose — the outer one carries the
 * pointer transform, the inner one carries centring and its own size animation,
 * so neither fights the other for the transform property.
 *
 * The dot and ring are bone by default, which makes them invisible on the paper
 * slabs, so both read `data-tone` off the section under the pointer and swap to
 * ink. Blend modes were the alternative and they lose: `difference` turns the
 * signal accent muddy, and the ring has to stay a hairline on both tones.
 */
export default function Cursor() {
  const { cursor: enabled } = useMotionPreference()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const ringX = useSpring(x, spring.cursor)
  const ringY = useSpring(y, spring.cursor)
  const [variant, setVariant] = useState('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  const [tone, setTone] = useState('ink')

  useEffect(() => {
    if (!enabled) return
    document.body.dataset.cursor = 'custom'
    return () => {
      delete document.body.dataset.cursor
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const onMove = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)

      const element = event.target instanceof Element ? event.target : null
      const target = element?.closest('[data-cursor]')
      setVariant(target?.dataset.cursor ?? 'default')
      setLabel(target?.dataset.cursorLabel ?? '')
      setTone(element?.closest('[data-tone]')?.dataset.tone ?? 'ink')
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const hasLabel = Boolean(label)
  const isText = variant === 'text'
  const size = hasLabel ? 104 : variant === 'link' ? 50 : 26
  const onBone = tone === 'bone'
  const solid = onBone ? 'var(--color-ink)' : 'var(--color-bone)'
  const hairline = onBone
    ? 'var(--color-hairline-ink-strong)'
    : 'var(--color-hairline-strong)'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <motion.div className="absolute top-0 left-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border"
          initial={false}
          animate={{
            width: isText ? 2 : size,
            height: isText ? 30 : size,
            opacity: visible ? 1 : 0,
            borderRadius: isText ? 1 : 999,
            backgroundColor: hasLabel || isText ? 'var(--color-signal)' : 'transparent',
            borderColor: hasLabel || isText ? 'var(--color-signal)' : hairline,
          }}
          transition={transition.hover}
        >
          {hasLabel ? (
            <motion.span
              className="label text-ink text-[0.5625rem] whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={transition.fade}
            >
              {label}
            </motion.span>
          ) : null}
        </motion.div>
      </motion.div>

      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.div
          className="h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={false}
          animate={{
            opacity: visible && !hasLabel && !isText ? 1 : 0,
            backgroundColor: solid,
          }}
          transition={transition.fade}
        />
      </motion.div>
    </div>
  )
}
