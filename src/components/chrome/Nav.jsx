import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { SECTIONS, SECTION_IDS } from '../../lib/sections'
import { duration, ease, stagger, transition, variants } from '../../lib/motion'
import { useMotionPreference } from '../../lib/motionPreference'
import { useActiveSection } from '../../hooks/useActiveSection'

/**
 * Editorial index rather than a button bar. The bar itself sits in
 * `mix-blend-difference` so it stays legible over both ink sections and the
 * inverted bone slabs without needing a scroll-triggered background.
 */
export default function Nav({ ready }) {
  const active = useActiveSection(SECTION_IDS)
  const lenis = useLenis()
  const { reducedMotion } = useMotionPreference()
  const [open, setOpen] = useState(false)

  const goTo = (id) => {
    setOpen(false)
    const target = `#${id}`
    if (lenis) {
      // Negative offset clears the fixed bar, so a jumped-to section head is
      // never parked underneath it.
      lenis.scrollTo(target, { offset: -72, duration: duration.scroll, immediate: reducedMotion })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[50] mix-blend-difference"
        initial={{ opacity: 0, y: -12 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: duration.slow, ease: ease.signal, delay: ready ? 0.35 : 0 }}
      >
        <nav className="shell flex items-center justify-between py-5" aria-label="Sections">
          <button type="button" onClick={() => goTo('start')} data-cursor="link" className="label">
            <span className="text-bone whitespace-nowrap">Goutam Sahu</span>
          </button>

          {/* Six mono labels plus the monogram need ~1024px before they stop
              colliding; below that the index becomes an overlay. */}
          <ul className="hidden items-center gap-7 lg:flex">
            {SECTIONS.slice(1).map((section) => (
              <li key={section.id}>
                {/* Deliberately monochrome: the bar blends in difference mode,
                    and the accent would invert to a muddy blue over the paper
                    section. The active state is carried by weight and a rule. */}
                <button
                  type="button"
                  onClick={() => goTo(section.id)}
                  data-cursor="link"
                  className={`label group flex items-baseline gap-1.5 transition-colors duration-200 ease-(--ease-snap) ${
                    active === section.id ? 'text-bone' : 'text-ash hover:text-bone'
                  }`}
                >
                  <span className="text-[0.5625rem]">{section.index}</span>
                  <span className="relative">
                    {section.label}
                    <span
                      aria-hidden
                      className={`bg-bone absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ease-(--ease-snap) ${
                        active === section.id ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(true)}
            data-cursor="link"
            className="label text-bone lg:hidden"
            aria-expanded={open}
          >
            Index
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="bg-ink fixed inset-0 z-[70] flex flex-col justify-between lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fade}
          >
            <div className="shell flex items-center justify-between py-5">
              <span className="label">Index</span>
              <button type="button" onClick={() => setOpen(false)} className="label text-bone">
                Close
              </button>
            </div>

            <motion.ul
              className="shell flex flex-col"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: stagger.items } } }}
            >
              {SECTIONS.map((section) => (
                <motion.li
                  key={section.id}
                  variants={variants.riseItem(!reducedMotion)}
                  className="hairline-t last:border-b last:border-b-[color:var(--color-hairline)]"
                >
                  <button
                    type="button"
                    onClick={() => goTo(section.id)}
                    className="flex w-full items-baseline gap-4 py-4 text-left"
                  >
                    <span className="label text-[0.5625rem]">{section.index}</span>
                    <span className="font-display text-title text-bone">{section.label}</span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            <div className="shell label pb-8">Scroll or tap to navigate</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
