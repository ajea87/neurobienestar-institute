import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobienestar.institute'

export async function sendMagicLinkEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/programa/auth?token=${token}`

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F4EFE6;">

      <div style="background: #1C3D50; padding: 32px 40px; text-align: center;">
        <p style="color: #F4EFE6; font-size: 20px; letter-spacing: 0.12em; margin: 0;">IEN</p>
        <p style="color: rgba(244,239,230,0.45); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0;">NEUROBIENESTAR.INSTITUTE</p>
      </div>

      <div style="background: #ffffff; padding: 40px 32px;">
        <h1 style="font-size: 26px; font-weight: 400; color: #1C3D50; line-height: 1.3; margin: 0 0 24px;">
          Tu acceso al Programa está listo.
        </h1>

        <p style="font-size: 15px; line-height: 1.8; color: #1A2326; margin: 0 0 32px;">
          Pulsa el botón para entrar al portal.<br>
          El enlace es válido durante 30 minutos.<br>
          Si no lo solicitaste, ignora este correo.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}"
             style="background: #B8722E; color: #F4EFE6; padding: 16px 40px; border-radius: 6px; text-decoration: none; font-size: 15px; display: inline-block;">
            Acceder al programa →
          </a>
        </div>

        <p style="font-size: 12px; color: #8E9CA3; text-align: center; margin: 0; line-height: 1.6;">
          El enlace expira en 30 minutos.
        </p>
      </div>

      <div style="background: #1C3D50; padding: 20px 40px; text-align: center;">
        <p style="font-family: sans-serif; font-size: 11px; color: rgba(244,239,230,0.4); margin: 0; line-height: 1.6;">
          © 2025 Instituto Español de Neurobienestar<br>
          neurobienestar.institute
        </p>
      </div>

    </div>
  `

  await resend.emails.send({
    from: 'IEN · Programa 21 Días <protocolo@neurobienestar.institute>',
    to: email,
    subject: 'Tu acceso al Programa de 21 Días',
    html,
  })
}
