'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { getStandardAchieved } from '../lib/usa-standards'

const ageGroups = ['10 & Under', '11-12', '13-14', '15-16', '17-18']

const events = [
  '50m Freestyle', '100m Freestyle', '200m Freestyle', '400m Freestyle', '800m Freestyle', '1500m Freestyle',
  '50m Backstroke', '100m Backstroke', '200m Backstroke',
  '50m Breaststroke', '100m Breaststroke', '200m Breaststroke',
  '50m Butterfly', '100m Butterfly', '200m Butterfly',
  '100m IM', '200m IM', '400m IM',
]

const standardColors: Record<string, string> = {
  B: '#94A3B8', BB: '#60A5FA', A: '#34D399', AA: '#FBBF24', AAA: '#F87171', AAAA: '#A78BFA'
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [times, setTimes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Editable fields
  const [name, setName] = useState('')
  const [club, setClub] = useState('')
  const [bio, setBio] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [primaryEvents, setPrimaryEvents] = useState('')
  const [gender, setGender] = useState('M')
  const [ageGroup, setAgeGroup] = useState('11-12')
  const [state, setState] = useState('')
  const [highSchool, setHighSchool] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      fetchProfile(session.user.id)
      fetchTimes(session.user.id)
    })
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile(data)
      setName(data.name || '')
      setClub(data.club || '')
      setBio(data.bio || '')
      setGraduationYear(data.graduation_year || '')
      setPrimaryEvents(data.primary_events || '')
      setGender(data.gender || 'M')
      setAgeGroup(data.age_group || '11-12')
      setState(data.state || '')
      setHighSchool(data.high_school || '')
      if (data.avatar_url) setAvatarUrl(data.avatar_url)
    }
    setLoading(false)
  }

  async function fetchTimes(userId: string) {
    const { data } = await supabase
      .from('times')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    if (data) setTimes(data)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Image must be under 2MB.')
      return
    }

    setAvatarUploading(true)
    const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setMessage('Error uploading image.')
      setAvatarUploading(false)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Save URL to profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      setMessage('Error saving avatar.')
    } else {
      setAvatarUrl(publicUrl)
      setMessage('Profile picture updated!')
    }
    setAvatarUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      name, club, bio,
      graduation_year: graduationYear ? parseInt(graduationYear) : null,
      primary_events: primaryEvents,
      gender,
      age_group: ageGroup,
      state,
      high_school: highSchool,
    }).eq('id', user.id)
    if (error) {
      setMessage('Error saving profile.')
    } else {
      setMessage('Profile saved!')
      fetchProfile(user.id)
    }
    setSaving(false)
  }

  function getPersonalBest(eventName: string, course: string) {
    const eventTimes = times.filter(t => t.event === eventName && t.course === course)
    if (eventTimes.length === 0) return null
    return eventTimes.reduce((best, t) => {
      const bestSecs = best.time.includes(':')
        ? parseInt(best.time.split(':')[0]) * 60 + parseFloat(best.time.split(':')[1])
        : parseFloat(best.time)
      const tSecs = t.time.includes(':')
        ? parseInt(t.time.split(':')[0]) * 60 + parseFloat(t.time.split(':')[1])
        : parseFloat(t.time)
      return tSecs < bestSecs ? t : best
    })
  }

  const swumEvents = events.filter(e => times.some(t => t.event === e))

  if (loading) return <p style={{ padding: '40px', color: '#6B7A99' }}>Loading...</p>

  return (
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>

      {/* Profile header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>

        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #00B4A0, #0A1628)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontWeight: '700', color: '#fff',
            overflow: 'hidden',
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              name ? name.charAt(0).toUpperCase() : '?'
            )}
          </div>

          {/* Camera icon overlay — clicking opens file picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            title="Change profile picture"
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '26px', height: '26px', borderRadius: '50%',
              background: '#00B4A0', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '0.7rem',
            }}
          >
            {avatarUploading ? '⏳' : '📷'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>{name || 'Your Profile'}</h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {club && <span style={{ background: '#E0FAF7', color: '#007A6C', fontSize: '0.8rem', padding: '3px 10px', borderRadius: '20px' }}>{club}</span>}
            {ageGroup && <span style={{ background: '#EAF3FF', color: '#185FA5', fontSize: '0.8rem', padding: '3px 10px', borderRadius: '20px' }}>{ageGroup}</span>}
            {graduationYear && <span style={{ background: '#F4EEF9', color: '#6B3FA0', fontSize: '0.8rem', padding: '3px 10px', borderRadius: '20px' }}>Class of {graduationYear}</span>}
            {state && <span style={{ background: '#FFF4DC', color: '#8B6110', fontSize: '0.8rem', padding: '3px 10px', borderRadius: '20px' }}>{state}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
        {(['profile', 'settings'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'transparent', border: 'none',
            padding: '10px 20px', fontSize: '0.9rem', fontWeight: '500',
            cursor: 'pointer',
            color: activeTab === tab ? '#00B4A0' : '#6B7A99',
            borderBottom: activeTab === tab ? '2px solid #00B4A0' : '2px solid transparent',
          }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        ))}
      </div>

      {message && (
        <div style={{
          background: message.includes('Error') ? '#FEE2E2' : '#E0FAF7',
          color: message.includes('Error') ? '#991B1B' : '#007A6C',
          padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px',
        }}>{message}</div>
      )}

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <>
          {bio && (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>About</h2>
              <p style={{ fontSize: '0.95rem', color: '#0A1628', lineHeight: '1.6' }}>{bio}</p>
            </div>
          )}
          {highSchool && (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>School</h2>
              <p style={{ fontSize: '0.95rem', color: '#0A1628' }}>{highSchool}</p>
            </div>
          )}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Personal Bests</h2>
            {swumEvents.length === 0 ? (
              <p style={{ color: '#6B7A99', fontSize: '0.9rem' }}>No times logged yet. <a href="/times" style={{ color: '#00B4A0' }}>Log your first time →</a></p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500' }}>Event</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500' }}>Course</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500' }}>Best Time</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500' }}>Standard</th>
                  </tr>
                </thead>
                <tbody>
                  {['SCY', 'LCM', 'SCM'].map(course =>
                    swumEvents.map(eventName => {
                      const pb = getPersonalBest(eventName, course)
                      if (!pb) return null
                      const standard = getStandardAchieved(pb.time, eventName, course as any, gender as any, ageGroup)
                      return (
                        <tr key={`${eventName}-${course}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '10px 12px', fontSize: '0.9rem', fontWeight: '500' }}>{eventName}</td>
                          <td style={{ padding: '10px 12px', fontSize: '0.9rem', color: '#6B7A99' }}>{course}</td>
                          <td style={{ padding: '10px 12px', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: '600' }}>{pb.time}</td>
                          <td style={{ padding: '10px 12px' }}>
                            {standard ? (
                              <span style={{ background: standardColors[standard], color: '#fff', fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>{standard}</span>
                            ) : (
                              <span style={{ color: '#6B7A99', fontSize: '0.85rem' }}>—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <>
          {/* Avatar upload section */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Profile picture</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00B4A0, #0A1628)',
                overflow: 'hidden', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#fff',
              }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : name?.charAt(0).toUpperCase() || '?'
                }
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  style={{
                    background: '#00B4A0', color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem',
                    fontWeight: '500', cursor: 'pointer', marginRight: '8px',
                  }}
                >
                  {avatarUploading ? 'Uploading...' : 'Upload photo'}
                </button>
                <span style={{ fontSize: '0.8rem', color: '#6B7A99' }}>JPG, PNG or GIF · Max 2MB</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Personal info</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>High school</label>
                <input type="text" placeholder="e.g. Rockville High School" value={highSchool} onChange={(e) => setHighSchool(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>State</label>
                <input type="text" placeholder="e.g. Maryland" value={state} onChange={(e) => setState(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Graduation year</label>
                <input type="number" placeholder="e.g. 2027" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Age group</label>
                <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}>
                  {ageGroups.map((ag) => <option key={ag} value={ag}>{ag}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Primary events</label>
                <input type="text" placeholder="e.g. 100 Free, 200 IM" value={primaryEvents} onChange={(e) => setPrimaryEvents(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                placeholder="Tell college coaches about yourself..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} style={{
            width: '100%', background: '#00B4A0', color: '#fff',
            border: 'none', borderRadius: '8px', padding: '12px',
            fontSize: '0.95rem', fontWeight: '500',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Saving...' : 'Save profile'}</button>
        </>
      )}
    </main>
  )
}