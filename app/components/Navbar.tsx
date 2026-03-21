'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_USER_ID = '2a8559dc-e3c8-4ca4-8a78-c43420be5e58'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <nav style={{
      background: '#0A1628',
      padding: '0 32px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff' }}>
        Swim<span style={{ color: '#00B4A0' }}>OS</span>
      </div>
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Home</a>
        <a href="/workouts" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Workouts</a>
        <a href="/drills" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Drills</a>
        <a href="/times" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>My Times</a>
        {user ? (
          <>
            {user.id === ADMIN_USER_ID && (
              <a href="/admin" style={{ color: '#00B4A0', fontSize: '0.9rem', fontWeight: '600' }}>
                Admin
              </a>
            )}
            <a href="/profile" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              {user.user_metadata?.name || user.email}
            </a>
            <button
              onClick={handleSignOut}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '7px 16px',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}>Sign out</button>
          </>
        ) : (
          <>
            <a href="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Sign in</a>
            <a href="/signup" style={{
              background: '#00B4A0',
              color: '#fff',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>Sign up</a>
          </>
        )}
      </div>
    </nav>
  )
}