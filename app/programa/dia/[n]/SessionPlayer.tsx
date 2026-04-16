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
  const [progress, setProgress] = useState(0) // 0-100
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showDiary, setShowDiary] = useState(isCompleted)
  const [diary, setDiary] = useState(existingDiary)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)

  // Fetch signed audio URL
  useEffect(() => {
    fetch(`/api/programa/audio/${day}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setAudioUrl(data.url)
        else setAudioError(true)
      })
      .catch(() => setAudioError(true))
  }, [day])

  // Show diary when 80% played
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

  // No seeking allowed — progress bar is display-only
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
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← Dashboard
        </Link>
        <div style={{ color: 'rgba(244,239,230,0.25)', fontSize: '11px', letterSpacing: '0.1em' }}>
          DÍA {day} / 21
        </div>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Day info */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ color: 'rgba(244,239,230,0.35)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
            {content.technique}
          </div>
          <h1 style={{ color: '#F4EFE6', fontSize: '28px', fontWeight: 400, margin: '0 0 8px', lineHeight: 1.3 }}>
            {content.title}
          </h1>
          <p style={{ color: 'rgba(244,239,230,0.5)', fontSize: '15px', margin: '0 0 20px', lineHeight: 1.6 }}>
            {content.subtitle}
          </p>
          <p style={{ color: 'rgba(244,239,230,0.4)', fontSize: '14px', lineHeight: 1.8, margin: 0, borderLeft: '2px solid rgba(43,122,139,0.4)', paddingLeft: '16px' }}>
            {content.description}
          </p>
        </div>

        {/* Audio Player */}
        <div style={{
          background: '#1C3D50',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
        }}>
          {audioError ? (
            <p style={{ color: 'rgba(244,239,230,0.4)', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Audio no disponible. Contacta con soporte.
            </p>
          ) : !audioUrl ? (
            <p style={{ color: 'rgba(244,239,230,0.4)', fontSize: '14px', textAlign: 'center', margin: 0 }}>
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
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <button
                  onClick={handlePlayPause}
                  style={{
                    background: '#B8722E',
                    border: 'none',
                    borderRadius: '50%',
                    width: '72px',
                    height: '72px',
                    color: '#F4EFE6',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>

              {/* Progress bar — no-skip */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{
                  background: 'rgba(244,239,230,0.1)',
                  borderRadius: '3px',
                  height: '4px',
                  overflow: 'hidden',
                  cursor: 'default',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #2B7A8B, #4EAABB)',
                    borderRadius: '3px',
                    transition: 'width 0.5s linear',
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(244,239,230,0.3)', fontSize: '12px' }}>{formatTime(currentTime)}</span>
                <span style={{ color: 'rgba(244,239,230,0.3)', fontSize: '12px' }}>{formatTime(duration)}</span>
              </div>

              {progress < 80 && (
                <p style={{ color: 'rgba(244,239,230,0.25)', fontSize: '12px', textAlign: 'center', marginTop: '16px', marginBottom: 0 }}>
                  El diario aparece cuando completes el 80% de la sesión
                </p>
              )}
            </>
          )}
        </div>

        {/* Diary */}
        {showDiary && (
          <div style={{
            background: '#1C3D50',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
          }}>
            <h3 style={{ color: '#F4EFE6', fontSize: '16px', fontWeight: 400, margin: '0 0 8px' }}>
              Diario de sesión
            </h3>
            <p style={{ color: 'rgba(244,239,230,0.45)', fontSize: '13px', lineHeight: 1.7, margin: '0 0 20px' }}>
              ¿Qué notaste hoy? ¿Hubo algún momento en que el cuerpo respondió? No hay respuestas correctas.
            </p>
            <textarea
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
              disabled={completed && saved}
              placeholder="Escribe aquí tu experiencia de hoy..."
              rows={5}
              style={{
                width: '100%',
                background: 'rgba(244,239,230,0.06)',
                border: '1px solid rgba(244,239,230,0.12)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: '#F4EFE6',
                fontSize: '14px',
                lineHeight: 1.7,
                fontFamily: 'Georgia, serif',
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
              padding: '18px',
              background: saving ? 'rgba(43,122,139,0.5)' : '#2B7A8B',
              color: '#F4EFE6',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              cursor: saving ? 'not-allowed' : 'pointer',
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
            color: '#4EAABB',
            fontSize: '15px',
          }}>
            {completionMsg}
          </div>
        )}
      </div>
    </div>
  )
}
