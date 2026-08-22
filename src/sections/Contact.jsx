import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import portfolioData from '../../data.json'
import Section from '../components/primitives/Section'
import SectionHead from '../components/primitives/SectionHead'
import RevealText from '../components/primitives/RevealText'
import Reveal from '../components/primitives/Reveal'
import MagneticButton from '../components/primitives/MagneticButton'
import { transition } from '../lib/motion'
import { SECTIONS } from '../lib/sections'

const meta = SECTIONS.find((section) => section.id === 'contact')

const FIELD =
  'w-full border-b border-b-ink/25 bg-transparent py-4 text-ink placeholder:text-ink/60 focus:border-b-ink focus:outline-none transition-colors duration-300 ease-(--ease-snap)'

/**
 * 06 — Contact. The section inverts to paper: the last thing on the page should
 * not look like the rest of it. The address is the primary element and the form
 * is the fallback for people who would rather type here.
 */
export default function Contact() {
  const { personal, socialLinks } = portfolioData

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' })

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // Imported on submit: the SDK is dead weight for the 99% of visitors who
      // never send anything.
      const { default: emailjs } = await import('@emailjs/browser')
      emailjs.init(EMAILJS_PUBLIC_KEY)

      const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: personal.email,
      })

      if (result.text === 'OK') {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! I will get back to you soon.',
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus({
        type: 'error',
        message:
          'Sorry, there was an error sending your message. Please try again or contact me directly via email.',
      })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000)
    }
  }

  return (
    <Section id="contact" tone="bone">
      <div className="shell">
        <SectionHead
          index={meta.index}
          label={meta.label}
          tone="bone"
          meta={personal.location}
          className="mb-(--spacing-section)"
        />

        <div className="grid grid-cols-12 gap-x-6 gap-y-20">
          <div className="col-span-12 lg:col-span-7">
            <RevealText as="p" type="words" className="font-display text-pull text-ink/70 max-w-[24ch]">
              Open to engineering roles and collaborations. The fastest way to reach me is email.
            </RevealText>

            <a
              href={`mailto:${personal.email}`}
              data-cursor="link"
              data-cursor-label="Write"
              className="group mt-12 inline-block max-w-full"
            >
              <span className="font-display text-title text-ink block leading-none break-words">
                {personal.email}
              </span>
              <span
                aria-hidden
                className="bg-ink mt-3 block h-px origin-left scale-x-0 transition-transform duration-700 ease-(--ease-signal) group-hover:scale-x-100"
              />
            </a>

            <dl className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3">
              {personal.phone ? (
                <div>
                  <dt className="label text-ink/70">Phone</dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${personal.phone.replace(/\s/g, '')}`}
                      data-cursor="link"
                      className="text-ink/80 hover:text-ink transition-colors duration-300 ease-(--ease-snap)"
                    >
                      {personal.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="label text-ink/70">Based in</dt>
                <dd className="text-ink/80 mt-2">{personal.location}</dd>
              </div>
              <div>
                <dt className="label text-ink/70">Elsewhere</dt>
                <dd className="mt-2 flex flex-col gap-1">
                  {socialLinks
                    .filter((link) => link.name !== 'Email')
                    .map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-cursor="link"
                        className="text-ink/80 hover:text-ink transition-colors duration-300 ease-(--ease-snap)"
                      >
                        {link.name} &#8599;
                      </a>
                    ))}
                </dd>
              </div>
            </dl>
          </div>

          <Reveal className="col-span-12 lg:col-span-4 lg:col-start-9">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <p className="label text-ink/70 mb-6">Or send a note</p>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                data-cursor="text"
                className={FIELD}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                data-cursor="text"
                className={FIELD}
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                data-cursor="text"
                className={FIELD}
              />
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                data-cursor="text"
                className={`${FIELD} resize-none`}
              />

              <MagneticButton
                type="submit"
                disabled={isSubmitting}
                className="border-ink/30 hover:border-ink mt-8 self-start rounded-full border px-7 py-3 transition-colors duration-300 ease-(--ease-snap) disabled:opacity-40"
                contentClassName="label text-ink"
              >
                {isSubmitting ? 'Sending' : 'Send'}
              </MagneticButton>

              <AnimatePresence>
                {submitStatus.message ? (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={transition.fade}
                    role="status"
                    className={`mt-6 text-[0.9375rem] ${
                      submitStatus.type === 'success' ? 'text-ink' : 'text-red-800'
                    }`}
                  >
                    {submitStatus.message}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
