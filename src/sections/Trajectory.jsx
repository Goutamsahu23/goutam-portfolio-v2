import { useEffect, useRef } from 'react'
import portfolioData from '../../data.json'
import { loadGsap } from '../lib/gsap'
import { stagger } from '../lib/motion'
import { useMotionPreference } from '../lib/motionPreference'
import { SECTIONS } from '../lib/sections'
import SectionHead from '../components/primitives/SectionHead'
import Reveal from '../components/primitives/Reveal'

const meta = SECTIONS.find((section) => section.id === 'trajectory')

function Role({ role, index, total, horizontal }) {
  return (
    <article
      className={
        horizontal
          ? 'flex h-full max-h-full w-[min(86vw,32rem)] shrink-0 flex-col justify-start overflow-y-auto py-8 border-l border-l-[color:var(--color-hairline)] px-8 first:border-l-0 first:pl-0'
          : 'border-t border-t-[color:var(--color-hairline)] py-10'
      }
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="label text-signal">
          {String(index + 1).padStart(2, '0')}
          <span className="text-ash"> / {String(total).padStart(2, '0')}</span>
        </p>
        <p className="label text-right">{role.type}</p>
      </div>

      <h3 className="font-display text-pull mt-6 leading-[1.1]">{role.title}</h3>

      <p className="label mt-4">
        <span className="text-bone">{role.company}</span>
        <span className="text-ash"> — {role.location}</span>
      </p>
      <p className="label mt-1">{role.period}</p>

      {/* The vertical layout spans the full grid, so measure has to be capped
          by hand — 65 characters is the comfortable reading limit. */}
      <p className={`text-bone-dim mt-6 text-[0.9375rem] ${horizontal ? '' : 'max-w-[65ch]'}`}>
        {role.description}
      </p>

      {role.highlights?.length ? (
        <ul className={`mt-5 flex flex-col gap-2 ${horizontal ? '' : 'max-w-[75ch]'}`}>
          {role.highlights.map((highlight) => (
            <li key={highlight} className="text-bone-dim flex gap-3 text-[0.875rem]">
              <span className="bg-signal mt-2 h-1 w-1 shrink-0" aria-hidden />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-1">
        {role.technologies.map((tech) => (
          <li key={tech} className="label text-[0.625rem]">
            {tech}
          </li>
        ))}
      </ul>
    </article>
  )
}

/**
 * 03 — Trajectory. On a real pointer the roles run sideways under a pinned
 * viewport, so time reads as horizontal distance. Touch and reduced-motion get
 * the same content as a plain vertical index — the layout changes, not the
 * information.
 */
export default function Trajectory() {
  const { experience } = portfolioData
  const { heavyMotion } = useMotionPreference()
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    if (!heavyMotion) return
    const track = trackRef.current
    const pin = pinRef.current
    if (!track || !pin) return

    let context = null
    let cancelled = false

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return

      context = gsap.context(() => {
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth * 0.86)

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getDistance() + window.innerHeight * 0.4}`,
            pin: true,
            // A little lag on the scrub is what makes a hijacked section feel
            // physical instead of glued to the wheel.
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        timeline
          .fromTo(track, { x: 0 }, { x: () => -getDistance(), ease: 'none' }, 0)
          .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
      }, pin)

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [heavyMotion])

  if (!heavyMotion) {
    return (
      <section id="trajectory" className="bg-ink py-(--spacing-section)">
        <div className="shell">
          <SectionHead
            index={meta.index}
            label={meta.label}
            title="Where the work has happened."
            meta={`${experience.length} roles`}
            className="mb-16"
          />
          {experience.map((role, index) => (
            <Reveal key={`${role.company}-${role.period}`} delay={index * stagger.items}>
              <Role role={role} index={index} total={experience.length} horizontal={false} />
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="trajectory" className="bg-ink relative">
      <div ref={pinRef} className="grid h-svh grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-ink">
        <div className="shell border-b border-b-[color:var(--color-hairline)] bg-ink pt-20 pb-6">
          <SectionHead
            index={meta.index}
            label={meta.label}
            meta={`${experience.length} roles · scroll sideways`}
          />
        </div>

        <div className="relative min-h-0 overflow-hidden">
          <div
            ref={trackRef}
            className="absolute inset-0 flex items-start pt-6 left-(--spacing-gutter) will-change-transform"
          >
            {experience.map((role, index) => (
              <Role
                key={`${role.company}-${role.period}`}
                role={role}
                index={index}
                total={experience.length}
                horizontal
              />
            ))}
          </div>
        </div>

        <div className="shell bg-ink pb-10 pt-4">
          <div className="bg-hairline h-px w-full">
            <div ref={barRef} className="bg-signal h-px w-full origin-left" />
          </div>
        </div>
      </div>
    </section>
  )
}
