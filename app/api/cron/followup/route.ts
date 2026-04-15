import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

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
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#F4EFE6;font-family:Georgia,serif">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px">
        <div style="background:#1C3D50;padding:24px 32px;border-radius:8px 8px 0 0;text-align:center">
          <div style="color:#F4EFE6;font-size:20px;letter-spacing:0.12em">IEN</div>
          <div style="color:rgba(244,239,230,0.45);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;margin-top:4px">neurobienestar.institute</div>
        </div>
        <div style="background:white;padding:36px 32px">
          <p style="font-size:16px;color:#1A2326;line-height:1.8;margin:0 0 20px">
            ${content.intro}
          </p>
          <div style="background:#F4EFE6;border-left:3px solid #2B7A8B;border-radius:0 8px 8px 0;padding:20px 24px;margin:24px 0">
            <p style="font-size:14px;font-weight:500;color:#1C3D50;margin:0 0 12px">
              Técnica 1 · La Espiración Larga · 30 segundos
            </p>
            <p style="font-size:14px;color:#5F5E5A;line-height:1.8;margin:0">
              Inspira por la nariz contando 4 tiempos.<br>
              Espira por la boca contando 8 tiempos —<br>
              como si soplases sobre una vela sin apagarla.<br>
              Repite 5 veces.<br><br>
              <strong style="color:#1C3D50">Si en el ciclo 3 notas que los hombros caen solos — eso es el nervio vago respondiendo.</strong>
            </p>
          </div>
          <p style="font-size:15px;color:#1A2326;line-height:1.8;margin:0 0 28px">
            Las otras 6 técnicas están en el Protocolo.<br>
            Acceso inmediato por 7€.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="${STRIPE_LINK}"
               style="background:#B8722E;color:#F4EFE6;padding:16px 40px;border-radius:30px;text-decoration:none;font-size:15px;display:inline-block">
              ${content.cta}
            </a>
          </div>
          <p style="font-size:12px;color:#8E9CA3;text-align:center;margin:0">
            Acceso inmediato · PDF descargable · 7€ pago único
          </p>
        </div>
        <div style="background:#1C3D50;padding:20px 32px;border-radius:0 0 8px 8px;text-align:center">
          <p style="color:rgba(244,239,230,0.4);font-size:11px;margin:0;line-height:1.6">
            © 2025 Instituto Español de Neurobienestar<br>
            neurobienestar.institute
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function buildEmail3Html(level: string): string {
  const content = EMAIL3_CONTENT[level] || EMAIL3_CONTENT.rojo
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#F4EFE6;font-family:Georgia,serif">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px">
        <div style="background:#1C3D50;padding:24px 32px;border-radius:8px 8px 0 0;text-align:center">
          <div style="color:#F4EFE6;font-size:20px;letter-spacing:0.12em">IEN</div>
          <div style="color:rgba(244,239,230,0.45);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;margin-top:4px">neurobienestar.institute</div>
        </div>
        <div style="background:white;padding:36px 32px">
          <p style="font-size:16px;color:#1A2326;line-height:1.8;margin:0 0 24px">
            ${content.body}
          </p>
          <div style="background:#FCEBEB;border-left:3px solid #E24B4A;border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 28px">
            <p style="font-size:13px;color:#791F1F;margin:0">
              El precio de acceso diagnóstico de 7€ expira hoy.<br>
              Mañana el acceso vuelve al precio estándar de 19€.
            </p>
          </div>
          <div style="text-align:center;margin:28px 0">
            <div style="margin-bottom:12px">
              <span style="font-size:16px;color:#8E9CA3;text-decoration:line-through;margin-right:10px">19€</span>
              <span style="font-size:28px;color:#1C3D50">7€</span>
            </div>
            <a href="${STRIPE_LINK}"
               style="background:#B8722E;color:#F4EFE6;padding:16px 40px;border-radius:30px;text-decoration:none;font-size:15px;display:inline-block">
              ${content.cta}
            </a>
          </div>
          <p style="font-size:12px;color:#8E9CA3;text-align:center;margin:0">
            Acceso inmediato · PDF descargable · Garantía 30 días
          </p>
        </div>
        <div style="background:#1C3D50;padding:20px 32px;border-radius:0 0 8px 8px;text-align:center">
          <p style="color:rgba(244,239,230,0.4);font-size:11px;margin:0;line-height:1.6">
            © 2025 Instituto Español de Neurobienestar<br>
            neurobienestar.institute
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function GET(req: Request) {
  // Verificar que viene de Vercel Cron
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { email2: 0, email3: 0, errors: 0 }

  // Email 2: leads entre 3 y 5 horas, sequence = 0
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000)

  const { data: leads2 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 0)
    .neq('level', 'directo')
    .gte('first_email_at', fiveHoursAgo.toISOString())
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

  // Email 3: leads entre 22 y 26 horas, sequence = 1
  const twentyTwoHoursAgo = new Date(now.getTime() - 22 * 60 * 60 * 1000)
  const twentySixHoursAgo = new Date(now.getTime() - 26 * 60 * 60 * 1000)

  const { data: leads3 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 1)
    .neq('level', 'directo')
    .gte('first_email_at', twentySixHoursAgo.toISOString())
    .lte('first_email_at', twentyTwoHoursAgo.toISOString())

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
