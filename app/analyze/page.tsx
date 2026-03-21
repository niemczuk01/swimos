'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const STROKE_TYPES = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly']

const SYSTEM_PROMPT = `You are an elite swimming coach with 20+ years of experience coaching Olympic and collegiate swimmers. You analyze swimming video frames and provide precise, actionable stroke corrections.

When given frames from a swimming video, you will:
1. Identify the stroke type if not specified
2. Analyze key technical elements: body position, head position, arm entry/catch/pull/recovery, kick mechanics, breathing technique, body rotation, and timing
3. Identify the TOP 3 most impactful corrections the swimmer should make
4. For each correction: name the issue, explain why it matters (speed/efficiency/injury), and give a specific drill or cue to fix it
5. End with one encouraging observation about what they're doing well

Format your response EXACTLY as JSON with this structure:
{
  "stroke": "Freestyle|Backstroke|Breaststroke|Butterfly",
  "overall_score": 72,
  "summary": "One sentence overall assessment",
  "corrections": [
    {
      "title": "High Head Position",
      "severity": "high|medium|low",
      "issue": "Description of the problem observed",
      "impact": "How this affects speed/efficiency",
      "fix": "Specific drill or cue to correct it"
    }
  ],
  "strength": "One thing they are doing well"
}

Be specific, technical, and actionable. Reference what you actually observe in the frames.`

function extractFrames(file: File, maxFrames = 8): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const frames: string[] = []

    video.src = URL.createObjectURL(file)
    video.crossOrigin = 'anonymous'

    video.onloadedmetadata = () => {
      canvas.width = 640
      canvas.height = 360
      const duration = video.duration
      const interval = duration / maxFrames
      let current = 0

      const captureFrame = () => {
        if (current >= maxFrames) {
          URL.revokeObjectURL(video.src)
          resolve(frames)
          return
        }
        video.currentTime = current * interval + interval * 0.3
        current++
      }

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        frames.push(canvas.toDataURL('image/jpeg', 0.7).split(',')[1])
        captureFrame()
      }

      captureFrame()
    }

    video.onerror = () => reject(new Error('Could not load video'))
  })
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 75 ? '#00B4A0' : score >= 50 ? '#FBBF24' : '#F87171'

  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'monospace' }}>{score}</span>
        <span style={{ fontSize: 9, color: '#6B7A99', letterSpacing: 2, textTransform: 'uppercase' }}>score</span>
      </div>
    </div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, [string, string]> = {
    high: ['#F87171', 'HIGH'],
    medium: ['#FBBF24', 'MED'],
    low: ['#34D399', 'LOW'],
  }
  const [color, label] = map[severity] || map.low
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 2,
      color, border: `1px solid ${color}`, borderRadius: 3,
      padding: '2px 6px', fontFamily: 'monospace'
    }}>{label}</span>
  )
}

function CorrectionCard({ correction, index }: { correction: any; index: number }) {
  const [open, setOpen] = useState(false)
  const borderColor = correction.severity === 'high' ? '#F87171' : correction.severity === 'medium' ? '#FBBF24' : '#34D399'
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 10,
        padding: '14px 18px',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: '#E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#6B7A99',
          fontFamily: 'monospace', flexShrink: 0
        }}>{index + 1}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#0A1628' }}>{correction.title}</span>
        <SeverityBadge severity={correction.severity} />
        <span style={{ color: '#6B7A99', fontSize: 12, marginLeft: 4 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #E2E8F0' }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#6B7A99', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'monospace' }}>Issue</div>
            <p style={{ fontSize: 13, color: '#3D4A63', lineHeight: 1.6, margin: 0 }}>{correction.issue}</p>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#6B7A99', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'monospace' }}>Impact</div>
            <p style={{ fontSize: 13, color: '#3D4A63', lineHeight: 1.6, margin: 0 }}>{correction.impact}</p>
          </div>
          <div style={{
            background: '#E0FAF7', borderRadius: 7,
            padding: '10px 14px', border: '1px solid #00B4A0'
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: '#007A6C', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'monospace' }}>Fix</div>
            <p style={{ fontSize: 13, color: '#0A1628', lineHeight: 1.6, margin: 0 }}>{correction.fix}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AnalyzePage() {
  const [authChecked, setAuthChecked] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [stroke, setStroke] = useState('Auto-detect')
  const [status, setStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      setAuthChecked(true)
    })
  }, [])

  const handleFile = useCallback((f: File) => {
    if (!f || !f.type.startsWith('video/')) {
      setError('Please upload a video file (MP4, MOV, etc.)')
      return
    }
    setFile(f)
    setResult(null)
    setError('')
    setStatus('idle')
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(f)
    }
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const analyze = async () => {
    if (!file) return
    setStatus('extracting')
    setProgress('Extracting frames from video...')
    setResult(null)
    setError('')

    try {
      const frames = await extractFrames(file, 8)
      setStatus('analyzing')
      setProgress('Sending to AI coach...')

      const content = [
        {
          type: 'text',
          text: stroke !== 'Auto-detect'
            ? `Analyze this ${stroke} swimming video. Return JSON only.`
            : 'Analyze this swimming video. Return JSON only.'
        },
        ...frames.map(b64 => ({
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: b64 }
        }))
      ]

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content }]
        })
      })

      const data = await response.json()
      const text = data.content?.map((b: any) => b.text || '').join('') || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
      setStatus('done')
    } catch (err) {
      setError('Analysis failed. Please make sure your video is valid and try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setStatus('idle')
    setError('')
    setProgress('')
  }

  if (!authChecked) return <p style={{ padding: 40, color: '#6B7A99' }}>Loading...</p>

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0A1628' }}>
          AI Stroke Analysis
        </h1>
        <p style={{ color: '#6B7A99', margin: 0 }}>
          Upload a swim video and get instant coaching feedback on your technique.
        </p>
      </div>

      {/* Upload Zone */}
      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? '#00B4A0' : '#E2E8F0'}`,
            borderRadius: 14,
            padding: '48px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragActive ? '#E0FAF7' : '#F8FAFC',
            transition: 'all 0.2s',
            marginBottom: 24,
          }}
        >
          <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
          <div style={{ fontSize: 36, marginBottom: 14 }}>🎬</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#0A1628' }}>
            Drop your swim video here
          </div>
          <div style={{ fontSize: 13, color: '#6B7A99' }}>MP4, MOV, AVI — any angle works</div>
        </div>
      )}

      {/* Video Preview */}
      {file && status !== 'done' && (
        <div style={{ marginBottom: 24 }}>
          <video ref={videoRef} controls style={{
            width: '100%', borderRadius: 12,
            background: '#000', maxHeight: 280,
            border: '1px solid #E2E8F0'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 13, color: '#6B7A99' }}>{file.name}</span>
            <button onClick={reset} style={{
              background: 'none', border: 'none', color: '#6B7A99',
              cursor: 'pointer', fontSize: 13
            }}>Remove ✕</button>
          </div>
        </div>
      )}

      {/* Stroke Selector */}
      {file && status === 'idle' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#6B7A99', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace' }}>
            Stroke Type
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Auto-detect', ...STROKE_TYPES].map(s => (
              <button key={s} onClick={() => setStroke(s)} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
                background: stroke === s ? '#E0FAF7' : '#F8FAFC',
                border: stroke === s ? '1px solid #00B4A0' : '1px solid #E2E8F0',
                color: stroke === s ? '#007A6C' : '#6B7A99',
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {file && status === 'idle' && (
        <button onClick={analyze} style={{
          width: '100%', padding: '14px',
          background: '#00B4A0', color: '#fff',
          border: 'none', borderRadius: 10,
          fontSize: 15, fontWeight: 700,
          cursor: 'pointer', marginBottom: 24,
        }}>
          Analyze My Stroke →
        </button>
      )}

      {/* Loading */}
      {(status === 'extracting' || status === 'analyzing') && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          border: '1px solid #E2E8F0',
          borderRadius: 14, marginBottom: 24,
          background: '#F8FAFC',
        }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid #E2E8F0',
            borderTop: '3px solid #00B4A0',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 0.8s linear infinite'
          }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#0A1628' }}>
            {status === 'extracting' ? 'Extracting frames...' : 'AI coach is reviewing...'}
          </div>
          <div style={{ fontSize: 13, color: '#6B7A99', animation: 'pulse 2s infinite' }}>
            {progress}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#FEE2E2', border: '1px solid #FCA5A5',
          borderRadius: 10, padding: '14px 18px', marginBottom: 24,
          fontSize: 13, color: '#991B1B'
        }}>⚠ {error}</div>
      )}

      {/* Results */}
      {status === 'done' && result && (
        <div>
          {/* Score Header */}
          <div style={{
            background: '#fff', border: '1px solid #E2E8F0',
            borderRadius: 14, padding: '24px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 24,
          }}>
            <ScoreRing score={result.overall_score} />
            <div>
              <div style={{
                display: 'inline-block', fontSize: 10, letterSpacing: 2,
                color: '#007A6C', textTransform: 'uppercase',
                fontFamily: 'monospace', marginBottom: 6,
                background: '#E0FAF7', padding: '3px 8px', borderRadius: 4
              }}>{result.stroke}</div>
              <p style={{ margin: 0, fontSize: 14, color: '#3D4A63', lineHeight: 1.6 }}>
                {result.summary}
              </p>
            </div>
          </div>

          {/* Corrections */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#6B7A99', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'monospace' }}>
              Corrections — tap to expand
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.corrections?.map((c: any, i: number) => (
                <CorrectionCard key={i} correction={c} index={i} />
              ))}
            </div>
          </div>

          {/* Strength */}
          {result.strength && (
            <div style={{
              background: '#E0FAF7', border: '1px solid #00B4A0',
              borderRadius: 10, padding: '14px 18px', marginBottom: 24
            }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#007A6C', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>✓ Strength</div>
              <p style={{ margin: 0, fontSize: 13, color: '#0A1628', lineHeight: 1.6 }}>{result.strength}</p>
            </div>
          )}

          <button onClick={reset} style={{
            width: '100%', padding: '13px',
            background: '#F8FAFC', color: '#6B7A99',
            border: '1px solid #E2E8F0',
            borderRadius: 10, fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>
            Analyze Another Video
          </button>
        </div>
      )}
    </main>
  )
}