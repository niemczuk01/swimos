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
  const [sets, setSets] = useState('')
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
    if (!title || !sets) {
      setMessage('Title and workout sets are required.')
      return
    }

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
      setSets('')
      setSource('SwimOS Coaching Staff')
      setLevel('Intermediate')
      setFocus('Freestyle')
    }
    setSaving(false)
  }

  if (loading) return <p style={{ padding: 40, color: '#6B7A99' }}>Checking access...</p>
  if (!authorized) return null

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>Admin — Add Workout</h1>
      <p style={{ color: '#6B7A99', marginBottom: '2rem' }}>Add a new workout to the database. It will appear on the Workouts page instantly.</p>

      {message && (
        <div style={{
          background: message.includes('Error') ? '#FEE2E2' : '#E0FAF7',
          color: message.includes('Error') ? '#991B1B' : '#007A6C',
          padding: '12px', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1.5rem',
        }}>{message}</div>
      )}

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Workout Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Descend"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem' }}
          />
        </div>

        {/* Level + Focus + Yards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Level *</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', background: '#fff' }}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Focus *</label>
            <select value={focus} onChange={(e) => setFocus(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', background: '#fff' }}>
              {FOCUSES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Total Yards</label>
            <input
              type="number"
              value={yards}
              onChange={(e) => setYards(e.target.value)}
              placeholder="e.g. 3200"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Short Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Brief summary of the workout and its purpose..."
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', resize: 'vertical' }}
          />
        </div>

        {/* Sets */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Full Workout *</label>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: 6 }}>
            Write out the full workout — warm up, main set, cool down. Use line breaks to format.
          </p>
          <textarea
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            rows={12}
            placeholder={`Warm Up: 400 easy freestyle\n\nMain Set:\n  8x100 on 1:30\n  ...\n\nCool Down: 200 easy`}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', resize: 'vertical', fontFamily: 'monospace' }}
          />
        </div>

        {/* Source */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. SwimOS Coaching Staff"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            background: '#00B4A0', color: '#fff', border: 'none',
            borderRadius: 8, padding: '12px', fontSize: '0.95rem',
            fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Adding Workout...' : 'Add Workout'}
        </button>
      </div>
    </main>
  )
}