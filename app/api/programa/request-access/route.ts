import { createClient } from '@supabase/supabase-js'
import { sendMagicLinkEmail } from '@/lib/send-session-email'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Email requerido' }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  // Check program_access
  const { data: lead } = await supabase
    .from('leads')
    .select('email, program_access')
    .eq('email', normalizedEmail)
    .single()

  if (!lead || !lead.program_access) {
    // Generic message — don't reveal if email exists
    return Response.json({ success: true })
  }

  // Create magic link token (valid 30 min)
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

  await supabase.from('program_sessions').insert({
    email: normalizedEmail,
    token,
    expires_at: expiresAt.toISOString(),
    used: false,
  })

  await sendMagicLinkEmail(normalizedEmail, token)

  return Response.json({ success: true })
}
