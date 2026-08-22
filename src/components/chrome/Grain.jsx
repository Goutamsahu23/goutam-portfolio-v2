import { useMotionPreference } from '../../lib/motionPreference'

// Inline SVG turbulence: a 160px monochrome noise tile, no network request and
// no raster asset to ship.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='160' height='160' filter='url(%23g)' opacity='0.5'/></svg>\")"

/**
 * Film grain over the whole page.
 *
 * Deliberately no blend mode: a full-viewport blended layer forces the browser
 * to recomposite the entire page on every frame that anything else animates,
 * which measured as the single largest source of main-thread work. Plain opacity
 * on its own compositor layer looks the same and costs nothing.
 */
export default function Grain() {
  const { heavyMotion } = useMotionPreference()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      <div
        className="absolute -inset-[15%] h-[130%] w-[130%] opacity-[0.055]"
        style={{
          backgroundImage: GRAIN,
          backgroundRepeat: 'repeat',
          transform: 'translateZ(0)',
          willChange: heavyMotion ? 'transform' : undefined,
          animation: heavyMotion ? 'grain-shift 9s steps(6) infinite' : 'none',
        }}
      />
    </div>
  )
}
