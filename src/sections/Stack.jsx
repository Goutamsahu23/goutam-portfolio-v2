import portfolioData from '../../data.json'
import Section from '../components/primitives/Section'
import SectionHead from '../components/primitives/SectionHead'
import Marquee from '../components/primitives/Marquee'
import Reveal from '../components/primitives/Reveal'
import { stagger } from '../lib/motion'
import { SECTIONS } from '../lib/sections'

const meta = SECTIONS.find((section) => section.id === 'stack')

/**
 * 04 — Stack. A typographic index, not a chart. Self-scored percentage bars
 * measure nothing, so the tools are simply set at reading size and grouped by
 * the part of the system they belong to.
 */
export default function Stack() {
  const { skills } = portfolioData
  const everything = skills.flatMap((group) => group.skills.map((skill) => skill.name))

  return (
    <Section id="stack">
      <div className="shell">
        <SectionHead
          index={meta.index}
          label={meta.label}
          title="The tools, grouped by where they sit in the system."
          meta={`${everything.length} tools`}
          className="mb-(--spacing-section)"
        />

        <div>
          {skills.map((group, groupIndex) => (
            <Reveal
              key={group.category}
              delay={groupIndex * stagger.items}
              className="grid grid-cols-12 gap-x-6 gap-y-4 border-t border-t-[color:var(--color-hairline)] py-8 last:border-b last:border-b-[color:var(--color-hairline)]"
            >
              <p className="label col-span-12 md:col-span-3">{group.category}</p>
              <ul className="col-span-12 flex flex-wrap gap-x-7 gap-y-2 md:col-span-9">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    data-cursor="link"
                    className="font-display text-lead md:text-pull hover:text-signal cursor-default leading-none transition-colors duration-300 ease-(--ease-snap)"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-(--spacing-section)">
        <Marquee seconds={44} trackClassName="gap-8 pr-8">
          {everything.map((name) => (
            <span key={name} className="font-display text-title flex items-center gap-8 italic">
              {name}
              <span className="bg-signal inline-block h-1.5 w-1.5 shrink-0 rotate-45" aria-hidden />
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  )
}
