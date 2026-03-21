'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(error.message)
    } else {
      router.push('/')
    }
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Welcome back</h1>
        <p style={{ color: '#6B7A99', fontSize: '0.9rem', marginBottom: '28px' }}>Sign in to your Natare account</p>

        {message && (
          <div style={{
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
          }}>{message}</div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={handleLogin}
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
          }}>{loading ? 'Signing in...' : 'Sign in'}</button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#6B7A99' }}>
          Don't have an account? <a href="/signup" style={{ color: '#00B4A0', fontWeight: '500' }}>Sign up</a>
        </p>
      </div>
    </main>
  )
}