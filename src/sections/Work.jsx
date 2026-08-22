import { useState } from 'react'
import portfolioData from '../../data.json'
import Section from '../components/primitives/Section'
import SectionHead from '../components/primitives/SectionHead'
import RevealText from '../components/primitives/RevealText'
import Reveal from '../components/primitives/Reveal'
import ParallaxBox from '../components/primitives/ParallaxBox'
import { stagger } from '../lib/motion'
import { SECTIONS } from '../lib/sections'

const meta = SECTIONS.find((section) => section.id === 'work')

/**
 * Stands in when a project has no image or its URL is dead. Project images come
 * from operator-managed env vars, so a broken one is a question of when, not if
 * — and an empty plate reads as a bug where type reads as a decision.
 */
function PlateFallback({ project, index }) {
  return (
    <span aria-hidden className="absolute inset-0 flex items-end justify-between gap-4 p-6">
      <span className="bg-hairline absolute inset-x-6 top-1/2 h-px" />
      <span className="font-display text-hero text-bone/12 leading-[0.8]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="label text-ash text-right">
        {project.technologies.slice(0, 3).join(' · ')}
      </span>
    </span>
  )
}

function ProjectSlab({ project, index }) {
  const primaryLink = project.demo || project.github
  const isFlipped = index % 2 === 1
  const plateSpan = project.featured ? 'lg:col-span-7' : 'lg:col-span-6'
  const [plateFailed, setPlateFailed] = useState(false)
  const showImage = Boolean(project.image) && !plateFailed

  return (
    <article className="group border-t border-t-[color:var(--color-hairline)] pt-8 pb-(--spacing-section) last:pb-0">
      <div className="grid grid-cols-12 items-start gap-x-6 gap-y-10">
        <div
          className={`relative col-span-12 ${plateSpan} ${isFlipped ? 'lg:order-2 lg:col-start-6' : ''}`}
        >
          {/* Outside the link on purpose: a visible word inside a link whose
              accessible name comes from aria-label is a name mismatch. */}
          {project.featured ? (
            <span className="label text-signal absolute top-4 left-4 z-10">Featured</span>
          ) : null}
          <a
            href={primaryLink}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="link"
            data-cursor-label={project.demo ? 'Visit' : 'Source'}
            // The plate holds only a decorative image, so it needs a name of
            // its own; the title link beside it carries the visible one.
            aria-label={`${project.title} — open project`}
            className="relative block aspect-16/10 w-full overflow-hidden bg-ink-raised"
          >
            {showImage ? (
              <>
                {/* Inset slack gives the parallax room to travel without exposing
                    the frame edge. */}
                <ParallaxBox distance={28} className="absolute inset-[-6%]">
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setPlateFailed(true)}
                    className="h-full w-full object-cover brightness-[0.82] grayscale transition-[filter,transform] duration-700 ease-(--ease-signal) group-hover:scale-[1.02] group-hover:brightness-100 group-hover:grayscale-0"
                  />
                </ParallaxBox>
                <span
                  aria-hidden
                  className="bg-ink/25 absolute inset-0 transition-opacity duration-700 ease-(--ease-signal) group-hover:opacity-0"
                />
              </>
            ) : (
              <PlateFallback project={project} index={index} />
            )}
          </a>
        </div>

        <div
          className={`col-span-12 lg:col-span-4 ${isFlipped ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9'}`}
        >
          <p className="label text-signal">{String(index + 1).padStart(2, '0')}</p>

          <h3 className="mt-4">
            <a
              href={primaryLink}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="link"
              className="font-display text-pull inline-block leading-[1.08]"
            >
              <RevealText as="span" type="words">
                {project.title}
              </RevealText>
              <span
                aria-hidden
                className="bg-signal mt-2 block h-px origin-left scale-x-0 transition-transform duration-500 ease-(--ease-signal) group-hover:scale-x-100"
              />
            </a>
          </h3>

          <Reveal delay={stagger.items} className="mt-6">
            <p className="text-bone-dim">{project.description}</p>
          </Reveal>

          {project.highlights?.length ? (
            <Reveal delay={stagger.items * 2} className="mt-6">
              <ul className="flex flex-col gap-2">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="text-bone-dim flex gap-3 text-[0.9375rem]">
                    <span className="bg-signal mt-2.5 h-1 w-1 shrink-0" aria-hidden />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          <Reveal delay={stagger.items * 3} className="mt-8">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {project.technologies.map((tech) => (
                <li key={tech} className="label">
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={stagger.items * 4} className="mt-8 flex gap-6">
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="link"
                className="label hover:text-signal transition-colors duration-300 ease-(--ease-snap)"
              >
                Live &#8599;
              </a>
            ) : null}
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="link"
                className="label hover:text-signal transition-colors duration-300 ease-(--ease-snap)"
              >
                Source &#8599;
              </a>
            ) : null}
          </Reveal>
        </div>
      </div>
    </article>
  )
}

/**
 * 02 — Work. Alternating full-bleed slabs rather than a card grid: each project
 * gets a whole band of the page, and the plate stays desaturated until it has
 * the visitor's attention.
 */
export default function Work() {
  const { projects } = portfolioData
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured))

  return (
    <Section id="work">
      <div className="shell">
        <SectionHead
          index={meta.index}
          label={meta.label}
          title="Selected builds, shipped end to end."
          meta={`${projects.length} projects`}
          className="mb-(--spacing-section)"
        />

        {ordered.map((project, index) => (
          <ProjectSlab key={project.title} project={project} index={index} />
        ))}
      </div>
    </Section>
  )
}
