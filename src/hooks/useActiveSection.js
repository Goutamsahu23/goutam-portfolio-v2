import { useEffect, useState } from 'react'

/**
 * Tracks which section currently owns the middle band of the viewport.
 * IntersectionObserver rather than scroll math, so it costs nothing per frame.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element) => element !== null)
    if (!elements.length) return

    const visible = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        })
        if (!visible.size) return
        const [winner] = [...visible.entries()].sort((a, b) => b[1] - a[1])
        setActive(winner[0])
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])

  return active
}

export default useActiveSection
