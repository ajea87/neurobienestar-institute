# IEN — Guía de estilo de emails

## Regla fundamental
TODOS los emails del IEN usan la función emailTemplate()
de lib/email-template.ts. Nunca HTML inline.

## Paleta
- Fondo exterior: #F4EFE6 (crema)
- Header/Footer: #1C3D50 (azul institucional)
- Body: white
- Texto principal: #1A2326 (carbón)
- Botón CTA: #B8722E (ámbar)
- Texto secundario: #8E9CA3
- Acento teal: #2B7A8B

## Uso

```ts
import { emailTemplate } from '@/lib/email-template'

html: emailTemplate({
  title: 'Título del email.',
  body: 'Texto principal. Puede contener <br> y HTML básico.',
  ctaText: 'Texto del botón →',   // opcional
  ctaUrl: 'https://...',          // opcional, requiere ctaText
  footerNote: 'Nota bajo el botón.', // opcional
})
```

## Archivos que usan emailTemplate()

| Archivo | Email | Cuándo |
|---------|-------|--------|
| `lib/send-session-email.ts` | Magic link portal | Al solicitar acceso |
| `lib/send-email.ts` → `sendProtocolEmail` | PDF protocolo | Tras compra |
| `lib/send-email.ts` → `sendResultEmail` | Resultado test | Tras completar test |
| `app/api/cron/followup/route.ts` | Email 2 (3h) | Seguimiento |
| `app/api/cron/followup/route.ts` | Email 3 (24h) | Último aviso |

## Contenido enriquecido en body

Cuando el email necesita bloques especiales (citas, alertas, precios),
se pasan como HTML dentro del parámetro `body`:

```ts
body: `
  Texto intro...
  <div style="background:#F4EFE6;border-left:3px solid #2B7A8B;padding:20px 24px">
    Contenido del bloque
  </div>
  Texto tras el bloque.
`
```

## Tipografía
- Títulos (h1): Georgia, serif
- Cuerpo: Georgia, serif
- UI / notas pequeñas: Arial, sans-serif
