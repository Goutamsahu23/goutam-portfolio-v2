import { useLenis } from 'lenis/react'
import portfolioData from '../../../data.json'
import MagneticButton from '../primitives/MagneticButton'
import { duration } from '../../lib/motion'
import { useMotionPreference } from '../../lib/motionPreference'

export default function Footer() {
  const { personal } = portfolioData
  const lenis = useLenis()
  const { reducedMotion } = useMotionPreference()

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: duration.scroll, immediate: reducedMotion })
    else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer className="bg-ink border-t border-t-[color:var(--color-hairline)]">
      <div className="shell grid grid-cols-12 items-center gap-6 py-10">
        <p className="label col-span-12 md:col-span-4">
          &copy; {new Date().getFullYear()} {personal.name}
        </p>

        <p className="label col-span-12 md:col-span-4 md:text-center">
          Latent Space <span className="text-ash">— v2</span>
        </p>

        <div className="col-span-12 md:col-span-4 md:justify-self-end">
          <MagneticButton
            onClick={toTop}
            clamp={14}
            className="border-hairline hover:border-signal hover:text-signal rounded-full border px-6 py-2.5 transition-colors duration-300 ease-(--ease-snap)"
            contentClassName="label"
          >
            Back to top
          </MagneticButton>
        </div>
      </div>
    </footer>
  )
}
