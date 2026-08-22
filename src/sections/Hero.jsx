import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useLenis } from 'lenis/react'
import portfolioData from '../../data.json'
import { delay, duration, ease, stagger, transition, variants } from '../lib/motion'
import { useMotionPreference } from '../lib/motionPreference'
import RevealText from '../components/primitives/RevealText'
import MagneticButton from '../components/primitives/MagneticButton'
import Hairline from '../components/primitives/Hairline'

/**
 * 00 — Hero. Editorial cold open: the name resolves from a faint ghost into
 * solid type. No WebGL — the particle field fought the headline for attention
 * and read as noise rather than intent.
 */
export default function Hero({ introDone }) {
  const { personal, socialLinks, stats } = portfolioData
  const { heavyMotion } = useMotionPreference()
  const lenis = useLenis()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { margin: '0px 0px -10% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 96])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const [firstName, ...restName] = personal.name.trim().split(/\s+/)
  const lastName = restName.join(' ')

  const scrollToWork = () => {
    if (lenis) lenis.scrollTo('#work')
    else document.getElementById('work')?.scrollIntoView()
  }

  return (
    <section
      id="start"
      ref={sectionRef}
      className="bg-ink relative h-svh max-h-svh w-full overflow-hidden"
    >
      {/* Architecture: a column rule and a soft lift — depth without animation. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_18%_22%,rgba(237,231,222,0.07),transparent_62%)]" />
        <div className="bg-hairline absolute inset-y-0 left-[58%] hidden w-px lg:block" />
      </div>

      <motion.div
        className="relative z-10 flex h-full max-h-svh flex-col"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.header
          className="shell flex shrink-0 items-baseline justify-between gap-6 pt-24 pb-3"
          variants={variants.container(heavyMotion)}
          initial="hidden"
          animate={introDone ? 'visible' : 'hidden'}
        >
          <motion.p variants={variants.riseItem(heavyMotion)} className="label">
            <span className="text-signal">00</span>
            <span className="text-ash"> — Start</span>
          </motion.p>
          <motion.p
            variants={variants.riseItem(heavyMotion)}
            className="label hidden text-right sm:block"
          >
            {personal.location}
          </motion.p>
        </motion.header>

        <Hairline className="shell shrink-0" tone="default" />

        <div className="shell grid min-h-0 flex-1 grid-cols-12 items-end gap-x-6 gap-y-5 py-4 pb-12 md:gap-y-6 md:py-5 md:pb-14 lg:py-6">
          <div className="relative col-span-12 md:col-span-7">
            <h1 className="font-display text-hero-name relative isolate max-w-[12ch]">
              {/* Ghost sits slightly down-right of the live type so it peeks out;
                  em keeps the offset proportional when display size changes. */}
              <motion.span
                aria-hidden
                className="text-ash pointer-events-none absolute inset-0 z-0 block select-none"
                initial={false}
                animate={
                  introDone
                    ? { opacity: heavyMotion ? 0.16 : 0.12, x: '0.11em', y: '0.045em' }
                    : { opacity: heavyMotion ? 0.24 : 0.16, x: '0.15em', y: '0.07em' }
                }
                transition={{ duration: duration.cinematic, ease: ease.drift }}
              >
                <span className="block">{firstName}</span>
                {lastName ? (
                  <span className="mt-1 block italic lg:mt-2">{lastName}</span>
                ) : null}
              </motion.span>

              <span className="relative z-10 block">
                {introDone ? (
                  <>
                    <RevealText as="span" type="words" className="text-bone block">
                      {firstName}
                    </RevealText>
                    {lastName ? (
                      <RevealText
                        as="span"
                        type="words"
                        delay={stagger.headline}
                        className="text-ash mt-1 block italic lg:mt-2"
                      >
                        {lastName}
                      </RevealText>
                    ) : null}
                  </>
                ) : (
                  <>
                    <span className="text-bone block opacity-0">{firstName}</span>
                    {lastName ? (
                      <span className="text-ash mt-1 block italic opacity-0 lg:mt-2">
                        {lastName}
                      </span>
                    ) : null}
                  </>
                )}
              </span>
            </h1>

            <motion.div
              variants={variants.container(heavyMotion)}
              initial="hidden"
              animate={introDone ? 'visible' : 'hidden'}
              transition={{ delayChildren: delay.afterHeadline, staggerChildren: stagger.items }}
              className="mt-4 md:mt-5 lg:mt-6"
            >
              <motion.div variants={variants.riseItem(heavyMotion)}>
                <Hairline tone="signal" className="mb-3 max-w-[3.5rem]" delay={0} />
                <p className="label text-bone max-w-[26ch]">{personal.title}</p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="col-span-12 flex flex-col gap-5 md:col-span-4 md:col-start-9 md:gap-6"
            variants={variants.container(heavyMotion)}
            initial="hidden"
            animate={introDone ? 'visible' : 'hidden'}
            transition={{ delayChildren: delay.afterHeadline, staggerChildren: stagger.items }}
          >
            <motion.p
              variants={variants.riseItem(heavyMotion)}
              className="text-bone-dim max-w-[34ch] text-[0.9375rem]"
            >
              {personal.description}
            </motion.p>

            <motion.div
              variants={variants.riseItem(heavyMotion)}
              className="flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <MagneticButton
                onClick={scrollToWork}
                data-cursor-label="Scroll"
                className="border-hairline-strong hover:border-signal hover:text-signal rounded-full border px-7 py-3 transition-colors duration-300 ease-(--ease-snap)"
                contentClassName="label text-bone"
              >
                See projects
              </MagneticButton>

              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {socialLinks
                  .filter((link) => link.name !== 'Email')
                  .map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-cursor="link"
                        className="label hover:text-bone group inline-flex items-center gap-1 transition-colors duration-300 ease-(--ease-snap)"
                      >
                        {link.name}
                        <span className="text-signal transition-transform duration-300 ease-(--ease-snap) group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          &#8599;
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </motion.div>

            <motion.dl
              variants={variants.riseItem(heavyMotion)}
              className="border-t border-t-[color:var(--color-hairline)] flex gap-10 pt-4 md:pt-5"
            >
              <div>
                <dt className="label">Projects</dt>
                <dd className="font-mono text-lead tabular-nums">{stats.projects}+</dd>
              </div>
              <div>
                <dt className="label">Years</dt>
                <dd className="font-mono text-lead tabular-nums">{stats.experience}+</dd>
              </div>
            </motion.dl>
          </motion.div>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-5 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ ...transition.fade, delay: delay.afterIntro }}
        >
          <div className="shell flex items-end justify-between gap-6">
            <p className="label pointer-events-auto sm:hidden">{personal.location}</p>
            <div aria-hidden className="ml-auto hidden items-center gap-3 md:flex">
              <span className="label text-[0.5625rem]">Scroll</span>
              <motion.span
                className="bg-hairline-strong block h-12 w-px origin-top"
                animate={inView ? { scaleY: [0.25, 1, 0.25] } : { scaleY: 0.25 }}
                transition={{ duration: duration.loop, ease: ease.collapse, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
