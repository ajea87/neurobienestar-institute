import { sendFollowUpUrgencyEmail } from '../lib/send-email'
import { sendFollowUpReframeEmail } from '../lib/send-email'
import { sendFollowUpFinalLetterEmail } from '../lib/send-email'

const TARGET = 'ajea87@hotmail.com'
const LEVELS = ['rojo', 'amber', 'verde'] as const
const DELAY_MS = 600

const REQUIRED_ENV = ['RESEND_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

const SENDERS: Record<number, (email: string, level: string) => Promise<void>> = {
  3: sendFollowUpUrgencyEmail,
  4: sendFollowUpReframeEmail,
  5: sendFollowUpFinalLetterEmail,
}

function checkEnv() {
  const missing = REQUIRED_ENV.filter(k => !process.env[k])
  if (missing.length) {
    console.error(`✗ Variables de entorno faltantes: ${missing.join(', ')}`)
    console.error('  Carga el entorno con: set -a && source .env.local && set +a')
    process.exit(1)
  }
}

function parseEmailArg(): number {
  const arg = process.argv.find(a => a.startsWith('--email='))
  const n = arg ? parseInt(arg.split('=')[1], 10) : NaN
  if (!SENDERS[n]) {
    console.error(`✗ Uso: --email=3 | --email=4 | --email=5`)
    process.exit(1)
  }
  return n
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  checkEnv()
  const emailN = parseEmailArg()
  const send = SENDERS[emailN]

  console.log(`\nQA email ${emailN} → ${TARGET}`)
  console.log('─'.repeat(40))

  const results = { ok: 0, fail: 0 }

  for (const level of LEVELS) {
    try {
      await send(TARGET, level)
      console.log(`✓ enviado [${level}] a ${TARGET}`)
      results.ok++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`✗ FALLÓ [${level}]: ${msg}`)
      results.fail++
    }
    if (level !== LEVELS[LEVELS.length - 1]) await delay(DELAY_MS)
  }

  console.log('─'.repeat(40))
  console.log(`Resumen: ${results.ok} enviados, ${results.fail} fallidos`)
}

main()
