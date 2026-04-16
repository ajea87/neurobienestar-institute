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
    <div style={{ minHeight: '100vh', background: '#1A2326', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{
        background: '#111D21',
        borderBottom: '1px solid rgba(244,239,230,0.06)',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/programa/dashboard" style={{
          color: 'rgba(244,239,230,0.4)',
          fontSize: '13px',
          textDecoration: 'none',
        }}>
          ← Dashboard
        </Link>
        <div style={{ color: 'rgba(244,239,230,0.25)', fontSize: '11px', letterSpacing: '0.1em' }}>
          MI PROGRESO
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ color: '#F4EFE6', fontSize: '24px', fontWeight: 400, margin: '0 0 8px' }}>
          Mi progreso
        </h1>
        <p style={{ color: 'rgba(244,239,230,0.4)', fontSize: '14px', margin: '0 0 40px' }}>
          {completed.length} sesiones completadas de 21
        </p>

        {completed.length === 0 ? (
          <div style={{
            background: '#1C3D50',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(244,239,230,0.4)', fontSize: '15px', margin: 0 }}>
              Aún no has completado ninguna sesión.<br />
              <Link href="/programa/dashboard" style={{ color: '#2B7A8B', textDecoration: 'none' }}>
                Ir al dashboard →
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {completed.map((p) => {
              const dayContent = PROGRAM_CONTENT.find((d) => d.day === p.day)
              return (
                <div
                  key={p.day}
                  style={{
                    background: '#1C3D50',
                    borderRadius: '12px',
                    padding: '24px 28px',
                    borderLeft: '3px solid #2B7A8B',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ color: 'rgba(244,239,230,0.35)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Día {p.day}
                      </div>
                      <div style={{ color: '#F4EFE6', fontSize: '16px', fontWeight: 400 }}>
                        {dayContent?.title}
                      </div>
                    </div>
                    <div style={{ color: 'rgba(244,239,230,0.3)', fontSize: '12px', textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                      {formatDate(p.completed_at)}
                    </div>
                  </div>
                  {p.diary && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(244,239,230,0.08)',
                    }}>
                      <div style={{ color: 'rgba(244,239,230,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Diario
                      </div>
                      <p style={{ color: 'rgba(244,239,230,0.6)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
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
