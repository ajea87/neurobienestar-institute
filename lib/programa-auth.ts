import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const SESSION_COOKIE = 'ien_programa_session'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionToken) return null

  // Validate session token against program_sessions table
  const { data } = await supabase
    .from('program_sessions')
    .select('email, expires_at')
    .eq('token', sessionToken)
    .eq('used', true)
    .single()

  if (!data) return null
  if (new Date(data.expires_at) < new Date()) return null

  return data.email
}

export function getSessionCookieName() {
  return SESSION_COOKIE
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  }
}
