/**
 * Motion tokens — the single source of truth for every animation in the site.
 *
 * Nothing outside this file should contain a raw duration, easing array or
 * spring config. Keep the CSS mirrors in `src/index.css` (@theme --ease-*) in
 * sync with `ease` below so CSS transitions and JS animations share curves.
 */

/** Cubic-bezier control points, consumed directly by Framer Motion. */
export const ease = {
  /** Expo-out. The house curve: fast commit, long silent settle. */
  signal: [0.16, 1, 0.3, 1],
  /** Quart-out. Slower, heavier arrivals — large type and full-bleed slabs. */
  drift: [0.25, 1, 0.5, 1],
  /** In-out with a weighted tail. State swaps where both ends need control. */
  collapse: [0.7, 0, 0.2, 1],
  /** Short, tight response for pointer-driven feedback. */
  snap: [0.32, 0.72, 0, 1],
}

/** Same curves as CSS strings, for GSAP and inline style transitions. */
export const cssEase = Object.fromEntries(
  Object.entries(ease).map(([key, [a, b, c, d]]) => [key, `cubic-bezier(${a}, ${b}, ${c}, ${d})`]),
)

/** GSAP's named equivalents, so ScrollTrigger tweens match Framer's feel. */
export const gsapEase = {
  signal: 'expo.out',
  drift: 'power4.out',
  collapse: 'power3.inOut',
  snap: 'power2.out',
}

export const duration = {
  instant: 0.18,
  quick: 0.32,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.4,
  /** Cold-open counter. Kept tight: every extra frame here is Speed Index. */
  intro: 1.1,
  /** Programmatic scroll (nav jumps, back to top). */
  scroll: 1.2,
  /** One cycle of an idling, looping indicator. */
  loop: 2.8,
}

/** Waits for elements that follow another element's move rather than the scroll. */
export const delay = {
  afterHeadline: 0.5,
  afterIntro: 1.1,
}

/** Choreography of the hero particle field, in seconds. */
export const field = {
  converge: 1.9,
  hold: 0.8,
  disperse: 2.6,
}

export const spring = {
  /** Magnetic buttons: overshoots just enough to feel physical. */
  magnetic: { stiffness: 160, damping: 15, mass: 0.6 },
  /** Cursor ring: trails the pointer without visible lag. */
  cursor: { stiffness: 520, damping: 40, mass: 0.4 },
  /** Wide, slow follow for background parallax and the WebGL attractor. */
  drift: { stiffness: 60, damping: 20, mass: 1 },
  /** Layout-ish movement that must not wobble. */
  firm: { stiffness: 260, damping: 30, mass: 0.8 },
}

export const stagger = {
  chars: 0.016,
  words: 0.045,
  lines: 0.08,
  items: 0.07,
  slabs: 0.12,
  /** Offset between the two lines of the hero headline. */
  headline: 0.12,
}

/** Distances, in px or rem, that reveals travel. Kept small and consistent. */
export const travel = {
  text: '0.9em',
  item: 24,
  slab: 64,
}

/** Ready-made Framer transitions. */
export const transition = {
  reveal: { duration: duration.base, ease: ease.signal },
  revealSlow: { duration: duration.slow, ease: ease.drift },
  hover: { duration: duration.quick, ease: ease.snap },
  fade: { duration: duration.quick, ease: ease.collapse },
  cinematic: { duration: duration.cinematic, ease: ease.drift },
}

/** Shared `whileInView` viewport config: fires a little before centre. */
export const viewport = { once: true, margin: '-10% 0px -15% 0px' }

/**
 * Variant pairs used by section-level containers. `enabled: false` collapses
 * every reveal to a plain opacity fade for reduced-motion users.
 */
export const variants = {
  container: (enabled = true) => ({
    hidden: {},
    visible: {
      transition: { staggerChildren: enabled ? stagger.items : 0 },
    },
  }),
  riseItem: (enabled = true) => ({
    hidden: { opacity: 0, y: enabled ? travel.item : 0 },
    visible: { opacity: 1, y: 0, transition: transition.reveal },
  }),
  riseSlab: (enabled = true) => ({
    hidden: { opacity: 0, y: enabled ? travel.slab : 0 },
    visible: { opacity: 1, y: 0, transition: transition.revealSlow },
  }),
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transition.fade },
  },
}
