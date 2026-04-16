import { redirect } from 'next/navigation'
import { getSessionEmail } from '@/lib/programa-auth'
import { createClient } from '@supabase/supabase-js'
import { PROGRAM_CONTENT } from '@/lib/programa-content'
import Link from 'next/link'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ProgresoPage() {
  const email = await getSessionEmail()
  if (!email) redirect('/programa')

  const { data: progressData } = await supabase
    .from('program_progress')
    .select('day, completed_at, diary')
    .eq('email', email)
    .order('day', { ascending: true })

  const completed = progressData || []

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
        <Link href="/programa/dashboard" style={{
          color: 'rgba(244,239,230,0.55)',
          fontSize: '12px',
          textDecoration: 'none',
        }}>
          ← Dashboard
        </Link>
        <div style={{
          color: 'rgba(244,239,230,0.35)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          MI PROGRESO
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '36px' }}>
          <p style={{
            color: '#2B7A8B',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: '0 0 8px',
            fontWeight: 500,
          }}>
            Historial
          </p>
          <h1 style={{
            color: '#F4EFE6',
            fontSize: '26px',
            fontWeight: 400,
            margin: '0 0 6px',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
          }}>
            Mi progreso
          </h1>
          <p style={{ color: 'rgba(244,239,230,0.4)', fontSize: '13px', margin: 0 }}>
            {completed.length} sesiones completadas de 21
          </p>
        </div>

        {completed.length === 0 ? (
          <div style={{
            background: 'rgba(28,61,80,0.4)',
            border: '1px solid rgba(43,122,139,0.2)',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(244,239,230,0.4)', fontSize: '14px', margin: 0, lineHeight: 1.7 }}>
              Aún no has completado ninguna sesión.<br />
              <Link href="/programa/dashboard" style={{ color: '#2B7A8B', textDecoration: 'none' }}>
                Ir al dashboard →
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {completed.map((p) => {
              const dayContent = PROGRAM_CONTENT.find((d) => d.day === p.day)
              return (
                <div
                  key={p.day}
                  style={{
                    background: 'rgba(28,61,80,0.4)',
                    border: '1px solid rgba(43,122,139,0.2)',
                    borderRadius: '10px',
                    padding: '20px 24px',
                    borderLeft: '3px solid #2B7A8B',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{
                        color: '#2B7A8B',
                        fontSize: '9px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                        fontWeight: 500,
                      }}>
                        Día {p.day}
                      </div>
                      <div style={{
                        color: '#F4EFE6',
                        fontSize: '16px',
                        fontWeight: 400,
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                      }}>
                        {dayContent?.title}
                      </div>
                    </div>
                    <div style={{ color: 'rgba(244,239,230,0.3)', fontSize: '11px', textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                      {formatDate(p.completed_at)}
                    </div>
                  </div>
                  {p.diary && (
                    <div style={{
                      marginTop: '14px',
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(43,122,139,0.15)',
                    }}>
                      <div style={{
                        color: '#2B7A8B',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                        fontWeight: 500,
                      }}>
                        Diario
                      </div>
                      <p style={{ color: 'rgba(244,239,230,0.55)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                        {p.diary}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
