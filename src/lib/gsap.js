/**
 * GSAP is loaded on demand, not in the entry chunk.
 *
 * Everything it drives here — the split-text reveals and the pinned Trajectory
 * rail — is gated behind `heavyMotion`, so compact viewports and reduced-motion
 * visitors would otherwise download and parse ~150 kB of JavaScript to run none
 * of it. On a throttled phone that parse alone measured as most of the site's
 * blocking time.
 *
 * Callers await `loadGsap()`. The module also owns the one-time Lenis handshake,
 * since both consumers need it and neither should be the one to set it up.
 */
let pending = null
let scroller = null
let synced = false

function syncScroller(ScrollTrigger) {
  if (synced || !scroller) return
  synced = true
  // Lenis runs its own rAF; forwarding its scroll event is what keeps pinned
  // sections locked to the smoothed position instead of a frame behind it.
  scroller.on('scroll', ScrollTrigger.update)
  ScrollTrigger.refresh()
}

/** Called by the smooth-scroll provider as soon as Lenis exists. */
export function setScroller(lenis) {
  scroller = lenis
  if (pending) pending.then(({ ScrollTrigger }) => syncScroller(ScrollTrigger))
}

export function loadGsap() {
  if (!pending) {
    pending = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([core, plugin]) => {
        const gsap = core.gsap ?? core.default
        const { ScrollTrigger } = plugin
        gsap.registerPlugin(ScrollTrigger)
        gsap.defaults({ overwrite: 'auto' })
        syncScroller(ScrollTrigger)
        return { gsap, ScrollTrigger }
      },
    )
  }
  return pending
}
