import { Resend } from 'resend'
import { emailTemplate } from './email-template'

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobienestar.institute'

export async function sendMagicLinkEmail(email: string, token: string): Promise<void> {
  const link = `${BASE_URL}/programa/auth?token=${token}`

  await resend.emails.send({
    from: 'IEN · Programa 21 Días <protocolo@neurobienestar.institute>',
    to: email,
    subject: 'Tu acceso al Programa de 21 Días',
    html: emailTemplate({
      title: 'Tu acceso al Programa está listo.',
      body: 'Pulsa el botón para entrar al portal.<br>El enlace es válido durante 30 minutos.<br>Si no lo solicitaste, ignora este correo.',
      ctaText: 'Acceder al programa →',
      ctaUrl: link,
      footerNote: 'El enlace expira en 30 minutos.',
    }),
  })
}
