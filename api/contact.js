import { sendContactEmail } from './_lib/sendContactEmail.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    await sendContactEmail(body)
    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact mail error:', error.message)
    res.status(500).json({ ok: false, error: 'Failed to send message' })
  }
}
