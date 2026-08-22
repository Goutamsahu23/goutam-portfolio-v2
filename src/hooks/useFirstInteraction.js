import { useEffect, useState } from 'react'

const EVENTS = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'touchstart']

/**
 * Resolves true after the visitor's first input of any kind.
 *
 * Used to defer WebGL initialisation: the particle field exists to react to the
 * pointer, so there is no reason to compile shaders for someone who has not
 * touched the page yet. Costs nothing for a real visit — the first mouse move
 * arrives within milliseconds — and keeps a cold load free of a long task.
 */
export function useFirstInteraction(enabled = true) {
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    if (!enabled || interacted) return
    const wake = () => setInteracted(true)
    EVENTS.forEach((event) => window.addEventListener(event, wake, { once: true, passive: true }))
    return () => EVENTS.forEach((event) => window.removeEventListener(event, wake))
  }, [enabled, interacted])

  return interacted
}

export default useFirstInteraction
