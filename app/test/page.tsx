'use client'

import { useState, useEffect } from 'react'
import CountdownTimer from '@/components/CountdownTimer'
import { events } from '@/lib/meta-pixel'

// ─── DATOS ────────────────────────────────────────────────────────────────────

const preguntas = [
  '¿Se levanta cansado aunque haya dormido suficiente?',
  '¿Su digestión empeora cuando hay tensión?',
  '¿Nota tensión en cuello u hombros sin haber hecho esfuerzo?',
  '¿Le cuesta apagar la mente cuando intenta dormir?',
  '¿Siente que pasa el día presente pero sin estar del todo aquí?',
]

const opciones = [
  { label: 'Casi nunca',     value: 1 },
  { label: 'A veces',        value: 2 },
  { label: 'Frecuentemente', value: 3 },
  { label: 'Casi siempre',   value: 4 },
]

type Level = 'verde' | 'amber' | 'rojo'

function calcLevel(s: number): Level {
  if (s <= 9)  return 'verde'
  if (s <= 14) return 'amber'
  return 'rojo'
}

const PILL: Record<Level, { label: string; bg: string; color: string }> = {
  verde: { label: 'Nivel Verde · Señales tempranas',  bg: '#EAF3DE', color: '#27500A' },
  amber: { label: 'Nivel Ámbar · Activación crónica', bg: '#FAEEDA', color: '#633806' },
  rojo:  { label: 'Nivel Rojo · Modo supervivencia',  bg: '#FCEBEB', color: '#791F1F' },
}

const TITULO: Record<Level, string> = {
  verde: 'Su sistema nervioso todavía tiene margen.',
  amber: 'Su nervio vago lleva tiempo pidiendo atención.',
  rojo:  'Su cuerpo lleva demasiado tiempo en alerta.',
}

const EXPLICACION: Record<Level, string> = {
  verde: 'Su nervio vago ya envía señales de desequilibrio. El momento correcto para actuar es ahora, antes de que el sistema se sature.',
  amber: 'Sus respuestas indican nervio vago inhibido en activación crónica. El cuerpo lleva tiempo en modo alerta sin poder salir solo.',
  rojo:  'Un sistema nervioso en modo supervivencia sostenido no se regula solo. El nervio vago necesita estimulación directa y precisa para recalibrar.',
}

const REVEAL_TEXT: Record<Level, string> = {
  verde: 'El IEN reserva este precio para quienes llegan antes de que el sistema se sature.',
  amber: 'El IEN reserva este precio para quienes han decidido que es el momento de actuar.',
  rojo:  'El IEN reserva este precio para quienes ya saben que esto no va a resolverse solo.',
}

const CTA: Record<Level, string> = {
  verde: 'Acceder al Protocolo →',
  amber: 'Activar mi nervio vago →',
  rojo:  'Empezar hoy →',
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function TestPage() {

  // ── Fecha ──
  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const dateDisplay = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  // ── Modal state ──
  const [modalOpen, setModalOpen]           = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers]               = useState<number[]>([])
  const [phase, setPhase]                   = useState<'test' | 'email' | 'result'>('test')
  const [email, setEmail]                   = useState('')
  const [emailError, setEmailError]         = useState('')
  const [score, setScore]                   = useState(0)
  const [level, setLevel]                   = useState<Level>('verde')
  const [submitting, setSubmitting]         = useState(false)
  const [timerExpired, setTimerExpired]     = useState(false)
  const [animKey, setAnimKey]               = useState(0)

  // ── ViewContent al cargar ──
  useEffect(() => { events.viewContent() }, [])

  // ── Body scroll lock ──
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  // ── Handlers ──
  function handleAnswer(value: number) {
    const next = [...answers, value]
    setAnswers(next)
    if (next.length === 5) {
      const total = next.reduce((a, b) => a + b, 0)
      setScore(total)
      events.lead()
      setTimeout(() => setPhase('email'), 250)
    } else {
      setTimeout(() => { setCurrentQuestion(q => q + 1); setAnimKey(k => k + 1) }, 250)
    }
  }

  function closeModal() {
    setModalOpen(false)
    setCurrentQuestion(0)
    setAnswers([])
    setPhase('test')
    setEmail('')
    setEmailError('')
    setAnimKey(0)
  }

  async function handleEmailSubmit() {
    if (!email || !email.includes('@')) { setEmailError('Introduzca un email válido'); return }
    setEmailError('')
    setSubmitting(true)
    const lvl = calcLevel(score)
    setLevel(lvl)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score, level: lvl }),
      })
      events.completeRegistration(lvl)
    } catch {}
    setPhase('result')
    setSubmitting(false)
  }

  function handlePayment() {
    events.initiateCheckout()
    window.location.href = process.env.NEXT_PUBLIC_STRIPE_LINK!
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F0E8 !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .modal-fade { animation: fadeIn 300ms ease; }
        .opt-btn { transition: border-color 120ms ease, background 120ms ease; cursor: pointer; }
        .opt-btn:hover { border-color: #2B7A8B !important; background: rgba(43,122,139,0.04) !important; }
        @media (max-width: 640px) {
          .hdr-inner         { padding: 6px 20px 8px !important; }
          .masthead-title    { font-size: 24px !important; margin-bottom: 2px !important; }
          .masthead-sub      { font-size: 9px !important; }
          .art-category      { font-size: 11px !important; margin: 12px 0 8px !important; }
          .art-h1            { font-size: 30px !important; line-height: 1.1 !important; margin-bottom: 14px !important; }
          .art-lead          { font-size: 17px !important; line-height: 1.75 !important; color: #333 !important; margin-bottom: 10px !important; }
          .art-byline p      { font-size: 11px !important; }
          .art-byline        { margin: 0 0 10px !important; padding: 4px 0 !important; }
          .art-sep           { margin: 6px 0 !important; }
          .art-sep-text      { margin-bottom: 8px !important; }
          .cta-btn           { font-size: 17px !important; padding: 20px !important; }
          .cta-sub           { font-size: 12px !important; }
        }
      `}</style>

      <div style={{ background: '#F5F0E8', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── CABECERA PERIÓDICO ── */}
        <header style={{ background: 'white', borderTop: '3px solid #1C3D50', borderBottom: '2px solid #1A1A1A' }}>
          <div className="hdr-inner" style={{ maxWidth: 640, margin: '0 auto', padding: '10px 20px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Salud · Neurociencia
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#666' }}>
                {dateDisplay}
              </span>
            </div>
            <div style={{ borderTop: '0.5px solid #CCC', marginBottom: 10 }} />
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

          <div className="art-byline" style={{ borderTop: '0.5px solid #CCC', borderBottom: '0.5px solid #CCC', padding: '6px 0', marginBottom: 20 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888' }}>
              IEN · Neurociencia Clínica · {dateDisplay}
            </p>
          </div>

          {/* Separador */}
          <div className="art-sep" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 20px', opacity: 0.4 }}>
            <div style={{ flex: 1, height: 1, background: '#1C3D50' }} />
            <div style={{ width: 7, height: 7, background: '#1C3D50', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: 1, background: '#1C3D50' }} />
          </div>

          <p className="art-sep-text" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#555', textAlign: 'center', fontStyle: 'italic', marginBottom: 16 }}>
            Complete el siguiente cuestionario diagnóstico
          </p>

          {/* ── BOTÓN CTA ── */}
          <button
            className="cta-btn"
            onClick={() => setModalOpen(true)}
            style={{
              width: '100%',
              background: '#1C3D50',
              color: '#F4EFE6',
              border: 'none',
              borderRadius: 4,
              padding: '18px 20px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            Iniciar test diagnóstico →
          </button>
          <p className="cta-sub" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#888', textAlign: 'center', margin: '0 0 24px' }}>
            2 minutos · Gratuito · Resultado inmediato
          </p>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '2px solid #1A1A1A', padding: '16px 20px', background: '#F5F0E8' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888' }}>Instituto Español de Neurobienestar</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888', textAlign: 'right' }}>© 2025 · neurobienestar.institute · Método MAV</span>
          </div>
        </footer>
      </div>

      {/* ════════════════════════════════════════════
          MODAL PANTALLA COMPLETA
      ════════════════════════════════════════════ */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#F5F0E8',
          zIndex: 1000,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Header sticky */}
          <div style={{
            position: 'sticky',
            top: 0,
            background: '#1C3D50',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(244,239,230,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Test Diagnóstico · Nervio Vago
            </span>
            <button
              onClick={closeModal}
              style={{ background: 'none', border: 'none', color: 'rgba(244,239,230,0.6)', fontSize: 20, cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {/* Contenido modal */}
          <div style={{ flex: 1, maxWidth: 560, margin: '0 auto', padding: '24px 20px 40px', width: '100%' }}>

            {/* ── FASE TEST ── */}
            {phase === 'test' && (
              <div key={animKey} className="modal-fade">
                {/* Progreso */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ height: 3, background: 'rgba(28,61,80,0.1)', borderRadius: 2, marginBottom: 6 }}>
                    <div style={{
                      height: '100%',
                      width: `${(currentQuestion / 5) * 100}%`,
                      background: '#2B7A8B',
                      borderRadius: 2,
                      transition: 'width 300ms ease',
                    }} />
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#8E9CA3', textAlign: 'right' }}>
                    Pregunta {currentQuestion + 1} de 5
                  </div>
                </div>

                {/* Pregunta */}
                <h2 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: '#1A1A1A',
                  lineHeight: 1.3,
                  marginBottom: 28,
                }}>
                  {preguntas[currentQuestion]}
                </h2>

                {/* Opciones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {opciones.map((op, i) => (
                    <button
                      key={i}
                      className="opt-btn"
                      onClick={() => handleAnswer(op.value)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '14px 16px',
                        border: '1.5px solid rgba(28,61,80,0.18)',
                        borderRadius: 6,
                        background: 'white',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: '#1A2326',
                      }}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── FASE EMAIL ── */}
            {phase === 'email' && (
              <div className="modal-fade">
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#2B7A8B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                  Test completado
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 400, color: '#1A1A1A', lineHeight: 1.2, marginBottom: 12 }}>
                  Su diagnóstico está listo.
                </h2>
                <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, color: '#555', lineHeight: 1.65, marginBottom: 24 }}>
                  Introduzca su email para ver el resultado de su diagnóstico.
                </p>

                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
                  placeholder="su@email.com"
                  style={{
                    width: '100%',
                    border: emailError ? '1.5px solid #dc2626' : '1.5px solid rgba(28,61,80,0.2)',
                    borderRadius: 4,
                    padding: '14px 16px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    color: '#1A2326',
                    background: 'white',
                    outline: 'none',
                    marginBottom: emailError ? 6 : 10,
                  }}
                  onFocus={e => { e.target.style.borderColor = '#1C3D50' }}
                  onBlur={e => { e.target.style.borderColor = emailError ? '#dc2626' : 'rgba(28,61,80,0.2)' }}
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
                    background: submitting ? '#8E9CA3' : '#1C3D50',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: 16,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Un momento...' : 'Ver mi diagnóstico →'}
                </button>

                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#999', textAlign: 'center', marginTop: 10 }}>
                  Sin spam. Puede darse de baja en cualquier momento.
                </p>
              </div>
            )}

            {/* ── FASE RESULTADO ── */}
            {phase === 'result' && (
              <div className="modal-fade">

                {/* Pill nivel */}
                <span style={{
                  background: PILL[level].bg,
                  color: PILL[level].color,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '3px 12px',
                  borderRadius: 20,
                  display: 'inline-block',
                  marginBottom: 14,
                }}>
                  {PILL[level].label}
                </span>

                {/* Titular */}
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.15, marginBottom: 16 }}>
                  {TITULO[level]}
                </h2>

                {/* Explicación */}
                <div style={{ background: '#F0F4F8', borderLeft: '3px solid #1C3D50', padding: '14px 16px', marginBottom: 14 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1C3D50', marginBottom: 8 }}>
                    Qué significa este resultado
                  </div>
                  <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, color: '#333', lineHeight: 1.7, margin: 0 }}>
                    {EXPLICACION[level]}
                  </p>
                </div>

                {/* Lo que recibe */}
                <div style={{ borderTop: '0.5px solid #CCC', paddingTop: 14, marginBottom: 14 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: 10 }}>
                    Lo que recibe
                  </div>
                  {[
                    'Protocolo Nervio Vago · PDF descargable',
                    '7 técnicas MAV ordenadas por impacto',
                    'Instrucciones exactas de aplicación',
                    'Acceso inmediato tras el pago',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: '#333' }}>
                      <span style={{ color: '#2B7A8B', fontSize: 12, flexShrink: 0 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Caja precio */}
                <div style={{ border: '1px solid #CCC', borderTop: '3px solid #B8722E', padding: 16, background: 'white' }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#B8722E', marginBottom: 10 }}>
                    Precio de acceso diagnóstico
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#999', textDecoration: 'line-through' }}>
                      Precio habitual: 19€
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, color: '#1A1A1A', lineHeight: 1 }}>
                      7€
                    </span>
                  </div>

                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#888', margin: '0 0 14px' }}>
                    Pago único · Acceso inmediato · PDF descargable
                  </p>

                  {/* Timer */}
                  <CountdownTimer onExpire={() => setTimerExpired(true)} />

                  {/* Reveal text */}
                  <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 14, fontStyle: 'italic' }}>
                    {REVEAL_TEXT[level]}
                  </p>

                  {/* Botón o expirado */}
                  {!timerExpired ? (
                    <button
                      onClick={handlePayment}
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
                      }}
                    >
                      {CTA[level]}
                    </button>
                  ) : (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#888', textAlign: 'center', fontStyle: 'italic' }}>
                      El precio de acceso diagnóstico ha expirado.<br />
                      Complete el test de nuevo para desbloquearlo.
                    </p>
                  )}

                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#999', textAlign: 'center', marginTop: 10 }}>
                    Garantía de devolución 30 días sin preguntas
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
