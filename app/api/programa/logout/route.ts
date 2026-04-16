import { cookies } from 'next/headers'
import { getSessionCookieName } from '@/lib/programa-auth'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(getSessionCookieName())
  return Response.json({ success: true })
}
