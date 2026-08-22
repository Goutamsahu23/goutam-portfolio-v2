import portfolioData from '../../data.json'
import Section from '../components/primitives/Section'
import SectionHead from '../components/primitives/SectionHead'
import RevealText from '../components/primitives/RevealText'
import Reveal from '../components/primitives/Reveal'
import { stagger } from '../lib/motion'
import { SECTIONS } from '../lib/sections'

const meta = SECTIONS.find((section) => section.id === 'statement')

/**
 * 01 — Statement. The first bio paragraph carries the section at display size;
 * supporting paragraphs sit below as a magazine spread.
 */
export default function Statement() {
  const { about, personal } = portfolioData
  const [lead, ...rest] = about.description

  return (
    <Section id="statement">
      <div className="shell">
        <SectionHead index={meta.index} label={meta.label} meta={personal.location} />

        <div className="mt-(--spacing-section) grid grid-cols-12 gap-x-6 gap-y-14">
          <RevealText
            as="p"
            type="words"
            className="font-display text-pull text-bone col-span-12 lg:col-span-11"
          >
            {lead}
          </RevealText>

          {/* Remaining paragraphs run as magazine columns rather than a single
              indented block, which would leave half the grid empty. */}
          {rest.map((paragraph, index) => (
            <Reveal
              key={paragraph}
              delay={index * stagger.items}
              className={`text-bone-dim col-span-12 md:col-span-6 lg:col-span-5 ${
                index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-7'
              }`}
            >
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
