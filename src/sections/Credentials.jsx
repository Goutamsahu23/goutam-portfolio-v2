import portfolioData from '../../data.json'
import Section from '../components/primitives/Section'
import SectionHead from '../components/primitives/SectionHead'
import Reveal from '../components/primitives/Reveal'
import { SECTIONS } from '../lib/sections'

const meta = SECTIONS.find((section) => section.id === 'credentials')

function Column({ label, children, span = 'lg:col-span-4' }) {
  return (
    <div className={`col-span-12 ${span}`}>
      <p className="label border-t border-t-[color:var(--color-hairline)] pt-4">{label}</p>
      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </div>
  )
}

/**
 * 05 — Credentials. Education, certifications and languages were three thin
 * sections; as one three-column index they read as a reference page instead of
 * padding. Columns disappear individually when their data is absent.
 */
export default function Credentials() {
  const { education, certifications, languages } = portfolioData
  if (!education?.length && !certifications?.length && !languages?.length) return null

  return (
    <Section id="credentials">
      <div className="shell">
        <SectionHead
          index={meta.index}
          label={meta.label}
          title="Formal record."
          className="mb-(--spacing-section)"
        />

        <div className="grid grid-cols-12 gap-x-6 gap-y-16">
          {education?.length ? (
            <Column label="Education">
              {education.map((entry) => (
                <Reveal key={`${entry.institution}-${entry.period}`}>
                  <h3 className="font-display text-lead leading-tight">{entry.degree}</h3>
                  <p className="text-bone-dim mt-2 text-[0.9375rem]">{entry.institution}</p>
                  <p className="label mt-3">
                    {entry.period}
                    {entry.location ? <span className="text-ash"> — {entry.location}</span> : null}
                  </p>
                  {entry.grade ? <p className="label text-signal mt-1">{entry.grade}</p> : null}
                </Reveal>
              ))}
            </Column>
          ) : null}

          {certifications?.length ? (
            <Column label="Certifications">
              {certifications.map((entry) => (
                <Reveal key={`${entry.title}-${entry.year}`}>
                  <h3 className="font-display text-lead leading-tight">{entry.title}</h3>
                  <p className="label mt-3">
                    {entry.issuer}
                    <span className="text-ash"> — {entry.year}</span>
                  </p>
                </Reveal>
              ))}
            </Column>
          ) : null}

          {languages?.length ? (
            <Column label="Languages">
              <Reveal>
                <ul className="flex flex-col gap-3">
                  {languages.map((language) => (
                    <li key={language} className="font-display text-lead leading-none">
                      {language}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Column>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
