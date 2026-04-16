import { createClient } from '@supabase/supabase-js'
import { getSessionCookieName, getSessionCookieOptions } from '@/lib/programa-auth'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return Response.redirect(new URL('/programa?error=invalid', req.url))
  }

  // Look up token
  const { data: session } = await supabase
    .from('program_sessions')
    .select('id, email, expires_at, used')
    .eq('token', token)
    .single()

  if (!session || session.used) {
    return Response.redirect(new URL('/programa?error=invalid', req.url))
  }

  if (new Date(session.expires_at) < new Date()) {
    return Response.redirect(new URL('/programa?error=expired', req.url))
  }

  // Generate a long-lived session token (30 days)
  const sessionToken = crypto.randomBytes(48).toString('hex')
  const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  // Mark magic link as used, store new session token
  await supabase
    .from('program_sessions')
    .update({
      used: true,
      token: sessionToken,
      expires_at: sessionExpires.toISOString(),
    })
    .eq('id', session.id)

  const cookieStore = await cookies()
  cookieStore.set(getSessionCookieName(), sessionToken, getSessionCookieOptions())

  return Response.redirect(new URL('/programa/dashboard', req.url))
}
