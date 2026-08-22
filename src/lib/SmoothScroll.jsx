import { useEffect, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import { setScroller } from './gsap'
import { useMotionPreference } from './motionPreference'

/**
 * Lenis drives the page. It runs its own rAF rather than GSAP's ticker so that
 * nothing here pulls GSAP into the entry chunk; the ScrollTrigger handshake is
 * wired by src/lib/gsap.js whenever a scroll effect actually loads it.
 */
export default function SmoothScroll({ children }) {
  const ref = useRef(null)
  const { reducedMotion } = useMotionPreference()

  useEffect(() => {
    const lenis = ref.current?.lenis
    if (lenis) setScroller(lenis)
  }, [])

  return (
    <ReactLenis
      root
      ref={ref}
      options={{
        lerp: reducedMotion ? 1 : 0.085,
        wheelMultiplier: 0.95,
        smoothWheel: !reducedMotion,
        // Native touch scrolling outperforms a synced one on mobile.
        syncTouch: false,
        anchors: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
