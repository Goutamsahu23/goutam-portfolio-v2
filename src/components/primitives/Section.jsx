/**
 * Section shell. `tone="bone"` inverts to the paper palette for slab sections;
 * the nav stays legible over both because it blends in difference mode.
 */
export default function Section({ id, children, className = '', tone = 'ink' }) {
  const tones = {
    ink: 'bg-ink text-bone',
    bone: 'bg-bone text-ink',
  }

  return (
    <section
      id={id}
      data-tone={tone}
      className={`relative py-(--spacing-section) ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  )
}
