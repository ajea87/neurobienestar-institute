import { redirect } from 'next/navigation'

// The actual token verification is handled by /api/programa/verify-token
// This page just redirects there so the URL is /programa/auth?token=...
export default async function ProgramaAuth({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    redirect('/programa?error=invalid')
  }

  redirect(`/api/programa/verify-token?token=${token}`)
}
