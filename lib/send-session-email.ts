import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobienestar.institute'

export async function sendMagicLinkEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/programa/auth?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#1A2326;font-family:Georgia,serif">
      <div style="max-width:560px;margin:0 auto;padding:40px 20px">
        <div style="text-align:center;margin-bottom:32px">
          <div style="color:#F4EFE6;font-size:20px;letter-spacing:0.12em;font-family:Georgia,serif">IEN</div>
          <div style="color:rgba(244,239,230,0.4);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;margin-top:4px">PROTOCOLO · 21 DÍAS</div>
        </div>
        <div style="background:#1C3D50;border-radius:12px;padding:40px 32px">
          <p style="font-size:16px;color:#F4EFE6;line-height:1.8;margin:0 0 24px">
            Tu enlace de acceso al Portal del Programa de 21 Días.
          </p>
          <p style="font-size:14px;color:rgba(244,239,230,0.7);line-height:1.8;margin:0 0 32px">
            Pulsa el botón para entrar directamente. El enlace es válido durante 30 minutos.
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${link}"
               style="background:#B8722E;color:#F4EFE6;padding:18px 48px;border-radius:30px;text-decoration:none;font-size:16px;display:inline-block;letter-spacing:0.03em">
              Acceder al programa →
            </a>
          </div>
          <p style="font-size:12px;color:rgba(244,239,230,0.35);text-align:center;margin:0;line-height:1.6">
            Si no pediste este enlace, ignora este correo.<br>
            El enlace expira en 30 minutos.
          </p>
        </div>
        <p style="font-size:11px;color:rgba(244,239,230,0.2);text-align:center;margin-top:24px;line-height:1.6">
          © 2025 Instituto Español de Neurobienestar · neurobienestar.institute
        </p>
      </div>
    </body>
    </html>
  `

  await resend.emails.send({
    from: 'IEN · Programa 21 Días <protocolo@neurobienestar.institute>',
    to: email,
    subject: 'Tu acceso al Programa de 21 Días',
    html,
  })
}
