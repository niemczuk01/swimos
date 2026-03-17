'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ageGroups = ['10 & Under', '11-12', '13-14', '15-16', '17-18', '18+']

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('swimmer')
  const [gender, setGender] = useState('M')
  const [ageGroup, setAgeGroup] = useState('11-12')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, gender, age_group: ageGroup }
      }
    })
    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    // Save profile to profiles table
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        gender,
        age_group: ageGroup,
        role,
      })
    }

    setMessage('Account created! You can now sign in.')
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '400px', margin: '80px auto', padding: '0 20px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '32px',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Create an account</h1>
        <p style={{ color: '#6B7A99', fontSize: '0.9rem', marginBottom: '28px' }}>Join SwimOS for free</p>

        {message && (
          <div style={{
            background: message.includes('error') ? '#FEE2E2' : '#E0FAF7',
            color: message.includes('error') ? '#991B1B' : '#007A6C',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
          }}>{message}</div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Full name</label>
          <input
            type="text"
            placeholder="Jordan Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>I am a</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#fff' }}>
            <option value="swimmer">Swimmer</option>
            <option value="coach">Coach</option>
            <option value="triathlete">Triathlete</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#fff' }}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Age group</label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#fff' }}>
            {ageGroups.map((ag) => <option key={ag} value={ag}>{ag}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: '100%',
            background: '#00B4A0',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Creating account...' : 'Create account'}</button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#6B7A99' }}>
          Already have an account? <a href="/login" style={{ color: '#00B4A0', fontWeight: '500' }}>Sign in</a>
        </p>
      </div>
    </main>
  )
}