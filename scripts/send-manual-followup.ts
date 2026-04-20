import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'
import { sendFollowUpTechniqueEmail, followUpEmailPreview } from '../lib/send-email'

// ─── Env validation ───────────────────────────────────────────────────────────
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'] as const
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`✗ Variable de entorno requerida no encontrada: ${key}`)
    process.exit(1)
  }
}

// ─── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const isDryRun   = args.includes('--dry-run')
const isConfirm  = args.includes('--confirm')
const ignoreAge  = args.includes('--ignore-age')
const limitArg   = args.find(a => a.startsWith('--limit='))
const limit      = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined
const levelArg   = args.find(a => a.startsWith('--level='))
const filterLevel = levelArg ? levelArg.split('=')[1] : undefined

if (filterLevel && !['verde', 'amber', 'rojo'].includes(filterLevel)) {
  console.error(`✗ Nivel inválido: "${filterLevel}". Debe ser verde, amber o rojo.`)
  process.exit(1)
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Prompt helper ────────────────────────────────────────────────────────────
function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(question, answer => { rl.close(); resolve(answer) })
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  let query = supabase
    .from('leads')
    .select('id, email, level, score')
    .eq('email_sequence', 0)
    .eq('paid', false)
    .not('email', 'like', '% %')
    .like('email', '%@%')

  if (filterLevel) query = query.eq('level', filterLevel)

  if (!ignoreAge) {
    // Require minimum 3h old, same as cron — use --ignore-age for recovery of old leads
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
    query = query.lte('first_email_at', threeHoursAgo.toISOString())
  }

  const { data: allLeads, error } = await query
  if (error) {
    console.error('✗ Error consultando Supabase:', error.message)
    process.exit(1)
  }

  let leads = allLeads ?? []
  if (limit) leads = leads.slice(0, limit)

  // Summary
  const counts = { verde: 0, amber: 0, rojo: 0, other: 0 }
  for (const l of leads) {
    if (l.level === 'verde') counts.verde++
    else if (l.level === 'amber') counts.amber++
    else if (l.level === 'rojo') counts.rojo++
    else counts.other++
  }

  console.log(`\n── Leads encontrados: ${leads.length} ─────────────────────────────`)
  console.log(`   verde: ${counts.verde}  │  amber: ${counts.amber}  │  rojo: ${counts.rojo}${counts.other ? `  │  otros: ${counts.other}` : ''}`)
  if (ignoreAge)   console.log('   [--ignore-age activo: incluye leads de cualquier antigüedad]')
  if (filterLevel) console.log(`   [--level=${filterLevel}: filtrado por nivel]`)
  if (limit)       console.log(`   [--limit=${limit}: limitado a ${limit} leads]`)
  console.log('')

  if (leads.length === 0) {
    console.log('Sin leads que procesar. Saliendo.')
    console.log('Tip: si los leads son de más de 24h, usa --ignore-age para ignorar el filtro de tiempo.')
    process.exit(0)
  }

  // ── Dry run ─────────────────────────────────────────────────────────────────
  if (isDryRun) {
    console.log('── DRY RUN — no se enviará nada ────────────────────────────\n')
    for (const lead of leads) {
      const { subject, bodyPreview } = followUpEmailPreview(lead.level)
      console.log(`  📧 ${lead.email}`)
      console.log(`     level: ${lead.level} | score: ${lead.score}`)
      console.log(`     subject: ${subject}`)
      console.log(`     preview: ${bodyPreview}`)
      console.log('')
    }
    console.log('── Fin dry run ──────────────────────────────────────────────')
    process.exit(0)
  }

  // ── Guard: --confirm required ────────────────────────────────────────────────
  if (!isConfirm) {
    console.log('Ejecuta con --confirm para proceder con el envío real.\n')
    process.exit(1)
  }

  // ── Interactive confirmation ─────────────────────────────────────────────────
  const answer = await prompt(`¿Confirmas envío a ${leads.length} leads? Escribe SI para proceder: `)
  if (answer.trim() !== 'SI') {
    console.log('Abortado.')
    process.exit(0)
  }

  // ── Send loop ────────────────────────────────────────────────────────────────
  console.log('\n── Enviando ─────────────────────────────────────────────────\n')
  const failed: { email: string; error: string }[] = []
  let sentOk = 0
  let updatedDb = 0

  for (const lead of leads) {
    try {
      await sendFollowUpTechniqueEmail(lead.email, lead.level)
      const { error: dbError } = await supabase
        .from('leads')
        .update({ email_sequence: 1 })
        .eq('id', lead.id)
      if (dbError) throw new Error(`DB update failed: ${dbError.message}`)
      updatedDb++
      sentOk++
      console.log(`  ✓ enviado a ${lead.email} (level: ${lead.level})`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`  ✗ FALLÓ ${lead.email}: ${msg}`)
      failed.push({ email: lead.email, error: msg })
    }
    await new Promise(r => setTimeout(r, 600))
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n── RESUMEN ──────────────────────────────────────────────────')
  console.log(`  ${sentOk} enviados OK  │  ${failed.length} fallidos  │  ${updatedDb} actualizados en Supabase`)
  if (failed.length > 0) {
    console.log('\n  Fallidos:')
    for (const f of failed) console.log(`    ✗ ${f.email}: ${f.error}`)
  }
  console.log('')
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
