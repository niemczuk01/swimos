'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const FOCUSES = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'IM', 'Distance', 'Sprint', 'General']

const ADMIN_USER_ID = '2a8559dc-e3c8-4ca4-8a78-c43420be5e58'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [focus, setFocus] = useState('Freestyle')
  const [yards, setYards] = useState('')
  const [description, setDescription] = useState('')
  const [warmUp, setWarmUp] = useState('')
  const [mainSet, setMainSet] = useState('')
  const [warmDown, setWarmDown] = useState('')
  const [source, setSource] = useState('SwimOS Coaching Staff')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.id !== ADMIN_USER_ID) {
        router.push('/')
        return
      }
      setAuthorized(true)
      setLoading(false)
    })
  }, [])

  async function handleSubmit() {
    if (!title || !mainSet) {
      setMessage('Title and Main Set are required.')
      return
    }

    // Combine sections into one formatted string
    const parts = []
    if (warmUp.trim()) parts.push(`Warm Up:\n${warmUp.trim()}`)
    parts.push(`Main Set:\n${mainSet.trim()}`)
    if (warmDown.trim()) parts.push(`Cool Down:\n${warmDown.trim()}`)
    const sets = parts.join('\n\n')

    setSaving(true)
    const { error } = await supabase.from('workouts').insert({
      title,
      level,
      focus,
      yards: yards ? parseInt(yards) : null,
      description,
      sets,
      source,
    })

    if (error) {
      setMessage('Error saving workout: ' + error.message)
    } else {
      setMessage('Workout added successfully!')
      setTitle('')
      setYards('')
      setDescription('')
      setWarmUp('')
      setMainSet('')
      setWarmDown('')
      setSource('SwimOS Coaching Staff')
      setLevel('Intermediate')
      setFocus('Freestyle')
    }
    setSaving(false)
  }

  if (loading) return <p style={{ padding: 40, color: '#6B7A99' }}>Checking access...</p>
  if (!authorized) return null

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6,
  } as const

  const optionalStyle = {
    fontSize: '0.75rem', fontWeight: 400, color: '#94A3B8', marginLeft: 6,
  }

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>Admin — Add Workout</h1>
      <p style={{ color: '#6B7A99', marginBottom: '2rem' }}>
        Fill in the details below. Warm Up and Warm Down are optional.
      </p>

      {message && (
        <div style={{
          background: message.includes('Error') ? '#FEE2E2' : '#E0FAF7',
          color: message.includes('Error') ? '#991B1B' : '#007A6C',
          padding: '12px', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1.5rem',
        }}>{message}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Basic info */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1628' }}>Workout Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Descend" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Level *</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}
                  style={{ ...inputStyle, background: '#fff' }}>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Focus *</label>
                <select value={focus} onChange={(e) => setFocus(e.target.value)}
                  style={{ ...inputStyle, background: '#fff' }}>
                  {FOCUSES.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Total Yards</label>
                <input type="number" value={yards} onChange={(e) => setYards(e.target.value)}
                  placeholder="e.g. 3200" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Short Description<span style={optionalStyle}>(optional)</span></label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={2} placeholder="Brief summary of the workout and its purpose..."
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Source</label>
              <input type="text" value={source} onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. SwimOS Coaching Staff" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Warm Up */}
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#1D4ED8' }}>
            Warm Up <span style={optionalStyle}>(optional)</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#3B82F6', marginBottom: '0.75rem' }}>
            e.g. 400 easy freestyle, 4x50 drill
          </p>
          <textarea
            value={warmUp}
            onChange={(e) => setWarmUp(e.target.value)}
            rows={4}
            placeholder={'400 easy freestyle\n4x50 drill on 1:00\n200 kick'}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', background: '#fff' }}
          />
        </div>

        {/* Main Set */}
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#15803D' }}>
            Main Set *
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#16A34A', marginBottom: '0.75rem' }}>
            The core of the workout. Use line breaks to separate sets.
          </p>
          <textarea
            value={mainSet}
            onChange={(e) => setMainSet(e.target.value)}
            rows={10}
            placeholder={'8x100 on 1:30 descending\n  Odds: stroke focus\n  Evens: fast\n4x50 all out on 1:00\n2x25 sprint on :40'}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', background: '#fff' }}
          />
        </div>

        {/* Warm Down */}
        <div style={{ background: '#FDF4FF', border: '1px solid #E9D5FF', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: '#7E22CE' }}>
            Warm Down <span style={optionalStyle}>(optional)</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9333EA', marginBottom: '0.75rem' }}>
            e.g. 200 easy choice, 4x50 backstroke
          </p>
          <textarea
            value={warmDown}
            onChange={(e) => setWarmDown(e.target.value)}
            rows={3}
            placeholder={'200 easy choice\n4x50 backstroke easy on 1:10'}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', background: '#fff' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            background: '#00B4A0', color: '#fff', border: 'none',
            borderRadius: 8, padding: '14px', fontSize: '1rem',
            fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Adding Workout...' : 'Add Workout'}
        </button>

      </div>
    </main>
  )
}