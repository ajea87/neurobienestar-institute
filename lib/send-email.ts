import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const BUCKET = "protocolos";
const FILE = "protocolo-nervio-vago.pdf";

export async function sendProtocolEmail(email: string): Promise<void> {
  // 1. Descargar el PDF desde Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(FILE);

  if (error || !data) {
    throw new Error(`Error descargando PDF desde Supabase Storage: ${error?.message}`);
  }

  // 2. Convertir Blob a Buffer para adjuntarlo
  const arrayBuffer = await data.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);

  // 3. Enviar email con el PDF adjunto via Resend
  const { error: sendError } = await resend.emails.send({
    from: "IEN <protocolos@neurobienestar.institute>",
    to: email,
    subject: "Tu acceso está aquí",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A2326;">
        <div style="display:none;max-height:0;overflow:hidden;">
          En los próximos minutos tu sistema nervioso ya puede empezar a cambiar.
        </div>
        <div style="background: #1C3D50; padding: 32px 40px; text-align: center;">
          <p style="color: #F4EFE6; font-size: 22px; letter-spacing: 0.15em; margin: 0;">IEN</p>
          <p style="color: rgba(244,239,230,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0;">neurobienestar.institute</p>
        </div>

        <div style="padding: 40px; background: #F4EFE6;">
          <h1 style="font-size: 26px; font-weight: 500; color: #1C3D50; line-height: 1.3; margin: 0 0 20px;">
            Tu Protocolo Nervio Vago está aquí.
          </h1>

          <p style="font-family: sans-serif; font-size: 16px; line-height: 1.8; color: #1A2326; margin: 0 0 16px;">
            Encontrarás el PDF adjunto a este email. Son las 7 micro-activaciones
            del Método MAV, ordenadas por impacto, con instrucciones exactas de aplicación.
          </p>

          <p style="font-family: sans-serif; font-size: 16px; line-height: 1.8; color: #1A2326; margin: 0 0 24px;">
            Puedes empezar hoy. Algunas técnicas producen un cambio perceptible
            en menos de 60 segundos.
          </p>

          <div style="background: white; border-left: 3px solid #2B7A8B; padding: 20px 24px; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <p style="font-size: 18px; font-style: italic; color: #1C3D50; margin: 0; line-height: 1.6;">
              "El tono vagal se construye por frecuencia, no por duración."
            </p>
          </div>

          <p style="font-family: sans-serif; font-size: 14px; color: #8E9CA3; margin: 24px 0 0; line-height: 1.6;">
            Instituto Español de Neurobienestar · Método MAV<br>
            <a href="https://neurobienestar.institute" style="color: #2B7A8B;">neurobienestar.institute</a>
          </p>
        </div>

        <div style="background: #1C3D50; padding: 20px 40px; text-align: center;">
          <p style="font-family: sans-serif; font-size: 11px; color: rgba(244,239,230,0.4); margin: 0; line-height: 1.6;">
            El contenido de este protocolo es informativo y no constituye asesoramiento médico.<br>
            Si deseas darte de baja, responde a este email con "baja".
          </p>
        </div>
      </div>
    `,
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
    cta: 'Necesito este protocolo →',
  },
}

export async function sendResultEmail(email: string, level: string): Promise<void> {
  if (level === 'directo' || !(level in RESULT_CONTENT)) return

  const content = RESULT_CONTENT[level as ResultLevel]
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_LINK!

  const { error: sendError } = await resend.emails.send({
    from: 'IEN <protocolos@neurobienestar.institute>',
    to: email,
    subject: content.subject,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A2326;">
        <div style="display:none;max-height:0;overflow:hidden;">
          ${content.subject}
        </div>

        <div style="background: #1C3D50; padding: 32px 40px; text-align: center;">
          <p style="color: #F4EFE6; font-size: 22px; letter-spacing: 0.15em; margin: 0;">IEN</p>
          <p style="color: rgba(244,239,230,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0;">neurobienestar.institute</p>
        </div>

        <div style="padding: 40px; background: #F4EFE6;">
          <h1 style="font-size: 24px; font-weight: 500; color: #1C3D50; line-height: 1.3; margin: 0 0 20px;">
            ${content.headline}
          </h1>

          <p style="font-family: sans-serif; font-size: 16px; line-height: 1.8; color: #1A2326; margin: 0 0 28px;">
            ${content.body}
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${stripeLink}"
               style="display: inline-block; background: #B8722E; color: #ffffff; font-family: sans-serif; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 4px; text-decoration: none; letter-spacing: 0.02em;">
              ${content.cta}
            </a>
          </div>

          <div style="border-top: 1px solid rgba(28,61,80,0.15); margin-top: 32px; padding-top: 24px;">
            <p style="font-family: sans-serif; font-size: 14px; line-height: 1.7; color: #5A6E75; margin: 0;">
              <strong>PD:</strong> Si quieres resultados permanentes, el Programa de Activación de 21 días estructura las mismas técnicas en una práctica progresiva diaria.
              <a href="https://neurobienestar.institute/programa-21-dias" style="color: #2B7A8B;">neurobienestar.institute/programa-21-dias</a>
            </p>
          </div>

          <p style="font-family: sans-serif; font-size: 14px; color: #8E9CA3; margin: 24px 0 0; line-height: 1.6;">
            Instituto Español de Neurobienestar · Método MAV<br>
            <a href="https://neurobienestar.institute" style="color: #2B7A8B;">neurobienestar.institute</a>
          </p>
        </div>

        <div style="background: #1C3D50; padding: 20px 40px; text-align: center;">
          <p style="font-family: sans-serif; font-size: 11px; color: rgba(244,239,230,0.4); margin: 0; line-height: 1.6;">
            El contenido de este protocolo es informativo y no constituye asesoramiento médico.<br>
            Si deseas darte de baja, responde a este email con "baja".
          </p>
        </div>
      </div>
    `,
  })

  if (sendError) {
    throw new Error(`Error enviando email de resultado con Resend: ${sendError.message}`)
  }
}
