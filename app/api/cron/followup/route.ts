import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { emailTemplate } from '@/lib/email-template'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_LINK

// Textos por nivel para email 2 (3-5 horas después)
const EMAIL2_CONTENT: Record<string, { subject: string; intro: string; cta: string }> = {
  verde: {
    subject: 'Una técnica para ahora mismo',
    intro: 'Hace unas horas hiciste el test. Tu nivel verde significa que tu sistema nervioso todavía tiene margen — y ese margen se aprovecha mejor cuanto antes.',
    cta: 'Quiero el Protocolo ahora →'
  },
  amber: {
    subject: 'Una técnica para ahora mismo',
    intro: 'Hace unas horas hiciste el test. Tu nivel ámbar significa que llevas tiempo en activación crónica. Antes de que decidas si el Protocolo es para ti, quiero que pruebes algo.',
    cta: 'Activar mi nervio vago →'
  },
  rojo: {
    subject: 'Una técnica para ahora mismo',
    intro: 'Hace unas horas hiciste el test. Tu nivel rojo significa que tu sistema nervioso lleva tiempo en modo supervivencia. Antes de que decidas si el Protocolo es para ti, quiero que pruebes algo ahora mismo.',
    cta: 'Empezar hoy →'
  }
}

// Textos por nivel para email 3 (24 horas después)
const EMAIL3_CONTENT: Record<string, { subject: string; body: string; cta: string }> = {
  verde: {
    subject: 'Último recordatorio',
    body: 'Ayer hiciste el test y viste tu resultado. El precio de acceso diagnóstico que desbloqueaste expira hoy. Mañana el acceso al Protocolo vuelve al precio estándar.',
    cta: 'Quiero el Protocolo ahora →'
  },
  amber: {
    subject: 'El precio de acceso expira hoy',
    body: 'Ayer hiciste el test. Tu nivel ámbar sigue activo — el sistema nervioso no se regula solo con el tiempo. El precio de acceso diagnóstico que desbloqueaste expira hoy.',
    cta: 'Activar mi nervio vago →'
  },
  rojo: {
    subject: 'Último aviso — expira hoy',
    body: 'Ayer hiciste el test. Tu nivel rojo no mejora con el tiempo — mejora con la herramienta correcta. El precio de acceso diagnóstico expira hoy. Mañana sube.',
    cta: 'Empezar hoy →'
  }
}

function buildEmail2Html(level: string): string {
  const content = EMAIL2_CONTENT[level] || EMAIL2_CONTENT.rojo
  const body = `
    ${content.intro}
    <br><br>
    <div style="background:#F4EFE6;border-left:3px solid #2B7A8B;
                border-radius:0 8px 8px 0;padding:20px 24px;margin:8px 0 20px">
      <p style="font-size:14px;font-weight:500;color:#1C3D50;
                margin:0 0 12px;font-family:Arial,sans-serif">
        Técnica 1 · La Espiración Larga · 30 segundos
      </p>
      <p style="font-size:14px;color:#5F5E5A;line-height:1.8;
                margin:0;font-family:Arial,sans-serif">
        Inspira por la nariz contando 4 tiempos.<br>
        Espira por la boca contando 8 tiempos —<br>
        como si soplases sobre una vela sin apagarla.<br>
        Repite 5 veces.<br><br>
        <strong style="color:#1C3D50">
          Si en el ciclo 3 notas que los hombros caen solos — eso es el nervio vago respondiendo.
        </strong>
      </p>
    </div>
    <br>
    Las otras 6 técnicas están en el Protocolo.
    Acceso inmediato por 7€.
  `
  return emailTemplate({
    title: 'Una técnica para ahora mismo.',
    body,
    ctaText: content.cta,
    ctaUrl: STRIPE_LINK!,
    footerNote: 'Acceso inmediato · PDF descargable · 7€ pago único',
  })
}

function buildEmail3Html(level: string): string {
  const content = EMAIL3_CONTENT[level] || EMAIL3_CONTENT.rojo
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

  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)

  const { data: leads2 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 0)
    .neq('level', 'directo')
    .lte('first_email_at', threeHoursAgo.toISOString())

  for (const lead of leads2 || []) {
    try {
      const content = EMAIL2_CONTENT[lead.level] || EMAIL2_CONTENT.rojo
      await resend.emails.send({
        from: 'IEN · Instituto Español de Neurobienestar <protocolo@neurobienestar.institute>',
        to: lead.email,
        subject: content.subject,
        html: buildEmail2Html(lead.level)
      })
      await supabase
        .from('leads')
        .update({ email_sequence: 1 })
        .eq('id', lead.id)
      results.email2++
    } catch (err) {
      console.error('Email 2 error:', lead.email, err)
      results.errors++
    }
  }

  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const { data: leads3 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 1)
    .neq('level', 'directo')
    .lte('first_email_at', twentyFourHoursAgo.toISOString())

  for (const lead of leads3 || []) {
    try {
      const content = EMAIL3_CONTENT[lead.level] || EMAIL3_CONTENT.rojo
      await resend.emails.send({
        from: 'IEN · Instituto Español de Neurobienestar <protocolo@neurobienestar.institute>',
        to: lead.email,
        subject: content.subject,
        html: buildEmail3Html(lead.level)
      })
      await supabase
        .from('leads')
        .update({ email_sequence: 2 })
        .eq('id', lead.id)
      results.email3++
    } catch (err) {
      console.error('Email 3 error:', lead.email, err)
      results.errors++
    }
  }

  console.log('Cron followup:', results)
  return Response.json({ success: true, ...results })
}
