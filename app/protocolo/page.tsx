'use client'

import { useState, useEffect } from 'react'
import CountdownTimer from '@/components/CountdownTimer'
import { events } from '@/lib/meta-pixel'

const TECNICAS = [
  {
    id: 'T1', name: 'Espiración Larga', duration: '30 seg', via: 'vía respiratoria',
    unlocked: true, note: 'Vía de entrada — la más accesible, sin equipamiento.',
  },
  { id: 'T2', name: 'Zumbido Vagal',        duration: '60 seg',   via: 'vía laríngea',          unlocked: false },
  { id: 'T3', name: 'Mirada Suave',          duration: '90 seg',   via: 'vía visual',            unlocked: false },
  { id: 'T4', name: 'Ancla Fría',            duration: '30 seg',   via: 'vía trigémino-vagal',   unlocked: false },
  { id: 'T5', name: 'Automasaje Vagal',      duration: '3 min',    via: 'vía cervical',          unlocked: false },
  { id: 'T6', name: 'Gargarismo Activo',     duration: '2 min',    via: 'vía faríngea',          unlocked: false },
  { id: 'T7', name: 'Protocolo Secuencial',  duration: '5-7 min',  via: 'combinación completa',  unlocked: false },
]

const INCLUYE = [
  {
    title: 'El Protocolo completo en PDF',
    desc: 'Las 7 técnicas MAV con instrucciones exactas, fisiología de cada vía vagal, y guía de referencia rápida para imprimir y usar a diario.',
  },
  {
    title: 'Garantía de devolución íntegra · 30 días',
    desc: 'Aplica las técnicas durante 30 días. Si no notas un cambio real, te devolvemos los 7€ íntegros respondiendo a un solo email. Sin formularios, sin preguntas, sin justificaciones.',
  },
  {
    title: 'Sin terminología médica innecesaria',
    desc: 'Cada técnica explicada en lenguaje claro. Sabes qué hacer, cuántos ciclos, cuándo aplicarla, y qué notar después.',
  },
  {
    title: 'Acceso inmediato y permanente',
    desc: 'Lo descargas, lo guardas, lo consultas siempre que quieras. Tuyo para siempre.',
  },
]

export default function ProtocoloPage() {
  const [timerExpired, setTimerExpired] = useState(false)

  useEffect(() => { events.viewContent() }, [])

  function handleCheckout() {
    events.initiateCheckout()
    window.location.href = process.env.NEXT_PUBLIC_STRIPE_LINK!
  }

  const sep = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 32px', opacity: 0.25 }}>
      <div style={{ flex: 1, height: 1, background: '#1C3D50' }} />
      <div style={{ width: 6, height: 6, background: '#1C3D50', transform: 'rotate(45deg)' }} />
      <div style={{ flex: 1, height: 1, background: '#1C3D50' }} />
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F4EFE6 !important; }
        @media (max-width: 480px) {
          .proto-h1  { font-size: 34px !important; }
          .proto-sub { font-size: 15px !important; }
          .proto-respond { font-size: 40px !important; }
        }
      `}</style>

      <div style={{ background: '#F4EFE6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── HEADER ── */}
        <header style={{ background: '#1C3D50', padding: '16px 20px', textAlign: 'center' }}>
          <div style={{
            color: '#F4EFE6',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            letterSpacing: '0.14em',
          }}>
            IEN
          </div>
          <div style={{
            color: 'rgba(244,239,230,0.45)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginTop: 3,
          }}>
            neurobienestar.institute
          </div>
        </header>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 60px' }}>

          {/* ══════════════════════════════
              BLOQUE 1 — HERO ABOVE THE FOLD
          ══════════════════════════════ */}
          <div style={{ padding: '40px 0 32px' }}>

            {/* Pill */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(43,122,139,0.08)',
              border: '1px solid rgba(43,122,139,0.22)',
              borderRadius: 20,
              padding: '4px 14px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9,
              color: '#2B7A8B',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.14em',
              marginBottom: 22,
            }}>
              Instituto Español de Neurobienestar · Protocolo Completo
            </div>

            <h1 className="proto-h1" style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(34px, 9vw, 50px)',
              fontWeight: 600,
              color: '#1A2326',
              lineHeight: 1.1,
              marginBottom: 22,
            }}>
              Ya conoces cómo empieza.<br />
              Aquí tienes el resto.
            </h1>

            <p className="proto-sub" style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 'clamp(15px, 3.8vw, 18px)',
              fontWeight: 300,
              color: '#3D4F55',
              lineHeight: 1.75,
              margin: 0,
            }}>
              Las 6 técnicas restantes del Método MAV — ordenadas por impacto,
              con instrucciones exactas y la fisiología que las respalda.
            </p>
          </div>

          {sep}

          {/* ══════════════════════════════
              BLOQUE 2 — RECONEXIÓN
          ══════════════════════════════ */}
          <div style={{ marginBottom: 40 }}>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 16,
              color: '#1A2326',
              lineHeight: 1.8,
              marginBottom: 18,
            }}>
              Hace unos días hiciste el test del Instituto Español de Neurobienestar.
              Ya conoces tu nivel de inhibición vagal.
            </p>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 16,
              color: '#1A2326',
              lineHeight: 1.8,
              marginBottom: 18,
            }}>
              Lo que sigue es la pieza completa del protocolo:
            </p>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 16,
              color: '#1A2326',
              lineHeight: 1.8,
              marginBottom: 28,
            }}>
              Las 7 técnicas. Una por cada vía vagal del sistema nervioso autónomo.
              Cada una activando una capa distinta del freno parasimpático. Cada una
              sumando al efecto de las anteriores.
            </p>

            <div style={{
              borderLeft: '3px solid #2B7A8B',
              paddingLeft: 20,
              margin: '0 0 4px',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(18px, 4.5vw, 22px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#1A2326',
                lineHeight: 1.5,
                margin: 0,
              }}>
                &ldquo;El nervio vago no responde al tiempo que le dedicas.
                Responde a la precisión del estímulo.&rdquo;
              </p>
            </div>
          </div>

          {sep}

          {/* ══════════════════════════════
              BLOQUE 3 — LAS 7 TÉCNICAS
          ══════════════════════════════ */}
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fontWeight: 500,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.13em',
              color: '#2B7A8B',
              paddingBottom: 8,
              borderBottom: '1.5px solid #2B7A8B',
              display: 'inline-block',
              marginBottom: 18,
            }}>
              El Método MAV — 7 Técnicas Ordenadas por Impacto
            </div>

            <div style={{
              border: '1px solid rgba(28,61,80,0.12)',
              borderRadius: 8,
              overflow: 'hidden',
            }}>
              {TECNICAS.map((t, i) => (
                <div key={t.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '14px 16px',
                  background: t.unlocked ? 'rgba(43,122,139,0.05)' : 'white',
                  borderBottom: i < TECNICAS.length - 1 ? '1px solid rgba(28,61,80,0.08)' : 'none',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    background: t.unlocked ? '#2B7A8B' : 'transparent',
                    border: t.unlocked ? 'none' : '1.5px solid #C5CDD0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {t.unlocked && (
                      <span style={{ color: '#F4EFE6', fontSize: 11 }}>✓</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex', flexWrap: 'wrap' as const,
                      alignItems: 'baseline', gap: '3px 10px', marginBottom: t.note ? 3 : 0,
                    }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14, fontWeight: 500,
                        color: t.unlocked ? '#1C3D50' : '#5A6E75',
                      }}>
                        {t.id} · {t.name}
                      </span>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11, color: '#8E9CA3',
                      }}>
                        {t.duration} · {t.via}
                      </span>
                    </div>
                    {t.note && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11, color: '#2B7A8B', fontStyle: 'italic',
                      }}>
                        {t.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 14, color: '#5A6E75', lineHeight: 1.65, marginTop: 14,
            }}>
              Cada una activa una vía vagal distinta del sistema nervioso autónomo.
              En el PDF, cada técnica incluye instrucciones precisas paso a paso, la
              fisiología que la respalda, y qué notar al aplicarla.
            </p>
          </div>

          {/* ══════════════════════════════
              BLOQUE 4 — LO QUE RECIBES
          ══════════════════════════════ */}
          <div style={{
            background: 'rgba(43,122,139,0.05)',
            border: '1px solid rgba(43,122,139,0.18)',
            borderRadius: 8,
            padding: '24px 20px',
            marginBottom: 32,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 500,
              textTransform: 'uppercase' as const, letterSpacing: '0.12em',
              color: '#2B7A8B', marginBottom: 20,
            }}>
              Lo que recibes en tu email en menos de 2 minutos
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
              {INCLUYE.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 20, height: 20,
                    background: '#2B7A8B', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 3,
                  }}>
                    <span style={{ color: '#F4EFE6', fontSize: 11 }}>✓</span>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14, fontWeight: 500, color: '#1C3D50', marginBottom: 4,
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 13, color: '#5A6E75', lineHeight: 1.65,
                    }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════
              BLOQUE 5 — OFERTA + TIMER
          ══════════════════════════════ */}
          <div style={{
            background: '#1C3D50',
            borderRadius: 10,
            padding: '28px 24px',
            marginBottom: 32,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 500,
              textTransform: 'uppercase' as const, letterSpacing: '0.12em',
              color: '#9FE1CB', marginBottom: 14,
            }}>
              Precio de acceso por test diagnóstico
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
              <span style={{
                fontFamily: 'Georgia, serif', fontSize: 16,
                color: 'rgba(244,239,230,0.38)', textDecoration: 'line-through',
              }}>
                19€
              </span>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 58, color: '#F4EFE6', lineHeight: 1, fontWeight: 600,
              }}>
                7€
              </span>
            </div>

            <p style={{
              fontFamily: 'Georgia, serif', fontSize: 13,
              color: 'rgba(244,239,230,0.65)', lineHeight: 1.65,
              margin: '0 0 20px', fontStyle: 'italic',
            }}>
              El IEN reserva este precio para quienes ya han probado la primera técnica
              y han decidido completar el método.
            </p>

            {/* Timer */}
            <div style={{
              background: 'rgba(244,239,230,0.08)',
              borderRadius: 6,
              padding: '10px 14px',
              marginBottom: 6,
            }}>
              <CountdownTimer onExpire={() => setTimerExpired(true)} />
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: 'rgba(244,239,230,0.52)', textAlign: 'center',
              margin: '0 0 20px',
            }}>
              Cuando el contador llegue a cero, el acceso vuelve a 19€.
            </p>

            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                background: timerExpired ? '#5A6E75' : '#B8722E',
                color: '#F4EFE6',
                border: 'none',
                borderRadius: 6,
                padding: '18px 24px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 17, fontWeight: 500,
                cursor: 'pointer',
                minHeight: 52,
                letterSpacing: '0.02em',
              }}
            >
              Desbloquear las 6 técnicas restantes →
            </button>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: 'rgba(244,239,230,0.75)',
              textAlign: 'center', margin: '12px 0 0',
            }}>
              Pago seguro · Acceso inmediato · 30 días de garantía
            </p>
          </div>

          {/* ══════════════════════════════
              BLOQUE 6 — GARANTÍA REFORZADA
          ══════════════════════════════ */}
          <div style={{
            background: '#FAF6F0',
            border: '1.5px solid rgba(43,122,139,0.22)',
            borderRadius: 8,
            padding: '24px 20px',
            marginBottom: 32,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 500,
              textTransform: 'uppercase' as const, letterSpacing: '0.12em',
              color: '#2B7A8B', marginBottom: 16,
            }}>
              Garantía 30 días · Transparente
            </div>

            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 15, color: '#1A2326', lineHeight: 1.75, marginBottom: 14,
            }}>
              Prueba las 7 técnicas durante 30 días aplicando las instrucciones del PDF.
            </p>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 15, color: '#1A2326', lineHeight: 1.75, marginBottom: 20,
            }}>
              Si al cabo de ese tiempo no notas un cambio real en tu sistema nervioso,
              nos escribes a un solo email y te devolvemos los 7€ íntegros.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 18 }}>
              {['Sin formularios.', 'Sin justificaciones.', 'Sin preguntas.'].map((line, i) => (
                <div key={i} style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15, fontWeight: 500, color: '#1A2326',
                }}>
                  {line}
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 13, color: '#5A6E75', lineHeight: 1.65, margin: 0,
            }}>
              Lo escribimos aquí porque lo cumplimos siempre. Un método que trabaja
              sobre el sistema nervioso autónomo debe poder demostrarse con la propia
              experiencia del cuerpo, no con promesas.
            </p>
          </div>

        </div>

        {/* ══════════════════════════════
            BLOQUE 7 — FOOTER
        ══════════════════════════════ */}
        <footer style={{ background: '#1C3D50', padding: '28px 20px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              color: '#F4EFE6',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 20, letterSpacing: '0.14em', marginBottom: 8,
            }}>
              IEN
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, color: 'rgba(244,239,230,0.5)',
              lineHeight: 1.6, marginBottom: 14,
            }}>
              Instituto Español de Neurobienestar<br />neurobienestar.institute
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' as const, gap: '6px 14px', marginBottom: 12 }}>
              {['Aviso legal', 'Política de privacidad', 'Contacto'].map((label, i) => (
                <a key={i} href="#" style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10, color: 'rgba(244,239,230,0.38)',
                  textDecoration: 'none',
                }}>
                  {label}
                </a>
              ))}
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, color: 'rgba(244,239,230,0.3)', margin: 0,
            }}>
              © 2025 IEN · Método MAV
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}
