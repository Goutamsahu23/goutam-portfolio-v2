import { useCallback, useMemo, useSyncExternalStore } from 'react'

/**
 * Subscribes to a media query. Uses useSyncExternalStore so the first render
 * already has the right answer — gated components must never paint the wrong
 * variant and then correct themselves.
 */
export function useMediaQuery(query) {
  const list = useMemo(
    () => (typeof window === 'undefined' ? null : window.matchMedia(query)),
    [query],
  )

  const subscribe = useCallback(
    (onChange) => {
      if (!list) return () => {}
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [list],
  )

  const getSnapshot = useCallback(() => Boolean(list?.matches), [list])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export default useMediaQuery
