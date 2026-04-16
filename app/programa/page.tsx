'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState<'form' | 'sent'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'expired') setError('El enlace ha expirado. Solicita uno nuevo.')
    if (err === 'invalid') setError('Enlace inválido o ya usado. Solicita uno nuevo.')
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/programa/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    })

    setLoading(false)
    if (res.ok) {
      setPhase('sent')
    } else {
      setError('Error al procesar. Inténtalo de nuevo.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A2326',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Georgia, serif',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ color: '#F4EFE6', fontSize: '24px', letterSpacing: '0.12em' }}>IEN</div>
          <div style={{ color: 'rgba(244,239,230,0.35)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '6px' }}>
            PROTOCOLO · 21 DÍAS
          </div>
        </div>

        {phase === 'form' ? (
          <div style={{
            background: '#1C3D50',
            borderRadius: '12px',
            padding: '40px 32px',
          }}>
            <h1 style={{
              color: '#F4EFE6',
              fontSize: '20px',
              margin: '0 0 8px',
              fontWeight: 400,
              lineHeight: 1.4,
            }}>
              Portal del Programa
            </h1>
            <p style={{
              color: 'rgba(244,239,230,0.55)',
              fontSize: '14px',
              margin: '0 0 32px',
              lineHeight: 1.7,
            }}>
              Introduce tu email y te enviaremos un enlace de acceso directo.
            </p>

            {error && (
              <div style={{
                background: 'rgba(226,75,74,0.15)',
                border: '1px solid rgba(226,75,74,0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#F4A0A0',
                fontSize: '13px',
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(244,239,230,0.08)',
                  border: '1px solid rgba(244,239,230,0.15)',
                  borderRadius: '8px',
                  color: '#F4EFE6',
                  fontSize: '15px',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? 'rgba(184,114,46,0.5)' : '#B8722E',
                  color: '#F4EFE6',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                {loading ? 'Enviando...' : 'Enviar enlace de acceso →'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{
            background: '#1C3D50',
            borderRadius: '12px',
            padding: '40px 32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '20px' }}>✉</div>
            <h2 style={{
              color: '#F4EFE6',
              fontSize: '20px',
              fontWeight: 400,
              margin: '0 0 12px',
            }}>
              Enlace enviado
            </h2>
            <p style={{
              color: 'rgba(244,239,230,0.6)',
              fontSize: '14px',
              lineHeight: 1.8,
              margin: 0,
            }}>
              Si <strong style={{ color: '#F4EFE6' }}>{email}</strong> tiene acceso al programa,
              recibirás el enlace en unos segundos.<br /><br />
              El enlace es válido durante 30 minutos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProgramaLogin() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
