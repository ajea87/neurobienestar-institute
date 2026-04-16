'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DayContent, COMPLETION_MESSAGES } from '@/lib/programa-content'

interface Props {
  day: number
  content: DayContent
  isCompleted: boolean
  existingDiary: string
}

export default function SessionPlayer({ day, content, isCompleted, existingDiary }: Props) {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioError, setAudioError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showDiary, setShowDiary] = useState(isCompleted)
  const [diary, setDiary] = useState(existingDiary)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)
  const [hoverPlay, setHoverPlay] = useState(false)

  useEffect(() => {
    fetch(`/api/programa/audio/${day}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setAudioUrl(data.url)
        else setAudioError(true)
      })
      .catch(() => setAudioError(true))
  }, [day])

  useEffect(() => {
    if (progress >= 80 && !showDiary) {
      setShowDiary(true)
    }
  }, [progress, showDiary])

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const pct = (audio.currentTime / audio.duration) * 100
    setProgress(pct)
    setCurrentTime(audio.currentTime)
    setDuration(audio.duration)
  }

  function handlePlayPause() {
    const audio = audioRef.current
    if (!audio || !audioUrl) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  async function handleComplete() {
    setSaving(true)
    const res = await fetch('/api/programa/session-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, diary }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setCompleted(true)
      setTimeout(() => router.push('/programa/dashboard'), 1500)
    }
  }

  const completionMsg = COMPLETION_MESSAGES[day] || ''

  return (
    <div style={{ minHeight: '100vh', background: '#F4EFE6', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
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
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-dm-sans), sans-serif',
        }}>
          ← Dashboard
        </Link>
        <div style={{
          color: 'rgba(244,239,230,0.4)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-dm-sans), sans-serif',
        }}>
          DÍA {day} / 21
        </div>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Day info */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            color: '#2B7A8B',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: '10px',
            fontWeight: 500,
          }}>
            {content.technique}
          </div>
          <h1 style={{
            color: '#1A2326',
            fontSize: '28px',
            fontWeight: 400,
            margin: '0 0 8px',
            lineHeight: 1.3,
            fontFamily: 'var(--font-cormorant), Georgia, serif',
          }}>
            {content.title}
          </h1>
          <p style={{
            color: '#1A2326',
            fontSize: '15px',
            margin: '0 0 20px',
            lineHeight: 1.6,
            opacity: 0.65,
          }}>
            {content.subtitle}
          </p>
          <p style={{
            color: '#1A2326',
            fontSize: '14px',
            lineHeight: 1.8,
            margin: 0,
            borderLeft: '3px solid #2B7A8B',
            paddingLeft: '16px',
            opacity: 0.7,
          }}>
            {content.description}
          </p>
        </div>

        {/* Audio Player */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          borderTop: '3px solid #1C3D50',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 4px rgba(26,35,38,0.08)',
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10 Q4 6 6 10 Q8 14 10 10 Q12 6 14 10 Q16 14 18 10" stroke="#2B7A8B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            <span style={{ color: '#8E9CA3', fontSize: '11px', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
              Audio · Día {day} · {content.durationMinutes} minutos
            </span>
          </div>

          {audioError ? (
            <p style={{ color: '#8E9CA3', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Audio no disponible. Contacta con soporte.
            </p>
          ) : !audioUrl ? (
            <p style={{ color: '#8E9CA3', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Cargando audio...
            </p>
          ) : (
            <>
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={() => { setIsPlaying(false); setProgress(100) }}
                preload="metadata"
              />

              {/* Play button */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button
                  onClick={handlePlayPause}
                  onMouseEnter={() => setHoverPlay(true)}
                  onMouseLeave={() => setHoverPlay(false)}
                  style={{
                    background: hoverPlay ? '#2B7A8B' : '#1C3D50',
                    border: 'none',
                    borderRadius: '50%',
                    width: '52px',
                    height: '52px',
                    color: '#F4EFE6',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 200ms',
                  }}
                >
                  {isPlaying ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#F4EFE6">
                      <rect x="3" y="2" width="4" height="12" rx="1"/>
                      <rect x="9" y="2" width="4" height="12" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#F4EFE6" style={{ marginLeft: '2px' }}>
                      <path d="M4 2L13 8L4 14V2Z"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Progress bar — no-skip */}
              <div style={{ marginBottom: '6px' }}>
                <div style={{
                  background: 'rgba(28,61,80,0.1)',
                  borderRadius: '2px',
                  height: '4px',
                  overflow: 'hidden',
                  cursor: 'default',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: '#2B7A8B',
                    borderRadius: '2px',
                    transition: 'width 0.5s linear',
                  }} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#8E9CA3', fontSize: '11px', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {progress < 80 && (
                <p style={{ color: '#8E9CA3', fontSize: '11px', textAlign: 'center', marginTop: '14px', marginBottom: 0 }}>
                  El diario aparece cuando completes el 80% de la sesión
                </p>
              )}
            </>
          )}
        </div>

        {/* Diary */}
        {showDiary && (
          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '20px',
            borderLeft: '3px solid #2B7A8B',
            boxShadow: '0 1px 4px rgba(26,35,38,0.08)',
          }}>
            <h3 style={{
              color: '#1A2326',
              fontSize: '16px',
              fontWeight: 400,
              margin: '0 0 6px',
              fontFamily: 'var(--font-cormorant), Georgia, serif',
            }}>
              Diario de sesión
            </h3>
            <p style={{ color: '#8E9CA3', fontSize: '13px', lineHeight: 1.7, margin: '0 0 16px' }}>
              ¿Qué notaste hoy? ¿Hubo algún momento en que el cuerpo respondió?
            </p>
            <textarea
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
              disabled={completed && saved}
              placeholder="Escribe aquí tu experiencia de hoy..."
              rows={5}
              style={{
                width: '100%',
                background: '#F4EFE6',
                border: '1px solid rgba(43,122,139,0.25)',
                borderRadius: '6px',
                padding: '12px 14px',
                color: '#1A2326',
                fontSize: '14px',
                lineHeight: 1.7,
                fontFamily: 'var(--font-dm-sans), sans-serif',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Complete button */}
        {showDiary && !saved && (
          <button
            onClick={handleComplete}
            disabled={saving}
            style={{
              width: '100%',
              padding: '16px',
              background: saving ? 'rgba(184,114,46,0.5)' : '#B8722E',
              color: '#F4EFE6',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            {saving ? 'Guardando...' : `Completar día ${day} →`}
          </button>
        )}

        {saved && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#2B7A8B',
            fontSize: '16px',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontWeight: 400,
          }}>
            {completionMsg}
          </div>
        )}
      </div>
    </div>
  )
}
