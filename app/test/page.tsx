'use client'

import { useState, useEffect, useRef } from 'react'
import { events } from '@/lib/meta-pixel'

// ─── DATOS ───────────────────────────────────────────────────────────────────

const QUESTIONS = [
  '¿Con qué frecuencia se levanta con cansancio aunque haya dormido más de seis horas?',
  '¿Su estómago o digestión empeora en momentos de tensión o nervios?',
  '¿Se sorprende con los hombros tensos o la respiración corta sin esfuerzo físico?',
  '¿Le cuesta apagar la mente cuando intenta dormir?',
  '¿Siente que lleva el día en piloto automático, presente pero sin estar del todo aquí?',
]

const OPTIONS = [
  { label: 'Casi nunca', value: 1 },
  { label: 'A veces', value: 2 },
  { label: 'Con frecuencia', value: 3 },
  { label: 'Casi siempre', value: 4 },
]

type Level = 'verde' | 'amber' | 'rojo'

function getLevel(score: number): Level {
  if (score <= 9) return 'verde'
  if (score <= 14) return 'amber'
  return 'rojo'
}

const LEVEL_CONFIG: Record<Level, {
  pill: string
  pillBg: string
  pillColor: string
  title: string
  body: string
  revealText: string
  cta: string
}> = {
  verde: {
    pill: 'Nivel Verde · Señales tempranas',
    pillBg: 'rgba(34,197,94,0.12)',
    pillColor: '#15803d',
    title: 'Su sistema nervioso todavía tiene margen.',
    body: 'Las señales que describió indican un desequilibrio temprano. El momento correcto para actuar es ahora — antes de que el sistema se sature.',
    revealText: 'El IEN reserva este precio para quienes llegan antes de que el sistema se sature.',
    cta: 'Quiero el Protocolo ahora →',
  },
  amber: {
    pill: 'Nivel Ámbar · Activación crónica',
    pillBg: 'rgba(245,158,11,0.12)',
    pillColor: '#b45309',
    title: 'Su nervio vago lleva tiempo pidiendo atención.',
    body: 'Lo que describió tiene un nombre preciso: nervio vago inhibido en activación crónica. Tiene solución directa.',
    revealText: 'El IEN reserva este precio para quienes han decidido que es el momento de actuar.',
    cta: 'Activar mi nervio vago →',
  },
  rojo: {
    pill: 'Nivel Rojo · Modo supervivencia',
    pillBg: 'rgba(239,68,68,0.1)',
    pillColor: '#b91c1c',
    title: 'Su cuerpo lleva demasiado tiempo en alerta.',
    body: 'Un sistema nervioso en modo supervivencia no se regula solo. Necesita la herramienta correcta. Aplicada hoy.',
    revealText: 'El IEN reserva este precio para quienes ya saben que esto no va a resolverse solo.',
    cta: 'Empezar hoy →',
  },
}

const SESSION_KEY = 'ien_test_timer_start'
const TIMER_DURATION = 25 * 60 // 25 min en segundos

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function TestPage() {
  // Test state
  const [step, setStep] = useState<'test' | 'result'>('test')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [animKey, setAnimKey] = useState(0)

  // Result state
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState<Level>('verde')

  // Price reveal state
  const [pricePhase, setPricePhase] = useState<'hidden' | 'base' | 'revealed'>('hidden')
  const [timerLeft, setTimerLeft] = useState(TIMER_DURATION)
  const [expired, setExpired] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  // Email state
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Meta Pixel — ViewContent al cargar
  useEffect(() => {
    events.viewContent()
  }, [])

  // Observar resultado para trigger de precio
  useEffect(() => {
    if (step !== 'result') return
    const el = resultRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPricePhase('base')
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [step])

  // Reveal 7€ a los 6 segundos
  useEffect(() => {
    if (pricePhase !== 'base') return
    const t = setTimeout(() => setPricePhase('revealed'), 6000)
    return () => clearTimeout(t)
  }, [pricePhase])

  // Timer de sesión
  useEffect(() => {
    if (pricePhase !== 'revealed') return

    let start = sessionStorage.getItem(SESSION_KEY)
    if (!start) {
      start = Date.now().toString()
      sessionStorage.setItem(SESSION_KEY, start)
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - parseInt(start!)) / 1000)
      const remaining = TIMER_DURATION - elapsed
      if (remaining <= 0) {
        setTimerLeft(0)
        setExpired(true)
      } else {
        setTimerLeft(remaining)
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [pricePhase])

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  function handleOption(value: number) {
    if (selected !== null) return
    setSelected(value)

    setTimeout(() => {
      const newScores = [...scores, value]
      if (currentQ < QUESTIONS.length - 1) {
        setScores(newScores)
        setCurrentQ(currentQ + 1)
        setSelected(null)
        setAnimKey(k => k + 1)
      } else {
        // Test completado
        const total = newScores.reduce((a, b) => a + b, 0)
        const lvl = getLevel(total)
        setScore(total)
        setLevel(lvl)
        setStep('result')
        events.lead()
      }
    }, 250)
  }

  async function handleSubmit() {
    if (!email.includes('@')) {
      setEmailError('Introduce un email válido')
      return
    }
    setEmailError('')
    setSubmitting(true)
    events.completeRegistration(level)
    events.initiateCheckout()

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score, level }),
      })
    } catch (_) {}

    window.location.href = process.env.NEXT_PUBLIC_STRIPE_LINK!
  }

  const cfg = LEVEL_CONFIG[level]
  const progress = ((currentQ) / QUESTIONS.length) * 100

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F4EFE6; }
      `}</style>

      <div style={{ background: '#F4EFE6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── BARRA SUPERIOR ── */}
        <div style={{
          height: 44,
          background: '#1C3D50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          {/* Logo SVG Nodo Vago */}
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="rgba(244,239,230,0.5)" strokeWidth="1.5"/>
            <circle cx="20" cy="20" r="4" fill="rgba(244,239,230,0.8)"/>
            <path d="M20 20 C14 14, 10 10, 20 4" stroke="rgba(244,239,230,0.6)" strokeWidth="1.2" fill="none"/>
            <path d="M20 20 C26 14, 30 10, 20 4" stroke="rgba(244,239,230,0.6)" strokeWidth="1.2" fill="none"/>
            <path d="M20 20 C12 22, 8 28, 16 34" stroke="rgba(244,239,230,0.5)" strokeWidth="1.2" fill="none"/>
            <path d="M20 20 C28 22, 32 28, 24 34" stroke="rgba(244,239,230,0.5)" strokeWidth="1.2" fill="none"/>
          </svg>
          <span style={{
            color: 'rgba(244,239,230,0.7)',
            fontSize: 10,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            IEN · neurobienestar.institute
          </span>
        </div>

        {/* ── CONTENIDO ── */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 0 40px' }}>

          {/* ── HERO ── */}
          <div style={{ padding: '32px 20px 24px' }}>
            {/* Badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(43,122,139,0.12)',
                color: '#2B7A8B',
                fontSize: 10,
                fontFamily: "'DM Sans', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderRadius: 20,
                padding: '4px 14px',
              }}>
                Test diagnóstico · 2 minutos · Gratuito
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(30px, 8vw, 36px)',
              fontWeight: 400,
              color: '#1C3D50',
              lineHeight: 1.15,
              marginBottom: 12,
            }}>
              ¿Lleva años sintiéndose así sin que nadie le dé una explicación?
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: '#5F5E5A',
              lineHeight: 1.65,
            }}>
              El siguiente test evalúa en 2 minutos si su nervio vago está inhibido.
            </p>
          </div>

          {/* ── TEST / RESULTADO ── */}
          <div style={{ padding: '0 20px' }}>
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: '24px 20px',
              border: '1px solid rgba(28,61,80,0.12)',
              boxShadow: '0 2px 16px rgba(28,61,80,0.06)',
            }}>

              {step === 'test' && (
                <div key={animKey} className="question-in">
                  {/* Progreso */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{
                      height: 3,
                      background: 'rgba(28,61,80,0.08)',
                      borderRadius: 2,
                      marginBottom: 8,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: '#2B7A8B',
                        borderRadius: 2,
                        transition: 'width 300ms ease',
                      }} />
                    </div>
                    <p style={{
                      fontSize: 10,
                      color: '#8E9CA3',
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: 'right',
                    }}>
                      Pregunta {currentQ + 1} de {QUESTIONS.length}
                    </p>
                  </div>

                  {/* Pregunta */}
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: '#1C3D50',
                    lineHeight: 1.4,
                    marginBottom: 20,
                  }}>
                    {QUESTIONS[currentQ]}
                  </p>

                  {/* Opciones */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleOption(opt.value)}
                        style={{
                          border: selected === opt.value
                            ? '1.5px solid #1C3D50'
                            : '1.5px solid rgba(28,61,80,0.18)',
                          background: selected === opt.value
                            ? 'rgba(28,61,80,0.06)'
                            : 'transparent',
                          borderRadius: 8,
                          padding: '13px 16px',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          color: '#1A2326',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'all 150ms ease',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'result' && (
                <div ref={resultRef} className="fade-in-up">
                  {/* Pill nivel */}
                  <div style={{ marginBottom: 16 }}>
                    <span style={{
                      display: 'inline-block',
                      background: cfg.pillBg,
                      color: cfg.pillColor,
                      fontSize: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      borderRadius: 20,
                      padding: '4px 14px',
                      fontWeight: 500,
                    }}>
                      {cfg.pill}
                    </span>
                  </div>

                  {/* Titular */}
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 24,
                    fontWeight: 400,
                    color: '#1C3D50',
                    lineHeight: 1.3,
                    marginBottom: 12,
                  }}>
                    {cfg.title}
                  </h2>

                  {/* Cuerpo */}
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: '#5F5E5A',
                    lineHeight: 1.7,
                    marginBottom: 0,
                  }}>
                    {cfg.body}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── SECCIÓN PRECIO ── */}
          {step === 'result' && (
            <div style={{ padding: '0 20px', marginTop: 24 }}>

              {/* Fase 1: precio base 19€ */}
              {pricePhase === 'base' && (
                <div className="fade-in-up" style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: '#8E9CA3',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 8,
                  }}>
                    Protocolo Nervio Vago · Acceso completo
                  </p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 44,
                    fontWeight: 400,
                    color: '#1C3D50',
                    lineHeight: 1,
                  }}>
                    19€
                  </p>
                </div>
              )}

              {/* Fase 2: reveal con 7€ */}
              {pricePhase === 'revealed' && (
                <div className="fade-in-up">
                  {/* Banner reveal */}
                  <div style={{
                    background: 'rgba(28,61,80,0.06)',
                    border: '1px solid rgba(28,61,80,0.15)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 20,
                    textAlign: 'center',
                  }}>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10,
                      color: '#2B7A8B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                      marginBottom: 6,
                    }}>
                      Precio de acceso diagnóstico desbloqueado
                    </p>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: '#5F5E5A',
                      lineHeight: 1.5,
                    }}>
                      {cfg.revealText}
                    </p>
                  </div>

                  {/* Precios */}
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 22,
                      color: '#8E9CA3',
                      textDecoration: 'line-through',
                      marginRight: 12,
                    }}>
                      19€
                    </span>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 44,
                      fontWeight: 400,
                      color: '#1C3D50',
                    }}>
                      7€
                    </span>
                  </div>

                  {/* Timer */}
                  {!expired && (
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11,
                        color: '#8E9CA3',
                      }}>
                        Este precio expira en{' '}
                        <span style={{ color: '#B8722E', fontWeight: 500 }}>
                          {formatTime(timerLeft)}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Email + botón o expirado */}
                  {expired ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: 'rgba(28,61,80,0.04)',
                      borderRadius: 8,
                    }}>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: '#8E9CA3',
                        lineHeight: 1.6,
                      }}>
                        El precio de acceso diagnóstico ha expirado.<br />
                        El Protocolo está disponible al precio estándar de 19€.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Input email */}
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="su@email.com"
                        style={{
                          width: '100%',
                          border: emailError
                            ? '1.5px solid #E24B4A'
                            : '1.5px solid rgba(28,61,80,0.2)',
                          borderRadius: 8,
                          padding: '14px 16px',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 15,
                          color: '#1A2326',
                          background: 'white',
                          outline: 'none',
                          marginBottom: emailError ? 6 : 10,
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = '#2B7A8B'
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = emailError
                            ? '#E24B4A'
                            : 'rgba(28,61,80,0.2)'
                        }}
                      />
                      {emailError && (
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12,
                          color: '#E24B4A',
                          marginBottom: 10,
                        }}>
                          {emailError}
                        </p>
                      )}

                      {/* Botón CTA */}
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{
                          width: '100%',
                          background: submitting ? '#c89a6e' : '#B8722E',
                          color: '#F4EFE6',
                          borderRadius: 30,
                          padding: 16,
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 15,
                          fontWeight: 500,
                          border: 'none',
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          marginTop: 0,
                          transition: 'background 200ms ease',
                        }}
                      >
                        {submitting ? 'Procesando...' : cfg.cta}
                      </button>

                      {/* Texto bajo botón */}
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10,
                        color: '#8E9CA3',
                        textAlign: 'center',
                        marginTop: 10,
                        lineHeight: 1.6,
                      }}>
                        Acceso inmediato · PDF descargable · 7€ pago único · Garantía 30 días
                      </p>

                      {/* Trust badges */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 12,
                        marginTop: 16,
                        flexWrap: 'wrap',
                      }}>
                        {[
                          { icon: '🔒', text: 'Pago seguro' },
                          { icon: '📄', text: 'Descarga inmediata' },
                          { icon: '↩️', text: 'Garantía 30 días' },
                        ].map(item => (
                          <span key={item.text} style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 11,
                            color: '#8E9CA3',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            {item.icon} {item.text}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          background: '#1C3D50',
          padding: 20,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: 'rgba(244,239,230,0.4)',
            lineHeight: 1.7,
          }}>
            © 2025 Instituto Español de Neurobienestar · Método MAV<br />
            neurobienestar.institute
          </p>
        </div>
      </div>
    </>
  )
}
