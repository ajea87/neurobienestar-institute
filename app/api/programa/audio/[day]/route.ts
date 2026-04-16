import { createClient } from '@supabase/supabase-js'
import { getSessionEmail } from '@/lib/programa-auth'
import { PROGRAM_CONTENT } from '@/lib/programa-content'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const email = await getSessionEmail()
  if (!email) {
    return Response.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { day: dayParam } = await params
  const day = parseInt(dayParam, 10)

  if (isNaN(day) || day < 1 || day > 21) {
    return Response.json({ error: 'Día inválido' }, { status: 400 })
  }

  // Check that user has access to this day
  // Day 1 always unlocked; day N unlocked when day N-1 is completed
  if (day > 1) {
    const { data: prevProgress } = await supabase
      .from('program_progress')
      .select('day')
      .eq('email', email)
      .eq('day', day - 1)
      .single()

    if (!prevProgress) {
      return Response.json({ error: 'Día no desbloqueado' }, { status: 403 })
    }
  }

  const content = PROGRAM_CONTENT.find((d) => d.day === day)
  if (!content) {
    return Response.json({ error: 'Contenido no encontrado' }, { status: 404 })
  }

  // Generate signed URL valid for 2 hours
  const { data, error } = await supabase.storage
    .from('programa-audio')
    .createSignedUrl(content.audioFile, 7200)

  if (error || !data) {
    console.error('Signed URL error:', error)
    return Response.json({ error: 'Error generando URL' }, { status: 500 })
  }

  return Response.json({ url: data.signedUrl })
}
