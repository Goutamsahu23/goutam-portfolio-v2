import Hairline from './Hairline'
import RevealText from './RevealText'

/**
 * The repeated editorial header: rule, mono index and label, optional right
 * meta, then an oversized display title on the next line.
 */
export default function SectionHead({ index, label, title, meta, tone = 'ink', className = '' }) {
  return (
    <header className={`relative ${className}`.trim()}>
      <Hairline tone={tone === 'bone' ? 'ink' : 'default'} />
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
        {title ? (
          <p className="label flex shrink-0 items-baseline gap-2">
            <span className={tone === 'bone' ? 'text-ink' : 'text-signal'}>{index}</span>
            <span className={tone === 'bone' ? 'text-ink/70' : undefined}>{label}</span>
          </p>
        ) : (
          /* When there is no display title, the index row is the section h2 — avoids
             a second hidden heading that duplicated the label in the pinned layout. */
          <h2 className="label m-0 flex shrink-0 items-baseline gap-2">
            <span className={tone === 'bone' ? 'text-ink' : 'text-signal'}>{index}</span>
            <span className={tone === 'bone' ? 'text-ink/70' : undefined}>{label}</span>
          </h2>
        )}
        {meta ? (
          <p
            className={`label max-w-full text-right sm:max-w-[min(100%,22rem)] ${
              tone === 'bone' ? 'text-ink/70' : ''
            }`}
          >
            {meta}
          </p>
        ) : null}
      </div>

      {title ? (
        <RevealText
          as="h2"
          type="words"
          className="font-display text-title mt-(--spacing-gutter) max-w-[24ch] italic"
        >
          {title}
        </RevealText>
      ) : null}
    </header>
  )
}
