import { createContext, useContext, useMemo } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

/**
 * One place decides how much motion the site is allowed to run.
 *
 * - `motion`      — any non-essential movement at all.
 * - `heavyMotion` — WebGL, scroll pinning, per-character staggers. Off on
 *                   compact viewports so touch devices get a lighter build of
 *                   the experience rather than a shrunken heavy one.
 * - `cursor`      — the custom cursor, which needs a real pointer.
 */
const MotionPreferenceContext = createContext({
  reducedMotion: false,
  isCompact: false,
  pointerFine: true,
  motion: true,
  heavyMotion: true,
  cursor: true,
})

export function MotionPreferenceProvider({ children }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isCompact = useMediaQuery('(max-width: 900px)')
  const pointerFine = useMediaQuery('(hover: hover) and (pointer: fine)')

  const value = useMemo(
    () => ({
      reducedMotion,
      isCompact,
      pointerFine,
      motion: !reducedMotion,
      heavyMotion: !reducedMotion && !isCompact,
      cursor: pointerFine && !reducedMotion,
    }),
    [reducedMotion, isCompact, pointerFine],
  )

  return (
    <MotionPreferenceContext.Provider value={value}>{children}</MotionPreferenceContext.Provider>
  )
}

export function useMotionPreference() {
  return useContext(MotionPreferenceContext)
}
