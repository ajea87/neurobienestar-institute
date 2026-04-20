import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { emailTemplate } from "./email-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const BUCKET = "protocolos";
const FILE = "protocolo-nervio-vago.pdf";

export async function sendProtocolEmail(email: string): Promise<void> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(FILE);

  if (error || !data) {
    throw new Error(`Error descargando PDF desde Supabase Storage: ${error?.message}`);
  }

  const arrayBuffer = await data.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);

  const { error: sendError } = await resend.emails.send({
    from: "IEN <protocolos@neurobienestar.institute>",
    to: email,
    subject: "Tu acceso está aquí",
    html: emailTemplate({
      title: 'Tu Protocolo Nervio Vago está aquí.',
      body: `
        Encontrarás el PDF adjunto a este email. Son las 7 micro-activaciones
        del Método MAV, ordenadas por impacto, con instrucciones exactas de aplicación.
        <br><br>
        Puedes empezar hoy. Algunas técnicas producen un cambio perceptible
        en menos de 60 segundos.
        <br><br>
        <div style="background:#F4EFE6;border-left:3px solid #2B7A8B;
                    padding:20px 24px;margin:24px 0;border-radius:0 8px 8px 0">
          <p style="font-size:17px;font-style:italic;color:#1C3D50;
                    margin:0;line-height:1.6;font-family:Georgia,serif">
            "El tono vagal se construye por frecuencia, no por duración."
          </p>
        </div>
      `,
      footerNote: 'El contenido de este protocolo es informativo y no constituye asesoramiento médico.',
    }),
    attachments: [
      {
        filename: "Protocolo-Nervio-Vago-IEN.pdf",
        content: pdfBuffer,
      },
    ],
  });

  if (sendError) {
    throw new Error(`Error enviando email con Resend: ${sendError.message}`);
  }
}

type ResultLevel = 'verde' | 'amber' | 'rojo'

const RESULT_CONTENT: Record<ResultLevel, { subject: string; headline: string; body: string; cta: string }> = {
  verde: {
    subject: 'Tu resultado del test · Señales tempranas',
    headline: 'Tu sistema nervioso todavía avisa — y eso es una ventaja.',
    body: `Lo que muestran tus respuestas es importante: tu nervio vago ya está enviando señales de que algo no está del todo equilibrado. No es una crisis. Es una oportunidad.
<br><br>
La mayoría de personas que llegan aquí con un nivel como el tuyo ignoran estas señales durante meses — hasta que el sistema se satura. Tú has llegado antes.
<br><br>
El Protocolo Nervio Vago es exactamente para este momento: cuando el cuerpo todavía tiene margen para reajustarse con facilidad. Son 7 técnicas que puedes aplicar hoy — algunas en menos de 60 segundos.`,
    cta: 'Quiero el Protocolo ahora →',
  },
  amber: {
    subject: 'Tu resultado del test · Tu nervio vago lleva tiempo pidiendo atención',
    headline: 'Estás funcionando. Pero no del todo.',
    body: `Las respuestas que diste describen algo que muy poca gente consigue poner en palabras: esa sensación de estar funcionando, pero no del todo. De dormir y no descansar. De querer desconectar y no poder.
<br><br>
No es agotamiento normal. No es estrés pasajero. Es tu sistema nervioso autónomo en activación crónica — y tiene un nombre concreto: nervio vago inhibido.
<br><br>
El Protocolo Nervio Vago reúne las 7 técnicas más efectivas para activar el nervio vago de forma voluntaria. Sin terminología médica. Sin equipamiento. Algunas producen un cambio perceptible en menos de un minuto.
<br><br>
El primer paso es siempre el más difícil. Este puede ser hoy.`,
    cta: 'Activar mi nervio vago →',
  },
  rojo: {
    subject: 'Tu resultado del test · Tu cuerpo lleva demasiado tiempo en modo supervivencia',
    headline: 'Tu sistema nervioso no sabe cómo salir solo.',
    body: `Lo que describiste en el test no es "mucho estrés". Es un sistema nervioso autónomo que ha estado en alerta durante tanto tiempo que ya no sabe cómo salir solo.
<br><br>
El cansancio que no se va con dormir. La digestión que reacciona a cualquier tensión. La mente que sigue girando cuando el cuerpo ya no puede más.
<br><br>
Esto no lo causa la falta de voluntad. Lo causa un nervio — el nervio vago — que lleva meses o años sin activarse correctamente.
<br><br>
La buena noticia es que este nervio responde. Y lo hace rápido cuando sabes cómo tocarlo.
<br><br>
Si hay un momento para hacer esto, es ahora. Antes de que el nivel rojo sea el único que conozcas.`,
    cta: 'Empezar hoy →',
  },
}

// ─── Follow-up email 2: técnica gratis ───────────────────────────────────────

const FOLLOWUP_CONTENT: Record<string, { subject: string; intro: string; cta: string }> = {
  verde: {
    subject: 'Una técnica para ahora mismo',
    intro: 'Hace unas horas hiciste el test. Tu nivel verde significa que tu sistema nervioso todavía tiene margen — y ese margen se aprovecha mejor cuanto antes.',
    cta: 'Quiero el Protocolo ahora →',
  },
  amber: {
    subject: 'Una técnica para ahora mismo',
    intro: 'Hace unas horas hiciste el test. Tu nivel ámbar significa que llevas tiempo en activación crónica. Antes de que decidas si el Protocolo es para ti, quiero que pruebes algo.',
    cta: 'Activar mi nervio vago →',
  },
  rojo: {
    subject: 'Una técnica para ahora mismo',
    intro: 'Hace unas horas hiciste el test. Tu nivel rojo significa que tu sistema nervioso lleva tiempo en modo supervivencia. Antes de que decidas si el Protocolo es para ti, quiero que pruebes algo ahora mismo.',
    cta: 'Empezar hoy →',
  },
}

export function followUpEmailPreview(level: string): { subject: string; bodyPreview: string } {
  const c = FOLLOWUP_CONTENT[level] ?? FOLLOWUP_CONTENT.rojo
  return { subject: c.subject, bodyPreview: c.intro.substring(0, 150) }
}

export async function sendFollowUpTechniqueEmail(email: string, level: string): Promise<void> {
  const c = FOLLOWUP_CONTENT[level] ?? FOLLOWUP_CONTENT.rojo
  const body = `
    ${c.intro}
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
  const { error } = await resend.emails.send({
    from: 'IEN · Instituto Español de Neurobienestar <protocolo@neurobienestar.institute>',
    to: email,
    subject: c.subject,
    html: emailTemplate({
      title: 'Una técnica para ahora mismo.',
      body,
      ctaText: c.cta,
      ctaUrl: process.env.NEXT_PUBLIC_STRIPE_LINK!,
      footerNote: 'Acceso inmediato · PDF descargable · 7€ pago único',
    }),
  })
  if (error) throw new Error(`Resend error: ${error.message}`)
}

// ─── Result email ─────────────────────────────────────────────────────────────

export async function sendResultEmail(email: string, level: string): Promise<void> {
  if (level === 'directo' || !(level in RESULT_CONTENT)) return

  const content = RESULT_CONTENT[level as ResultLevel]
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_LINK!

  const pdBody = `
    ${content.body}
    <br><br>
    <div style="border-top:1px solid rgba(28,61,80,0.12);
                margin-top:8px;padding-top:20px;
                font-size:14px;color:#5A6E75;
                font-family:Arial,sans-serif;line-height:1.7">
      <strong>PD:</strong> Si quieres resultados permanentes, el Programa de Activación
      de 21 días estructura las mismas técnicas en una práctica progresiva diaria.
      <a href="https://neurobienestar.institute/programa-21-dias"
         style="color:#2B7A8B">neurobienestar.institute/programa-21-dias</a>
    </div>
  `

  const { error: sendError } = await resend.emails.send({
    from: 'IEN <protocolos@neurobienestar.institute>',
    to: email,
    subject: content.subject,
    html: emailTemplate({
      title: content.headline,
      body: pdBody,
      ctaText: content.cta,
      ctaUrl: stripeLink,
      footerNote: 'Sin spam. Puedes darte de baja en cualquier momento.',
    }),
  })

  if (sendError) {
    throw new Error(`Error enviando email de resultado con Resend: ${sendError.message}`)
  }
}
