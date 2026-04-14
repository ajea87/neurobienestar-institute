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
    subject: "Tu Protocolo Nervio Vago — Instituto Español de Neurobienestar",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A2326;">
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
