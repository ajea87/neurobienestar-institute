import { redirect } from 'next/navigation'
import { getSessionEmail } from '@/lib/programa-auth'
import { createClient } from '@supabase/supabase-js'
import { PROGRAM_CONTENT, WEEK_NAMES, COMPLETION_MESSAGES } from '@/lib/programa-content'
import Link from 'next/link'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

function getStreak(completedDays: number[]): number {
  if (completedDays.length === 0) return 0
  const sorted = [...completedDays].sort((a, b) => b - a)
  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1] - sorted[i] === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

function VagalMeter({ completed }: { completed: number }) {
  const pct = Math.round((completed / 21) * 100)
  const label =
    pct < 25 ? 'Iniciando regulación' :
    pct < 50 ? 'Tono vagal en desarrollo' :
    pct < 75 ? 'Regulación consolidándose' :
    pct < 100 ? 'Tono vagal elevado' :
    'Sistema nervioso regulado'

  return (
    <div style={{
      background: 'rgba(28,61,80,0.4)',
      border: '1px solid rgba(43,122,139,0.2)',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '28px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{
          color: '#2B7A8B',
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontWeight: 500,
        }}>
          Tono vagal
        </span>
        <span style={{
          color: 'rgba(244,239,230,0.6)',
          fontSize: '12px',
          fontFamily: 'var(--font-dm-sans), sans-serif',
        }}>{label}</span>
      </div>
      <div style={{ background: 'rgba(244,239,230,0.08)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #2B7A8B, #4EAABB)',
          borderRadius: '4px',
          transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{ textAlign: 'right', marginTop: '6px' }}>
        <span style={{
          color: 'rgba(244,239,230,0.3)',
          fontSize: '11px',
          fontFamily: 'var(--font-dm-sans), sans-serif',
        }}>{completed}/21 sesiones</span>
      </div>
    </div>
  )
}

export default async function Dashboard() {
  const email = await getSessionEmail()
  if (!email) redirect('/programa')

  const { data: progressData } = await supabase
    .from('program_progress')
    .select('day, completed_at')
    .eq('email', email)
    .order('day', { ascending: true })

  const completedDays = (progressData || []).map((p) => p.day)
  const completedSet = new Set(completedDays)
  const totalCompleted = completedDays.length
  const streak = getStreak(completedDays)
  const nextDay = completedDays.length > 0 ? Math.max(...completedDays) + 1 : 1
  const currentNextDay = Math.min(nextDay, 21)
  const allDone = totalCompleted === 21

  const lastCompleted = Math.max(0, ...completedDays)
  const completionMessage = COMPLETION_MESSAGES[lastCompleted] || COMPLETION_MESSAGES[0]

  return (
    <div style={{ minHeight: '100vh', background: '#1A2326', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      {/* Navbar */}
      <div style={{
        background: '#1C3D50',
        borderBottom: '1px solid rgba(43,122,139,0.3)',
        height: '52px',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            color: '#F4EFE6',
            fontSize: '15px',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
          }}>IEN</span>
          <span style={{
            color: 'rgba(244,239,230,0.35)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>· PROGRAMA 21 DÍAS</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{
            color: 'rgba(244,239,230,0.4)',
            fontSize: '10px',
          }}>{email}</span>
          <Link href="/programa/progreso" style={{
            color: 'rgba(244,239,230,0.5)',
            fontSize: '12px',
            textDecoration: 'none',
          }}>
            Mi progreso
          </Link>
          <form action="/api/programa/logout" method="POST">
            <button type="submit" style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(244,239,230,0.4)',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '0',
            }}>
              Salir
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            color: '#2B7A8B',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: '0 0 8px',
            fontWeight: 500,
          }}>
            Día {totalCompleted} de 21
          </p>
          <h1 style={{
            color: '#F4EFE6',
            fontSize: '26px',
            fontWeight: 400,
            margin: '0 0 8px',
            lineHeight: 1.3,
            fontFamily: 'var(--font-cormorant), Georgia, serif',
          }}>
            {completionMessage}
          </h1>
          {streak > 1 && (
            <p style={{ color: 'rgba(244,239,230,0.5)', fontSize: '12px', margin: 0 }}>
              {streak} días seguidos · racha activa
            </p>
          )}
        </div>

        {/* Vagal Meter */}
        <VagalMeter completed={totalCompleted} />

        {/* Next session CTA */}
        {!allDone && (
          <Link href={`/programa/dia/${currentNextDay}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(28,61,80,0.4)',
              borderRadius: '10px',
              padding: '24px 28px',
              marginBottom: '36px',
              border: '1px solid rgba(43,122,139,0.2)',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{
                    color: '#2B7A8B',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    fontWeight: 500,
                  }}>
                    Próxima sesión · Día {currentNextDay}
                  </div>
                  <h2 style={{
                    color: '#F4EFE6',
                    fontSize: '20px',
                    fontWeight: 400,
                    margin: '0 0 6px',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                  }}>
                    {PROGRAM_CONTENT[currentNextDay - 1]?.title}
                  </h2>
                  <p style={{ color: 'rgba(244,239,230,0.55)', fontSize: '13px', margin: 0 }}>
                    {PROGRAM_CONTENT[currentNextDay - 1]?.subtitle}
                  </p>
                </div>
                <div style={{
                  background: '#B8722E',
                  color: '#F4EFE6',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0,
                  marginLeft: '20px',
                }}>
                  ▶
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                <span style={{ color: 'rgba(244,239,230,0.35)', fontSize: '11px' }}>
                  {PROGRAM_CONTENT[currentNextDay - 1]?.durationMinutes} min
                </span>
                <span style={{ color: 'rgba(244,239,230,0.35)', fontSize: '11px' }}>
                  {PROGRAM_CONTENT[currentNextDay - 1]?.technique}
                </span>
              </div>
            </div>
          </Link>
        )}

        {allDone && (
          <div style={{
            background: 'rgba(28,61,80,0.4)',
            borderRadius: '10px',
            padding: '32px',
            marginBottom: '36px',
            textAlign: 'center',
            border: '1px solid rgba(43,122,139,0.3)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>◉</div>
            <h2 style={{
              color: '#F4EFE6',
              fontSize: '22px',
              fontWeight: 400,
              margin: '0 0 8px',
              fontFamily: 'var(--font-cormorant), Georgia, serif',
            }}>
              Programa completado
            </h2>
            <p style={{ color: 'rgba(244,239,230,0.55)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              21 días. Has regulado tu sistema nervioso.
            </p>
          </div>
        )}

        {/* Weekly grid */}
        {WEEK_NAMES.map((weekName, wi) => {
          const weekDays = PROGRAM_CONTENT.filter((d) => d.day >= wi * 7 + 1 && d.day <= (wi + 1) * 7)
          const weekCompleted = weekDays.filter((d) => completedSet.has(d.day)).length
          const weekPct = Math.round((weekCompleted / 7) * 100)

          return (
            <div key={wi} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  color: '#2B7A8B',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>
                  {weekName}
                </span>
                <span style={{ color: 'rgba(244,239,230,0.3)', fontSize: '11px' }}>{weekCompleted}/7</span>
              </div>
              <div style={{ background: 'rgba(43,122,139,0.15)', borderRadius: '2px', height: '3px', marginBottom: '14px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${weekPct}%`, background: '#2B7A8B', borderRadius: '2px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {weekDays.map((dayContent) => {
                  const isDone = completedSet.has(dayContent.day)
                  const isNext = dayContent.day === currentNextDay && !allDone
                  const isLocked = !isDone && dayContent.day > currentNextDay

                  return (
                    <Link
                      key={dayContent.day}
                      href={isLocked ? '#' : `/programa/dia/${dayContent.day}`}
                      style={{ textDecoration: 'none' }}
                      onClick={isLocked ? (e) => e.preventDefault() : undefined}
                    >
                      <div style={{
                        background: isDone ? '#2B7A8B' : isNext ? 'rgba(43,122,139,0.2)' : 'rgba(244,239,230,0.04)',
                        border: isNext ? '1px solid rgba(43,122,139,0.5)' : '1px solid rgba(43,122,139,0.1)',
                        borderRadius: '8px',
                        padding: '10px 6px',
                        textAlign: 'center',
                        cursor: isLocked ? 'default' : 'pointer',
                        opacity: isLocked ? 0.3 : 1,
                      }}>
                        <div style={{
                          color: isDone ? '#F4EFE6' : isNext ? '#F4EFE6' : 'rgba(244,239,230,0.3)',
                          fontSize: '11px',
                          fontWeight: isDone || isNext ? 600 : 400,
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                        }}>
                          {isDone ? '✓' : dayContent.day}
                        </div>
                        <div style={{
                          color: isDone ? 'rgba(244,239,230,0.7)' : 'rgba(244,239,230,0.2)',
                          fontSize: '9px',
                          marginTop: '3px',
                          letterSpacing: '0.05em',
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                        }}>
                          D{dayContent.day}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
