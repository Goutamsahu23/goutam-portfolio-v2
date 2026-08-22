import { useEffect } from 'react'
import { loadGsap } from '../lib/gsap'
import { duration, gsapEase, stagger as staggerTokens } from '../lib/motion'

/**
 * Splits an element's text and slides the pieces up from behind their own line
 * box on scroll-in.
 *
 * Three details matter here:
 *  - Splitting is deferred until `document.fonts.ready`, because line breaks
 *    measured against a fallback face are wrong once the real face swaps in.
 *  - It is deferred again until the element is within half a viewport. Splitting
 *    forces a synchronous layout, and doing every headline on the page at load
 *    measured as ~300ms of blocking reflow.
 *  - split-type and GSAP are imported at that same moment rather than statically,
 *    so viewports that never split text never pay for the libraries.
 *  - A width-only resize listener re-splits, since line boxes change with the
 *    viewport but re-splitting on every height change (mobile URL bar) would
 *    thrash.
 *
 * Reverts cleanly, so screen readers and text selection get the original node
 * back once the reveal has played.
 */
export function useSplitReveal(ref, { type = 'lines', enabled = true, delay = 0, start } = {}) {
  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return

    let split = null
    let tween = null
    let resizeTimer = null
    let cancelled = false
    let lastWidth = window.innerWidth
    let lib = null

    const build = () => {
      const { SplitType, gsap } = lib
      split?.revert()
      split = new SplitType(element, {
        types: type === 'chars' ? 'lines,words,chars' : type === 'words' ? 'lines,words' : 'lines',
        // For words and characters the line box is the mask. Whole-line reveals
        // need a mask of their own, added below, since an element cannot clip
        // its own movement.
        lineClass: type === 'lines' ? 'line' : 'split-line',
        tagName: 'span',
      })

      if (type === 'lines') {
        split.lines?.forEach((line) => {
          const mask = document.createElement('span')
          mask.className = 'split-line'
          line.parentNode.insertBefore(mask, line)
          mask.appendChild(line)
        })
      }

      const targets = type === 'chars' ? split.chars : type === 'words' ? split.words : split.lines

      gsap.set(element, { opacity: 1 })

      if (type === 'chars') {
        // Character spans are read out letter by letter, so the split copy is
        // hidden from assistive tech; RevealText renders a plain-text twin.
        element.setAttribute('aria-hidden', 'true')
      }

      tween = gsap.fromTo(
        targets,
        { yPercent: 108, willChange: 'transform' },
        {
          yPercent: 0,
          duration: duration.slow,
          ease: gsapEase.signal,
          delay,
          stagger:
            type === 'chars'
              ? staggerTokens.chars
              : type === 'words'
                ? staggerTokens.words
                : staggerTokens.lines,
          // Promotion is granted for the tween only; leaving hundreds of
          // characters promoted afterwards costs memory for nothing.
          onComplete: () => gsap.set(targets, { willChange: 'auto' }),
          scrollTrigger: { trigger: element, start: start ?? 'top 88%', once: true },
        },
      )
    }

    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (cancelled || !lib) return
        tween?.scrollTrigger?.kill()
        tween?.kill()
        build()
        lib.ScrollTrigger.refresh()
      }, 220)
    }

    let observer = null
    const fonts = document.fonts?.ready ?? Promise.resolve()
    fonts.then(() => {
      if (cancelled) return
      // The margin is wider than the reveal's own trigger point, so the split is
      // always in place before the tween can fire.
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          observer.disconnect()
          observer = null
          Promise.all([import('split-type'), loadGsap()]).then(([splitType, gsapLib]) => {
            if (cancelled) return
            lib = { SplitType: splitType.default, ...gsapLib }
            build()
            window.addEventListener('resize', onResize)
          })
        },
        { rootMargin: '50% 0px 50% 0px' },
      )
      observer.observe(element)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      tween?.scrollTrigger?.kill()
      tween?.kill()
      split?.revert()
      element.removeAttribute('aria-hidden')
    }
  }, [ref, type, enabled, delay, start])
}

export default useSplitReveal
