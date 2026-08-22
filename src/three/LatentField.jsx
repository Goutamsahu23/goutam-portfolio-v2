import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, Color } from 'three'
import { loadGsap } from '../lib/gsap'
import { field, gsapEase } from '../lib/motion'
import { sampleTextPoints } from './sampleTextPoints'
import { fragmentShader, vertexShader } from './shaders/latentField'

const BONE = new Color('#ede7de')
const SIGNAL = new Color('#d6ff3f')

/**
 * Builds the two point clouds the shader interpolates between: a radial noise
 * cloud and the name silhouette. Randomised, so it runs in an effect rather
 * than during render.
 */
function buildAttributes(name, count) {
  const scatter = new Float32Array(count * 3)
  const seed = new Float32Array(count)

  for (let i = 0; i < count; i += 1) {
    // Biased toward the centre so the cloud has a soft, lens-like falloff
    // instead of filling a hard box.
    const radius = Math.pow(Math.random(), 0.65)
    const angle = Math.random() * Math.PI * 2
    scatter[i * 3] = Math.cos(angle) * radius * 5.2
    scatter[i * 3 + 1] = Math.sin(angle) * radius * 3.1
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 2.6
    seed[i] = Math.random()
  }

  // Parked in the upper right, smaller than the HTML headline: overlapping the
  // real type would read as a doubled word rather than an echo of it.
  const target = sampleTextPoints(name, { count, scale: 2.3, offset: [1.55, 0.5] })

  return { scatter, seed, target }
}

function Field({ name, count, disperse, active }) {
  const { viewport } = useThree()
  const materialRef = useRef(null)
  const resolve = useRef({ value: 0 })
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const [attributes, setAttributes] = useState(null)

  // Sampling the silhouette requires the display face to be loaded, otherwise
  // the field resolves into the shape of the fallback serif.
  useEffect(() => {
    let mounted = true
    const fonts = document.fonts?.ready ?? Promise.resolve()
    fonts.then(() => {
      if (mounted) setAttributes(buildAttributes(name, count))
    })
    return () => {
      mounted = false
    }
  }, [name, count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolve: { value: 0 },
      uDisperse: { value: 0 },
      uPointer: { value: [0, 0] },
      uPointerRadius: { value: 1.35 },
      uPointerStrength: { value: 0.7 },
      uSize: { value: 2.4 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
      uOpacity: { value: 1 },
      uBone: { value: BONE },
      uSignal: { value: SIGNAL },
    }),
    [],
  )

  // Cold open: the field converges into the name, holds, then lets go. Held back
  // until the canvas is actually rendering, so the moment is never spent behind
  // the preloader panel.
  useEffect(() => {
    if (!attributes || !active) return

    let timeline = null
    let cancelled = false

    loadGsap().then(({ gsap }) => {
      if (cancelled) return
      timeline = gsap.timeline()
      timeline
        .to(resolve.current, { value: 1, duration: field.converge, ease: gsapEase.drift })
        .to(resolve.current, {
          value: 0.1,
          duration: field.disperse,
          ease: gsapEase.collapse,
          delay: field.hold,
        })
    })

    return () => {
      cancelled = true
      timeline?.kill()
    }
  }, [attributes, active])

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.targetX = (event.clientX / window.innerWidth - 0.5) * viewport.width
      pointer.current.targetY = -(event.clientY / window.innerHeight - 0.5) * viewport.height
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [viewport.width, viewport.height])

  useFrame((_, delta) => {
    const material = materialRef.current
    if (!material) return

    material.uniforms.uTime.value += delta

    // Exponential smoothing keeps the follow identical at 60 and 120fps.
    const k = 1 - Math.exp(-5 * delta)
    const p = pointer.current
    p.x += (p.targetX - p.x) * k
    p.y += (p.targetY - p.y) * k
    // Mutated in place: a fresh array every frame would be pure garbage.
    material.uniforms.uPointer.value[0] = p.x
    material.uniforms.uPointer.value[1] = p.y

    const scrolled = disperse?.get() ?? 0
    material.uniforms.uResolve.value = resolve.current.value * (1 - scrolled)
    material.uniforms.uDisperse.value = scrolled
    material.uniforms.uOpacity.value = Math.max(0, 1 - scrolled * 1.25)
  })

  if (!attributes) return null

  return (
    // Positions move in the vertex shader, so the CPU-side bounding sphere is
    // meaningless for culling.
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.scatter, 3]} />
        <bufferAttribute attach="attributes-aScatter" args={[attributes.scatter, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[attributes.target, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[attributes.seed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}

/**
 * The signature moment. Lazy-loaded, so `three` never reaches devices that get
 * the static fallback, and paused via `frameloop` the instant it leaves view.
 * Points need neither a depth nor a stencil buffer, so both are switched off.
 */
export default function LatentField({ name, count = 8000, active = true, disperse }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 0, 7], fov: 42 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Field name={name} count={count} disperse={disperse} active={active} />
    </Canvas>
  )
}
