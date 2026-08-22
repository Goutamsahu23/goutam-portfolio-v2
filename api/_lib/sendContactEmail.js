import nodemailer from 'nodemailer'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

/** Sends a portfolio contact form message through SMTP (credentials stay server-side). */
export async function sendContactEmail({ name, email, subject, message }) {
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw new Error('All fields are required')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new Error('Invalid email address')
  }

  const host = requireEnv('MAIL_HOST')
  const port = Number(process.env.MAIL_PORT || 587)
  const user = requireEnv('MAIL_USER')
  const pass = requireEnv('MAIL_PASS').replace(/\s/g, '')
  const to = requireEnv('EMAIL')

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: `"Portfolio — ${name.trim()}" <${user}>`,
    to,
    replyTo: email.trim(),
    subject: `[Portfolio] ${subject.trim()}`,
    text: `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
    html: `<p><strong>From:</strong> ${name.trim()} &lt;${email.trim()}&gt;</p><p><strong>Subject:</strong> ${subject.trim()}</p><p>${message.trim().replace(/\n/g, '<br>')}</p>`,
  })
}
