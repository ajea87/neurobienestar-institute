import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { emailTemplate } from '@/lib/email-template'
import { sendFollowUpTechniqueEmail } from '@/lib/send-email'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_LINK

const EMAIL3_CONTENT: Record<string, { subject: string; body: string; cta: string }> = {
  verde: {
    subject: 'Último recordatorio',
    body: 'Ayer hiciste el test y viste tu resultado. El precio de acceso diagnóstico que desbloqueaste expira hoy. Mañana el acceso al Protocolo vuelve al precio estándar.',
    cta: 'Quiero el Protocolo ahora →',
  },
  amber: {
    subject: 'El precio de acceso expira hoy',
    body: 'Ayer hiciste el test. Tu nivel ámbar sigue activo — el sistema nervioso no se regula solo con el tiempo. El precio de acceso diagnóstico que desbloqueaste expira hoy.',
    cta: 'Activar mi nervio vago →',
  },
  rojo: {
    subject: 'Último aviso — expira hoy',
    body: 'Ayer hiciste el test. Tu nivel rojo no mejora con el tiempo — mejora con la herramienta correcta. El precio de acceso diagnóstico expira hoy. Mañana sube.',
    cta: 'Empezar hoy →',
  },
}

function buildEmail3Html(level: string): string {
  const content = EMAIL3_CONTENT[level] ?? EMAIL3_CONTENT.rojo
  const body = `
    ${content.body}
    <br><br>
    <div style="background:#FCEBEB;border-left:3px solid #E24B4A;
                border-radius:0 8px 8px 0;padding:16px 20px;margin:8px 0 20px">
      <p style="font-size:13px;color:#791F1F;margin:0;font-family:Arial,sans-serif">
        El precio de acceso diagnóstico de 7€ expira hoy.<br>
        Mañana el acceso vuelve al precio estándar de 19€.
      </p>
    </div>
    <br>
    <div style="text-align:center;margin:8px 0">
      <span style="font-size:16px;color:#8E9CA3;text-decoration:line-through;
                   margin-right:10px;font-family:Arial,sans-serif">19€</span>
      <span style="font-size:28px;color:#1C3D50;font-family:Georgia,serif">7€</span>
    </div>
  `
  return emailTemplate({
    title: content.subject,
    body,
    ctaText: content.cta,
    ctaUrl: STRIPE_LINK!,
    footerNote: 'Acceso inmediato · PDF descargable · Garantía 30 días',
  })
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { email2: 0, email3: 0, errors: 0 }

  console.log('[cron/followup] start', { time: now.toISOString() })

  // Email 2: strict window 3h–24h after first_email_at
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const { data: leads2, error: err2 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 0)
    .neq('level', 'directo')
    .lte('first_email_at', threeHoursAgo.toISOString())
    .gte('first_email_at', twentyFourHoursAgo.toISOString())

  if (err2) console.error('[cron/followup] query email2 error', err2)
  console.log('[cron/followup] email2 candidates', { count: leads2?.length ?? 0 })

  for (const lead of leads2 ?? []) {
    try {
      await sendFollowUpTechniqueEmail(lead.email, lead.level)
      await supabase.from('leads').update({ email_sequence: 1 }).eq('id', lead.id)
      console.log('[cron/followup] email2 sent', { email: lead.email, level: lead.level })
      results.email2++
    } catch (err) {
      console.error('[cron/followup] email2 error', { email: lead.email, err })
      results.errors++
    }
  }

  // Email 3: strict window 24h–48h after first_email_at
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

  const { data: leads3, error: err3 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 1)
    .neq('level', 'directo')
    .lte('first_email_at', twentyFourHoursAgo.toISOString())
    .gte('first_email_at', fortyEightHoursAgo.toISOString())

  if (err3) console.error('[cron/followup] query email3 error', err3)
  console.log('[cron/followup] email3 candidates', { count: leads3?.length ?? 0 })

  for (const lead of leads3 ?? []) {
    try {
      const content = EMAIL3_CONTENT[lead.level] ?? EMAIL3_CONTENT.rojo
      await resend.emails.send({
        from: 'IEN · Instituto Español de Neurobienestar <protocolo@neurobienestar.institute>',
        to: lead.email,
        subject: content.subject,
        html: buildEmail3Html(lead.level),
      })
      await supabase.from('leads').update({ email_sequence: 2 }).eq('id', lead.id)
      console.log('[cron/followup] email3 sent', { email: lead.email, level: lead.level })
      results.email3++
    } catch (err) {
      console.error('[cron/followup] email3 error', { email: lead.email, err })
      results.errors++
    }
  }

  console.log('[cron/followup] done', results)
  return Response.json({ success: true, ...results })
}
