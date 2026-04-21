import { createClient } from '@supabase/supabase-js'
import {
  sendFollowUpTechniqueEmail,
  sendFollowUpUrgencyEmail,
  sendFollowUpReframeEmail,
  sendFollowUpFinalLetterEmail,
} from '@/lib/send-email'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { email2: 0, email3: 0, email4: 0, email5: 0, errors: 0 }

  console.log('[cron/followup] start', { time: now.toISOString() })

  const threeHoursAgo       = new Date(now.getTime() -   3 * 60 * 60 * 1000)
  const twentyFourHoursAgo  = new Date(now.getTime() -  24 * 60 * 60 * 1000)
  const fortyEightHoursAgo  = new Date(now.getTime() -  48 * 60 * 60 * 1000)
  const ninetyFourHoursAgo  = new Date(now.getTime() -  96 * 60 * 60 * 1000)
  const oneHundredTwentyHoursAgo = new Date(now.getTime() - 120 * 60 * 60 * 1000)
  const oneHundredFortyFourHoursAgo = new Date(now.getTime() - 144 * 60 * 60 * 1000)
  const oneHundredSixtyEightHoursAgo = new Date(now.getTime() - 168 * 60 * 60 * 1000)

  // Email 2: strict window 3h–24h after first_email_at
  const { data: leads2, error: err2 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 0)
    .neq('level', 'directo')
    .lte('first_email_at', threeHoursAgo.toISOString())
    .gte('first_email_at', twentyFourHoursAgo.toISOString())

  if (err2) console.error('[cron/followup] query email2 error', err2)
  console.log('[cron/followup] email2 candidates', { count: leads2?.length ?? 0 })

  for (const lead of leads2 ?? []) {
    try {
      await sendFollowUpTechniqueEmail(lead.email, lead.level)
      await supabase.from('leads').update({ email_sequence: 1 }).eq('id', lead.id)
      console.log('[cron/followup] email2 sent', { email: lead.email, level: lead.level })
      results.email2++
    } catch (err) {
      console.error('[cron/followup] email2 error', { email: lead.email, err })
      results.errors++
    }
  }

  // Email 3: strict window 24h–48h after first_email_at
  const { data: leads3, error: err3 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 1)
    .neq('level', 'directo')
    .lte('first_email_at', twentyFourHoursAgo.toISOString())
    .gte('first_email_at', fortyEightHoursAgo.toISOString())

  if (err3) console.error('[cron/followup] query email3 error', err3)
  console.log('[cron/followup] email3 candidates', { count: leads3?.length ?? 0 })

  for (const lead of leads3 ?? []) {
    try {
      await sendFollowUpUrgencyEmail(lead.email, lead.level)
      await supabase.from('leads').update({ email_sequence: 2 }).eq('id', lead.id)
      console.log('[cron/followup] email3 sent', { email: lead.email, level: lead.level })
      results.email3++
    } catch (err) {
      console.error('[cron/followup] email3 error', { email: lead.email, err })
      results.errors++
    }
  }

  // Email 4: strict window 96h–120h after first_email_at
  const { data: leads4, error: err4 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 2)
    .neq('level', 'directo')
    .lte('first_email_at', ninetyFourHoursAgo.toISOString())
    .gte('first_email_at', oneHundredTwentyHoursAgo.toISOString())

  if (err4) console.error('[cron/followup] query email4 error', err4)
  console.log('[cron/followup] email4 candidates', { count: leads4?.length ?? 0 })

  for (const lead of leads4 ?? []) {
    try {
      await sendFollowUpReframeEmail(lead.email, lead.level)
      await supabase.from('leads').update({ email_sequence: 3 }).eq('id', lead.id)
      console.log('[cron/followup] email4 sent', { email: lead.email, level: lead.level })
      results.email4++
    } catch (err) {
      console.error('[cron/followup] email4 error', { email: lead.email, err })
      results.errors++
    }
  }

  // Email 5: strict window 144h–168h after first_email_at
  const { data: leads5, error: err5 } = await supabase
    .from('leads')
    .select('id, email, level')
    .eq('paid', false)
    .eq('email_sequence', 3)
    .neq('level', 'directo')
    .lte('first_email_at', oneHundredFortyFourHoursAgo.toISOString())
    .gte('first_email_at', oneHundredSixtyEightHoursAgo.toISOString())

  if (err5) console.error('[cron/followup] query email5 error', err5)
  console.log('[cron/followup] email5 candidates', { count: leads5?.length ?? 0 })

  for (const lead of leads5 ?? []) {
    try {
      await sendFollowUpFinalLetterEmail(lead.email, lead.level)
      await supabase.from('leads').update({ email_sequence: 4 }).eq('id', lead.id)
      console.log('[cron/followup] email5 sent', { email: lead.email, level: lead.level })
      results.email5++
    } catch (err) {
      console.error('[cron/followup] email5 error', { email: lead.email, err })
      results.errors++
    }
  }

  console.log('[cron/followup] done', results)
  return Response.json({ success: true, ...results })
}
