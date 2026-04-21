import { sendFollowUpUrgencyEmail } from '../lib/send-email'

const TARGET = 'ajea87@hotmail.com'
const LEVELS = ['rojo', 'amber', 'verde'] as const
const DELAY_MS = 600

const REQUIRED_ENV = ['RESEND_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

function checkEnv() {
  const missing = REQUIRED_ENV.filter(k => !process.env[k])
  if (missing.length) {
    console.error(`✗ Variables de entorno faltantes: ${missing.join(', ')}`)
    console.error('  Carga el entorno con: set -a && source .env.local && set +a')
    process.exit(1)
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  checkEnv()

  console.log(`\nQA email 3 → ${TARGET}`)
  console.log('─'.repeat(40))

  const results = { ok: 0, fail: 0 }

  for (const level of LEVELS) {
    try {
      await sendFollowUpUrgencyEmail(TARGET, level)
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
