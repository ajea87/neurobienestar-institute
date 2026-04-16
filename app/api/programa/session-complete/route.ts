import { createClient } from '@supabase/supabase-js'
import { getSessionEmail } from '@/lib/programa-auth'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const email = await getSessionEmail()
  if (!email) {
    return Response.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { day, diary } = await req.json()

  if (!day || typeof day !== 'number' || day < 1 || day > 21) {
    return Response.json({ error: 'Día inválido' }, { status: 400 })
  }

  const { error } = await supabase
    .from('program_progress')
    .upsert(
      {
        email,
        day,
        diary: diary || null,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'email,day' }
    )

  if (error) {
    console.error('session-complete error:', error)
    return Response.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return Response.json({ success: true })
}
