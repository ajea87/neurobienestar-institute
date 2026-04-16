'use client'

import { useState, useEffect, useRef } from 'react'
import { events } from '@/lib/meta-pixel'

// ─── DATOS ────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  '¿Se levanta cansado aunque haya dormido suficiente?',
  '¿Su digestión empeora cuando hay tensión?',
  '¿Nota tensión en cuello u hombros sin haber hecho esfuerzo?',
  '¿Le cuesta apagar la mente cuando intenta dormir?',
  '¿Siente que pasa el día presente pero sin estar del todo aquí?',
]

const OPTIONS = [
  { label: 'Casi nunca',     value: 1 },
  { label: 'A veces',        value: 2 },
  { label: 'Frecuentemente', value: 3 },
  { label: 'Casi siempre',   value: 4 },
]

type Level = 'verde' | 'amber' | 'rojo'

function getLevel(s: number): Level {
  if (s <= 9)  return 'verde'
  if (s <= 14) return 'amber'
  return 'rojo'
}

const LEVEL_CONFIG: Record<Level, {
  pill: string; pillBg: string; pillColor: string
  title: string
  explanation: string
  cta: string
}> = {
  verde: {
    pill: 'Nivel Verde · Señales tempranas',
    pillBg: 'rgba(34,197,94,0.1)', pillColor: '#166534',
    title: 'Su sistema nervioso todavía tiene margen.',
    explanation:
      'El nervio vago es el nervio más largo del cuerpo humano. Conecta el cerebro con el corazón, los pulmones y el sistema digestivo. Cuando tiene buen tono, el cuerpo sabe cómo salir del estado de alerta y recuperarse.\n\nLas señales que describió indican que su nervio vago ya está enviando avisos. No es una crisis — es la ventana correcta para actuar antes de que el sistema se sature.',
    cta: 'Acceder al Protocolo →',
  },
  amber: {
    pill: 'Nivel Ámbar · Activación crónica',
    pillBg: 'rgba(245,158,11,0.1)', pillColor: '#92400e',
    title: 'Su nervio vago lleva tiempo pidiendo atención.',
    explanation:
      'El nervio vago regula el sistema nervioso autónomo — el sistema que controla el descanso, la digestión y la recuperación sin que usted lo decida conscientemente.\n\nCuando está inhibido por estrés crónico sostenido, el cuerpo queda atrapado en modo alerta permanente. Lo que describió en el test encaja con precisión con ese patrón.',
    cta: 'Activar mi nervio vago →',
  },
  rojo: {
    pill: 'Nivel Rojo · Modo supervivencia',
    pillBg: 'rgba(239,68,68,0.08)', pillColor: '#991b1b',
    title: 'Su cuerpo lleva demasiado tiempo en alerta.',
    explanation:
      'El nervio vago inhibido es la causa más frecuente de cansancio crónico sin causa médica visible, digestión alterada por tensión emocional y dificultad para descansar aunque el cuerpo esté agotado.\n\nUn sistema nervioso en modo supervivencia sostenido no se regula solo con el tiempo. Necesita estimulación directa y precisa del nervio vago para recalibrar.',
    cta: 'Empezar hoy →',
  },
}

const SESSION_KEY   = 'ien_test_timer_start'
const TIMER_SECS    = 25 * 60

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function TestPage() {

  // step: test → email → result
  const [step, setStep]       = useState<'test' | 'email' | 'result'>('test')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores]   = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [animKey, setAnimKey] = useState(0)

  const [score, setScore]     = useState(0)
  const [level, setLevel]     = useState<Level>('verde')

  const [email, setEmail]     = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [priceVisible, setPriceVisible] = useState(false)
  const [timerLeft, setTimerLeft]       = useState(TIMER_SECS)
  const [expired, setExpired]           = useState(false)

  const priceRef  = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  // Fecha en español
  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const dateDisplay = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  // ViewContent al cargar
  useEffect(() => { events.viewContent() }, [])

  // IntersectionObserver para revelar precio
  useEffect(() => {
    if (step !== 'result') return
    const el = priceRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setPriceVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [step])

  // Timer de sesión cuando el precio es visible
  useEffect(() => {
    if (!priceVisible) return
    let start = sessionStorage.getItem(SESSION_KEY)
    if (!start) { start = Date.now().toString(); sessionStorage.setItem(SESSION_KEY, start) }
    const tick = () => {
      const rem = TIMER_SECS - Math.floor((Date.now() - parseInt(start!)) / 1000)
      if (rem <= 0) { setTimerLeft(0); setExpired(true) } else { setTimerLeft(rem) }
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [priceVisible])

  // Scroll al resultado cuando aparece
  useEffect(() => {
    if (step === 'result') {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [step])

  function fmt(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  }

  function handleOption(value: number) {
    if (selected !== null) return
    setSelected(value)
    setTimeout(() => {
      const next = [...scores, value]
      if (currentQ < QUESTIONS.length - 1) {
        setScores(next); setCurrentQ(q => q + 1); setSelected(null); setAnimKey(k => k + 1)
      } else {
        const total = next.reduce((a, b) => a + b, 0)
        setScore(total); setLevel(getLevel(total))
        setStep('email')
        events.lead()
      }
    }, 250)
  }

  async function handleEmailSubmit() {
    if (!email.includes('@')) { setEmailError('Introduzca un email válido'); return }
    setEmailError(''); setSubmitting(true)
    events.completeRegistration(level)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score, level }),
      })
    } catch {}
    setStep('result')
    setSubmitting(false)
  }

  function handlePay() {
    events.initiateCheckout()
    window.location.href = process.env.NEXT_PUBLIC_STRIPE_LINK!
  }

  const cfg = LEVEL_CONFIG[level]
  const progress = (currentQ / QUESTIONS.length) * 100

  // ─── RENDER ───────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F0E8 !important; }
        .fade-in-np { animation: fadeInUp 400ms ease forwards; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .q-in { animation: qIn 250ms ease forwards; }
        @keyframes qIn { from { opacity:0; transform:translateX(10px); } to { opacity:1; transform:translateX(0); } }
        .opt-btn { transition: border-color 120ms ease, background 120ms ease; }
        .opt-btn:hover { border-color: #1C3D50 !important; background: rgba(28,61,80,0.04) !important; }
        @media (max-width: 640px) {
          .hdr-inner { padding: 6px 20px 8px !important; }
          .masthead-title { font-size: 20px !important; margin-bottom: 2px !important; }
          .masthead-sub { font-size: 8px !important; }
          .art-category { margin: 12px 0 8px !important; }
          .art-h1 { font-size: 24px !important; line-height: 1.05 !important; margin-bottom: 8px !important; }
          .art-lead { font-size: 13px !important; margin-bottom: 10px !important; }
          .art-byline { margin: 0 0 10px !important; padding: 4px 0 !important; }
          .art-byline p { font-size: 9px !important; }
          .art-sep { margin: 6px 0 !important; }
          .art-sep-text { margin-bottom: 8px !important; }
          .test-box { padding: 12px 16px 16px !important; }
          .test-header { margin-bottom: 8px !important; }
        }
      `}</style>

      <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── CABECERA PERIÓDICO ── */}
        <header style={{ background: 'white', borderTop: '3px solid #1C3D50', borderBottom: '2px solid #1A1A1A' }}>
          <div className="hdr-inner" style={{ maxWidth: 640, margin: '0 auto', padding: '10px 20px 12px' }}>

            {/* Fila 1 — sección + fecha */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Salud · Neurociencia
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#666' }}>
                {dateDisplay}
              </span>
            </div>

            <div style={{ borderTop: '0.5px solid #CCC', marginBottom: 10 }} />

            {/* Fila 2 — masthead */}
            <div style={{ textAlign: 'center' }}>
              <p className="masthead-title" style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(20px, 5.5vw, 28px)',
                fontWeight: 400,
                color: '#1A1A1A',
                letterSpacing: '0.02em',
                lineHeight: 1.2,
                marginBottom: 4,
              }}>
                Instituto Español de Neurobienestar
              </p>
              <p className="masthead-sub" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                neurobienestar.institute · Neurociencia aplicada
              </p>
            </div>
          </div>
        </header>

        {/* ── ARTÍCULO ── */}
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 48px' }}>

          {/* Categoría */}
          <p className="art-category" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: '#1C3D50',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            borderBottom: '1.5px solid #1C3D50',
            display: 'inline-block',
            paddingBottom: 3,
            margin: '24px 0 14px',
          }}>
            Diagnóstico · Sistema Nervioso Autónomo
          </p>

          {/* H1 */}
          <h1 className="art-h1" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(26px, 7vw, 38px)',
            fontWeight: 700,
            color: '#1A1A1A',
            lineHeight: 1.1,
            marginBottom: 14,
          }}>
            El nervio que conecta su cerebro con su estómago lleva años intentando decirle algo
          </h1>

          {/* Entradilla */}
          <p className="art-lead" style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 'clamp(14px, 3.5vw, 17px)',
            fontWeight: 300,
            color: '#333',
            lineHeight: 1.7,
            marginBottom: 14,
          }}>
            Una prueba de dos minutos determina si el nervio vago inhibido explica el cansancio, la digestión alterada y la dificultad para descansar.
          </p>

          {/* Byline */}
          <div className="art-byline" style={{
            borderTop: '0.5px solid #CCC',
            borderBottom: '0.5px solid #CCC',
            padding: '6px 0',
            marginBottom: 20,
          }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888' }}>
              IEN · Neurociencia Clínica · {dateDisplay}
            </p>
          </div>

          {/* ── SEPARADOR PERIÓDICO ── */}
          <div className="art-sep" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 20px', opacity: 0.4 }}>
            <div style={{ flex: 1, height: 1, background: '#1C3D50' }} />
            <div style={{ width: 7, height: 7, background: '#1C3D50', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: 1, background: '#1C3D50' }} />
          </div>

          <p className="art-sep-text" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#555', textAlign: 'center', fontStyle: 'italic', marginBottom: 16 }}>
            Complete el siguiente cuestionario diagnóstico
          </p>

          {/* ── CAJA TEST ── */}
          <div className="test-box" style={{
            background: 'white',
            border: '0.5px solid #CCC',
            borderTop: '3px solid #1C3D50',
            padding: 20,
          }}>
            <p className="test-header" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#1C3D50', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>
              Test Diagnóstico · Nervio Vago
            </p>

            {/* ── PREGUNTAS ── */}
            {step === 'test' && (
              <div key={animKey} className="q-in">
                {/* Barra progreso */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ height: 3, background: '#EEE', overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#1C3D50', transition: 'width 300ms ease' }} />
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#999', textAlign: 'right' }}>
                    Pregunta {currentQ + 1} de {QUESTIONS.length}
                  </p>
                </div>

                <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, color: '#1A1A1A', lineHeight: 1.55, marginBottom: 18 }}>
                  {QUESTIONS[currentQ]}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      className="opt-btn"
                      onClick={() => handleOption(opt.value)}
                      style={{
                        border: selected === opt.value ? '1.5px solid #1C3D50' : '1px solid #CCC',
                        background: selected === opt.value ? 'rgba(28,61,80,0.06)' : 'transparent',
                        padding: '12px 14px',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: '#1A1A1A',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        borderRadius: 2,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── CAPTURA EMAIL ── */}
            {step === 'email' && (
              <div className="fade-in-np">
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 15,
                  fontStyle: 'italic',
                  color: '#333',
                  textAlign: 'center',
                  lineHeight: 1.65,
                  marginBottom: 20,
                }}>
                  Introduzca su email para recibir<br />su diagnóstico personalizado
                </p>

                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
                  placeholder="su@email.com"
                  style={{
                    width: '100%',
                    border: emailError ? '1px solid #dc2626' : '1px solid #CCC',
                    borderRadius: 4,
                    padding: '12px 14px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: '#1A1A1A',
                    background: 'white',
                    outline: 'none',
                    marginBottom: emailError ? 6 : 10,
                  }}
                  onFocus={e => { e.target.style.borderColor = '#1C3D50' }}
                  onBlur={e => { e.target.style.borderColor = emailError ? '#dc2626' : '#CCC' }}
                />
                {emailError && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#dc2626', marginBottom: 10 }}>
                    {emailError}
                  </p>
                )}

                <button
                  onClick={handleEmailSubmit}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    background: submitting ? '#3a6070' : '#1C3D50',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    marginTop: 0,
                    transition: 'background 150ms ease',
                  }}
                >
                  {submitting ? 'Un momento...' : 'Ver mi resultado →'}
                </button>

                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#999', textAlign: 'center', marginTop: 8 }}>
                  Sin spam. Puede darse de baja en cualquier momento.
                </p>
              </div>
            )}

            {/* ── RESULTADO ── */}
            {step === 'result' && (
              <div ref={resultRef} className="fade-in-np">

                {/* Pill nivel */}
                <div style={{ marginBottom: 14 }}>
                  <span style={{
                    display: 'inline-block',
                    background: cfg.pillBg,
                    color: cfg.pillColor,
                    fontSize: 9,
                    fontFamily: "'DM Sans', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                    padding: '4px 12px',
                    borderRadius: 2,
                  }}>
                    {cfg.pill}
                  </span>
                </div>

                {/* Titular resultado */}
                <h2 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1A1A1A',
                  lineHeight: 1.25,
                  marginBottom: 16,
                }}>
                  {cfg.title}
                </h2>

                {/* Explicación */}
                <div style={{
                  background: '#F0F4F8',
                  borderLeft: '3px solid #1C3D50',
                  padding: 16,
                  marginBottom: 14,
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#1C3D50', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
                    Qué significa este resultado
                  </p>
                  {cfg.explanation.split('\n\n').map((para, i) => (
                    <p key={i} style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: 14,
                      color: '#333',
                      lineHeight: 1.75,
                      marginBottom: i < cfg.explanation.split('\n\n').length - 1 ? 12 : 0,
                    }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Lo que hace el protocolo */}
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 14,
                  color: '#555',
                  lineHeight: 1.7,
                }}>
                  El Protocolo Nervio Vago del IEN recoge las 7 técnicas de micro-activación vagal ordenadas por impacto. Cada técnica activa el nervio vago de forma directa, en menos de 3 minutos, sin equipamiento.
                </p>
              </div>
            )}
          </div>

          {/* ── CAJA PRECIO ── */}
          {step === 'result' && (
            <div ref={priceRef} style={{
              background: 'white',
              border: '1px solid #CCC',
              borderTop: '3px solid #B8722E',
              padding: 20,
              marginTop: 16,
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                color: '#B8722E',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 14,
              }}>
                Precio de acceso diagnóstico
              </p>

              {/* Precios */}
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: '#999',
                  textDecoration: 'line-through',
                  marginRight: 12,
                }}>
                  Precio habitual: 19€
                </span>
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 42,
                  fontWeight: 400,
                  color: '#1A1A1A',
                }}>
                  7€
                </span>
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 16 }}>
                Pago único · Acceso inmediato · PDF descargable
              </p>

              {/* Timer */}
              {priceVisible && !expired && (
                <div style={{
                  background: '#1C3D50',
                  padding: '10px 14px',
                  marginBottom: 16,
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(244,239,230,0.7)', marginBottom: 2 }}>
                    Precio disponible durante
                  </p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 22,
                    fontWeight: 500,
                    color: '#F4EFE6',
                    letterSpacing: '0.05em',
                  }}>
                    {fmt(timerLeft)}
                  </p>
                </div>
              )}

              {/* Botón o expirado */}
              {expired ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#888', lineHeight: 1.6 }}>
                    El precio de acceso diagnóstico ha expirado.<br />
                    El Protocolo está disponible al precio estándar de 19€.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handlePay}
                    style={{
                      width: '100%',
                      background: '#B8722E',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: 16,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 150ms ease',
                    }}
                  >
                    {cfg.cta}
                  </button>

                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888', textAlign: 'center', marginTop: 10 }}>
                    Garantía de devolución 30 días sin preguntas
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER PERIÓDICO ── */}
        <footer style={{ borderTop: '2px solid #1A1A1A', padding: '16px 20px', background: '#F5F0E8' }}>
          <div style={{
            maxWidth: 640,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 4,
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888' }}>
              Instituto Español de Neurobienestar
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888', textAlign: 'right' }}>
              © 2025 · neurobienestar.institute · Método MAV
            </span>
          </div>
        </footer>

      </div>
    </>
  )
}
