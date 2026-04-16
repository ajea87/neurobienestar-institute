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
    }}>
      <style>{`
        .ien-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(43,122,139,0.4);
          border-radius: 8px;
          color: #F4EFE6;
          font-size: 15px;
          margin-bottom: 16px;
          box-sizing: border-box;
          outline: none;
          font-family: var(--font-dm-sans), sans-serif;
          transition: border-color 150ms;
        }
        .ien-input:focus {
          border-color: #2B7A8B;
        }
        .ien-input::placeholder {
          color: rgba(244,239,230,0.3);
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            color: '#F4EFE6',
            fontSize: '28px',
            letterSpacing: '0.14em',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
          }}>IEN</div>
          <div style={{
            color: 'rgba(244,239,230,0.4)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: '6px',
            fontFamily: 'var(--font-dm-sans), sans-serif',
          }}>
            PROTOCOLO · 21 DÍAS
          </div>
        </div>

        {phase === 'form' ? (
          <div style={{
            background: 'rgba(28,61,80,0.5)',
            borderRadius: '12px',
            padding: '40px 32px',
            border: '1px solid rgba(43,122,139,0.25)',
            backdropFilter: 'blur(10px)',
          }}>
            <h1 style={{
              color: '#F4EFE6',
              fontSize: '24px',
              margin: '0 0 8px',
              fontWeight: 400,
              lineHeight: 1.3,
              fontFamily: 'var(--font-cormorant), Georgia, serif',
            }}>
              Acceso al Programa
            </h1>
            <p style={{
              color: 'rgba(244,239,230,0.5)',
              fontSize: '13px',
              margin: '0 0 28px',
              lineHeight: 1.7,
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}>
              Introduce el email con el que compraste el programa.
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
                fontFamily: 'var(--font-dm-sans), sans-serif',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                className="ien-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? 'rgba(184,114,46,0.5)' : '#B8722E',
                  color: '#F4EFE6',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                {loading ? 'Enviando...' : 'Enviar enlace de acceso →'}
              </button>
            </form>

            <p style={{
              fontSize: '10px',
              color: 'rgba(244,239,230,0.3)',
              textAlign: 'center',
              margin: '16px 0 0',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}>
              Recibirás un enlace válido durante 30 minutos.
            </p>
          </div>
        ) : (
          <div style={{
            background: 'rgba(28,61,80,0.5)',
            borderRadius: '12px',
            padding: '48px 32px',
            textAlign: 'center',
            border: '1px solid rgba(43,122,139,0.25)',
            backdropFilter: 'blur(10px)',
          }}>
            {/* Envelope icon */}
            <div style={{ marginBottom: '20px' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="32" height="22" rx="2" stroke="#2B7A8B" strokeWidth="1.5" fill="none"/>
                <path d="M4 12L20 22L36 12" stroke="#2B7A8B" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 style={{
              color: '#F4EFE6',
              fontSize: '20px',
              fontWeight: 400,
              margin: '0 0 12px',
              fontFamily: 'var(--font-cormorant), Georgia, serif',
            }}>
              Revisa tu email.
            </h2>
            <p style={{
              color: 'rgba(244,239,230,0.6)',
              fontSize: '13px',
              lineHeight: 1.8,
              margin: 0,
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}>
              El enlace de acceso estará en tu bandeja<br />
              en menos de 2 minutos.
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
