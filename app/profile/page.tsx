'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Editable fields
  const [name, setName] = useState('')
  const [club, setClub] = useState('')
  const [bio, setBio] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [primaryEvents, setPrimaryEvents] = useState('')
  const [credentials, setCredentials] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      fetchProfile(session.user.id)
    })
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      setProfile(data)
      setName(data.name || '')
      setClub(data.club || '')
      setBio(data.bio || '')
      setGraduationYear(data.graduation_year || '')
      setPrimaryEvents(data.primary_events || '')
      setCredentials(data.credentials || '')
      setSpecialty(data.specialty || '')
      setYearsExperience(data.years_experience || '')
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const updates: any = { name, club, bio }
    if (profile?.role === 'swimmer' || profile?.role === 'triathlete') {
      updates.graduation_year = graduationYear ? parseInt(graduationYear) : null
      updates.primary_events = primaryEvents
    }
    if (profile?.role === 'coach') {
      updates.credentials = credentials
      updates.specialty = specialty
      updates.years_experience = yearsExperience ? parseInt(yearsExperience) : null
    }
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    if (error) {
      setMessage('Error saving profile.')
    } else {
      setMessage('Profile saved!')
    }
    setSaving(false)
  }

  if (loading) return <p style={{ padding: '40px', color: '#6B7A99' }}>Loading...</p>

  const isCoach = profile?.role === 'coach'

  return (
    <main style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: isCoach ? '#7C3AED' : '#00B4A0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: '700', color: '#fff', flexShrink: 0,
        }}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{name || 'Your Profile'}</h1>
          <span style={{
            background: isCoach ? '#F4EEF9' : '#E0FAF7',
            color: isCoach ? '#6B3FA0' : '#007A6C',
            fontSize: '0.75rem', fontWeight: '500',
            padding: '3px 10px', borderRadius: '20px',
            }}>{profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User'}</span>
        </div>
      </div>

      {message && (
        <div style={{
          background: message.includes('Error') ? '#FEE2E2' : '#E0FAF7',
          color: message.includes('Error') ? '#991B1B' : '#007A6C',
          padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px',
        }}>{message}</div>
      )}

      {/* Basic info — all roles */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Basic info</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Club / Team</label>
            <input type="text" placeholder="e.g. Rockville Montgomery Swim Club" value={club} onChange={(e) => setClub(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              placeholder={isCoach ? 'Tell swimmers about your coaching background...' : 'Tell coaches about yourself...'}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }} />
          </div>
        </div>
      </div>

      {/* Swimmer specific */}
      {!isCoach && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Swimmer details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Graduation year</label>
              <input type="number" placeholder="e.g. 2027" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Primary events</label>
              <input type="text" placeholder="e.g. 100 Free, 200 IM, 100 Back" value={primaryEvents} onChange={(e) => setPrimaryEvents(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>
      )}

      {/* Coach specific */}
      {isCoach && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Coach details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Credentials</label>
              <input type="text" placeholder="e.g. ASCA Level 4, USA Swimming certified" value={credentials} onChange={(e) => setCredentials(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Specialty</label>
              <input type="text" placeholder="e.g. Sprint freestyle, Distance, IM" value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Years of experience</label>
              <input type="number" placeholder="e.g. 10" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={saving} style={{
        width: '100%', background: '#00B4A0', color: '#fff',
        border: 'none', borderRadius: '8px', padding: '12px',
        fontSize: '0.95rem', fontWeight: '500',
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.7 : 1,
      }}>{saving ? 'Saving...' : 'Save profile'}</button>
    </main>
  )
}