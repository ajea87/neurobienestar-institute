import { redirect, notFound } from 'next/navigation'
import { getSessionEmail } from '@/lib/programa-auth'
import { createClient } from '@supabase/supabase-js'
import { PROGRAM_CONTENT } from '@/lib/programa-content'
import SessionPlayer from './SessionPlayer'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default async function DiaPage({
  params,
}: {
  params: Promise<{ n: string }>
}) {
  const email = await getSessionEmail()
  if (!email) redirect('/programa')

  const { n } = await params
  const day = parseInt(n, 10)

  if (isNaN(day) || day < 1 || day > 21) notFound()

  const content = PROGRAM_CONTENT.find((d) => d.day === day)
  if (!content) notFound()

  // Check if previous day is completed (day 1 always unlocked)
  if (day > 1) {
    const { data: prevProgress } = await supabase
      .from('program_progress')
      .select('day')
      .eq('email', email)
      .eq('day', day - 1)
      .single()

    if (!prevProgress) redirect('/programa/dashboard')
  }

  // Check if this day is already completed
  const { data: thisProgress } = await supabase
    .from('program_progress')
    .select('day, diary')
    .eq('email', email)
    .eq('day', day)
    .single()

  const isCompleted = !!thisProgress

  return (
    <SessionPlayer
      day={day}
      content={content}
      isCompleted={isCompleted}
      existingDiary={thisProgress?.diary || ''}
    />
  )
}
