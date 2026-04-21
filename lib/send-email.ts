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

const SECTION = (text: string) =>
  `<p style="font-size:12px;font-weight:600;color:#2B7A8B;letter-spacing:0.12em;text-transform:uppercase;margin:28px 0 10px;font-family:Arial,sans-serif">${text}</p>`

const P = (text: string) =>
  `<p style="margin:0 0 16px;line-height:1.7">${text}</p>`

function buildFollowUpBody(intro: string, closing: string): string {
  return `
    ${P(intro)}
    ${P('No te hemos escrito antes porque queríamos enviarte la primera técnica del Método MAV cuando pudiéramos acompañarla de instrucciones claras, no de un anuncio. Aquí la tienes.')}
    ${SECTION('Técnica 1 · Espiración Larga')}
    ${P('Es la primera del protocolo completo. La que tiene el mayor impacto inmediato sobre el tono vagal, medible en frecuencia cardíaca desde el primer minuto.')}
    ${SECTION('Cómo aplicarla:')}
    ${P('1.&nbsp; Siéntate con la espalda apoyada. No tumbado.<br>2.&nbsp; Inspira por la nariz contando hasta 4.<br>3.&nbsp; Exhala por la boca contando hasta 8. El doble de largo.<br>4.&nbsp; Repite 5 ciclos completos. Total: 60 segundos.')}
    ${SECTION('Qué va a pasar:')}
    ${P('Al tercer ciclo vas a notar que algo baja. No es sugestión. Es tu nervio vago respondiendo al estímulo de exhalación prolongada. La exhalación larga activa el sistema parasimpático de forma directa — es el único estímulo voluntario que tenemos para "empujar" el freno fisiológico del cuerpo.')}
    ${SECTION('Cuándo aplicarla durante los próximos días:')}
    ${P('• Al despertar, antes de levantarte<br>• Cuando notes tensión en hombros o mandíbula<br>• Antes de dormir, con la luz ya apagada')}
    ${closing}
    ${P('Cuando llegues ahí, aquí tienes el Protocolo completo con las 7 técnicas ordenadas por impacto:')}
  `
}

const FOLLOWUP_CONTENT: Record<string, { subject: string; preview: string; body: string; cta: string }> = {
  rojo: {
    subject: 'Toma esta técnica — empieza por aquí',
    preview: 'Hace unos días hiciste el test del Instituto Español de Neurobienestar. Tu resultado fue nivel rojo: sistema nervioso en modo supervivencia sostenido.',
    cta: 'Ver el Protocolo completo →',
    body: buildFollowUpBody(
      'Hace unos días hiciste el test del Instituto Español de Neurobienestar. Tu resultado fue nivel rojo: sistema nervioso en modo supervivencia sostenido.',
      `${P('Hazlo 5-6 veces al día durante 3 días. Después de eso, tu cuerpo empieza a pedir la técnica solo — señal de que el patrón empieza a reinstalarse.')}
      ${P('Importante: esta es la técnica que más impacto tiene cuando el sistema está en modo supervivencia. Pero sola no es suficiente para salir del patrón crónico. Es el cimiento. Las otras 6 técnicas del protocolo trabajan sobre capas distintas del sistema nervioso autónomo: el reflejo vagal por frío, la estimulación por contacto físico, la activación por sonido, la regulación por postura, y las otras.')}
      ${P('Si al aplicar la técnica de Espiración Larga durante estos días notas que algo se mueve — cansancio que baja, digestión que mejora, mente que empieza a parar — significa que tu sistema responde. Ese es el indicador de que el resto del método te va a funcionar también.')}`
    ),
  },
  amber: {
    subject: 'Toma esta técnica — empieza por aquí',
    preview: 'Hace unos días hiciste el test del Instituto Español de Neurobienestar. Tu resultado fue nivel ámbar: nervio vago inhibido en activación crónica.',
    cta: 'Ver el Protocolo completo →',
    body: buildFollowUpBody(
      'Hace unos días hiciste el test del Instituto Español de Neurobienestar. Tu resultado fue nivel ámbar: nervio vago inhibido en activación crónica.',
      `${P('Hazlo 5-6 veces al día durante 3 días. A partir del cuarto día, si tu nivel es ámbar, vas a notar que necesitas pedírselo al cuerpo con menos esfuerzo. El patrón empieza a instalarse solo.')}
      ${P('En nivel ámbar la técnica de Espiración Larga funciona rápido. Pero el sistema lleva tiempo pidiendo salir, y la respiración sola no termina de desmontar la activación crónica. Las otras 6 técnicas del Método MAV trabajan capas distintas: el reflejo vagal por frío, la estimulación por contacto, la activación por sonido, la regulación por postura, y las restantes.')}
      ${P('Si al aplicar la técnica de Espiración Larga durante estos días notas que algo cambia — tensión muscular que cede, sueño que mejora, menos reactividad digestiva — significa que tu sistema responde. Es el indicador de que el resto del método va a funcionar sobre ti.')}`
    ),
  },
  verde: {
    subject: 'Toma esta técnica — empieza por aquí',
    preview: 'Hace unos días hiciste el test del Instituto Español de Neurobienestar. Tu resultado fue nivel verde: señales tempranas de inhibición vagal.',
    cta: 'Ver el Protocolo completo →',
    body: buildFollowUpBody(
      'Hace unos días hiciste el test del Instituto Español de Neurobienestar. Tu resultado fue nivel verde: señales tempranas de inhibición vagal.',
      `${P('Hazlo 3-4 veces al día durante una semana. Con el margen que te da el nivel verde, la técnica se instala rápido. En pocos días tu cuerpo la pide solo cuando detecta tensión.')}
      ${P('La ventaja de intervenir en nivel verde es que las 6 técnicas restantes del Método MAV trabajan de forma preventiva, no correctiva. Es más fácil instalar un patrón sano antes de que el sistema se atasque que desmontarlo después. Las otras 6 cubren capas que la respiración sola no alcanza: reflejo vagal por frío, estimulación por contacto, activación por sonido, postura, y otras.')}
      ${P('Si al aplicar la técnica de Espiración Larga durante estos días confirmas que tu sistema responde con facilidad, el siguiente paso natural es completar el método antes de que el patrón de inhibición escale.')}`
    ),
  },
}

export function followUpEmailPreview(level: string): { subject: string; bodyPreview: string } {
  const c = FOLLOWUP_CONTENT[level] ?? FOLLOWUP_CONTENT.rojo
  return { subject: c.subject, bodyPreview: c.preview.substring(0, 150) }
}

export async function sendFollowUpTechniqueEmail(email: string, level: string): Promise<void> {
  const c = FOLLOWUP_CONTENT[level] ?? FOLLOWUP_CONTENT.rojo
  const { error } = await resend.emails.send({
    from: 'IEN · Instituto Español de Neurobienestar <protocolo@neurobienestar.institute>',
    to: email,
    subject: c.subject,
    html: emailTemplate({
      title: 'Toma esta técnica — empieza por aquí.',
      body: c.body,
      ctaText: c.cta,
      ctaUrl: 'https://www.neurobienestar.institute/protocolo',
      footerNote: 'Sin spam. Puedes darte de baja en cualquier momento.',
    }),
  })
  if (error) throw new Error(`Resend error: ${error.message}`)
}

// ─── Follow-up email 3: urgencia cualitativa ─────────────────────────────────

const EMAIL3_CONTENT: Record<string, { levelPhrase: string; levelParagraph: string }> = {
  rojo: {
    levelPhrase: 'como tu nivel es rojo',
    levelParagraph: 'Un sistema nervioso en modo supervivencia sostenido no mejora por sí solo. No hay proceso natural de recuperación en juego — solo hay un patrón que se refuerza cada día que el nervio vago sigue inhibido. Posponer no es ganar tiempo para pensarlo: es consolidar un poco más el patrón que te ha traído hasta aquí.',
  },
  amber: {
    levelPhrase: 'como tu nivel es ámbar',
    levelParagraph: 'La activación crónica no es un estado estático. Evoluciona. Un sistema que lleva meses encendido tiene dos caminos — y ambos pasan por lo que hagas en las próximas semanas. Si introduces el estímulo correcto, el cuerpo empieza a recalibrar. Si no, el patrón sigue instalándose hasta convertirse en modo supervivencia sostenido. Esa diferencia se decide ahora, no cuando tengas tiempo.',
  },
  verde: {
    levelPhrase: 'como tu nivel es verde',
    levelParagraph: 'El nivel verde es la ventana en la que el sistema todavía responde con facilidad, los patrones no se han consolidado, y los estímulos correctos producen cambios claros con poco esfuerzo. Esa ventana se cierra sola. No hay un día concreto en el que dejas de ser verde — pero cada mes que pasa, el cuerpo aprende un poco más a quedarse encendido. Intervenir en verde es preventivo. En ámbar se vuelve correctivo. En rojo, reconstructivo.',
  },
}

function buildEmail3Body(level: string): string {
  const c = EMAIL3_CONTENT[level] ?? EMAIL3_CONTENT.rojo
  return `
    ${P('Probablemente viste la oferta del Protocolo y la dejaste para después.')}
    ${P(`Es la reacción más común, así que no te lo tomes mal. Pero ${c.levelPhrase}, te escribo esto con la honestidad que a veces falta en marketing:`)}
    ${P(c.levelParagraph)}
    ${P('No es catastrofismo. Es plasticidad neural. Las redes que se activan juntas, se cablean juntas — y cuanto más tiempo opera tu cuerpo fuera de su estado vagal óptimo, más se consolida ese patrón.')}
    ${P('El precio sigue siendo 7€. La garantía de 30 días sigue siendo íntegra. Lo único que cambia es el tiempo que pasa mientras decides.')}
    ${P('Si prefieres leerlo antes de decidir, aquí puedes ver qué incluye y cómo funciona la garantía:<br><a href="https://www.neurobienestar.institute/protocolo" style="color:#2B7A8B;text-decoration:underline;font-family:Arial,sans-serif">https://www.neurobienestar.institute/protocolo</a>')}
  `
}

export async function sendFollowUpUrgencyEmail(email: string, level: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: 'IEN · Instituto Español de Neurobienestar <protocolo@neurobienestar.institute>',
    to: email,
    subject: 'Si lo estás posponiendo, lee esto',
    html: emailTemplate({
      title: 'Si lo estás posponiendo, lee esto.',
      body: buildEmail3Body(level),
      ctaText: 'Acceder al Protocolo completo →',
      ctaUrl: 'https://www.neurobienestar.institute/protocolo',
      footerNote: 'Sin spam. Puedes darte de baja en cualquier momento.',
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
