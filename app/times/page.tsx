'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getStandardAchieved, timeToSeconds, pvsStandards } from '../lib/pvs-standards'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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

const ageGroups = ['10 & Under', '11-12', '13-14', '15-16', '17-18']

export default function TimesPage() {
  const [times, setTimes] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(events[0])
  const [gender, setGender] = useState<'M' | 'F'>('M')
  const [ageGroup, setAgeGroup] = useState('11-12')
  const [event, setEvent] = useState(events[0])
  const [course, setCourse] = useState('SCY')
  const [time, setTime] = useState('')
  const [meet, setMeet] = useState('')
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchTimes(session.user.id)
        fetchProfile(session.user.id)
      }
      else setLoading(false)
    })
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('gender, age_group')
      .eq('id', userId)
      .single()
    if (data) {
      setGender(data.gender as 'M' | 'F')
      setAgeGroup(data.age_group)
    }
  }

  async function fetchTimes(userId: string) {
    const { data, error } = await supabase
      .from('times')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
    if (!error) setTimes(data || [])
    setLoading(false)
  }

  async function handleLogTime() {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('times').insert({
      user_id: user.id,
      event,
      course,
      time,
      meet,
      date,
    })
    if (error) {
      setMessage('Error saving time. Please try again.')
    } else {
      setMessage('Time logged!')
      setShowForm(false)
      setTime('')
      setMeet('')
      setDate('')
      fetchTimes(user.id)
    }
    setSaving(false)
  }

  // Filter times for selected event
  const filteredTimes = times.filter(
    (t) => t.event === selectedEvent && t.course === course
  )

  // Build chart data
  const chartData = {
    labels: filteredTimes.map((t) => t.date),
    datasets: [
      {
        label: selectedEvent,
        data: filteredTimes.map((t) => timeToSeconds(t.time)),
        borderColor: '#00B4A0',
        backgroundColor: 'rgba(0, 180, 160, 0.1)',
        pointBackgroundColor: '#00B4A0',
        pointRadius: 6,
        tension: 0.3,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const seconds = context.parsed.y
            const mins = Math.floor(seconds / 60)
            const secs = (seconds % 60).toFixed(2)
            return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}`
          }
        }
      }
    },
    scales: {
      y: {
        reverse: true,
        ticks: {
          callback: (value: any) => {
            const mins = Math.floor(value / 60)
            const secs = (value % 60).toFixed(2)
            return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}`
          }
        },
        title: { display: true, text: 'Time (lower is faster)' }
      },
      x: {
        title: { display: true, text: 'Date' }
      }
    }
  }

  return (
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>My Times</h1>
          <p style={{ color: '#6B7A99' }}>Track your progression and PVS standards.</p>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: '#00B4A0', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '10px 20px',
              fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer',
            }}>{showForm ? 'Cancel' : '+ Log a time'}</button>
        )}
      </div>

      {message && (
        <div style={{ background: '#E0FAF7', color: '#007A6C', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Log a time</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Event</label>
              <select value={event} onChange={(e) => setEvent(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}>
                {events.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Course</label>
              <select value={course} onChange={(e) => setCourse(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}>
                <option value="SCY">SCY (Short Course Yards)</option>
                <option value="SCM">SCM (Short Course Meters)</option>
                <option value="LCM">LCM (Long Course Meters)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Time</label>
              <input type="text" placeholder="e.g. 48.72 or 1:49.30" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Meet name</label>
              <input type="text" placeholder="e.g. Spring Invitational" value={meet} onChange={(e) => setMeet(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }} />
            </div>
          </div>
          <button onClick={handleLogTime} disabled={saving} style={{ marginTop: '16px', background: '#00B4A0', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.9rem', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save time'}
          </button>
        </div>
      )}

      {!user && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7A99' }}>
          <p style={{ fontSize: '1rem', marginBottom: '16px' }}>Sign in to track your times</p>
          <a href="/login" style={{ background: '#00B4A0', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Sign in</a>
        </div>
      )}

      {user && (
        <>
          {/* Progression Chart */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Progression chart</h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', background: '#fff' }}>
                {events.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              <select value={gender} onChange={(e) => setGender(e.target.value as 'M' | 'F')} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', background: '#fff' }}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', background: '#fff' }}>
                {ageGroups.map((ag) => <option key={ag} value={ag}>{ag}</option>)}
              </select>
            </div>

            {filteredTimes.length < 2 ? (
              <p style={{ color: '#6B7A99', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
                Log at least 2 times for this event to see your progression chart.
              </p>
            ) : (
              <Line data={chartData} options={chartOptions as any} />
            )}
          </div>

          {/* Times Table */}
          {times.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7A99' }}>
              <p>No times logged yet. Click "+ Log a time" to get started!</p>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F4F7FB' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Standard</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Meet</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...times].reverse().map((entry) => {
                    const standard = getStandardAchieved(entry.time, entry.event, entry.course, gender, ageGroup)
                    return (
                      <tr key={entry.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '14px 20px', fontSize: '0.9rem', fontWeight: '500' }}>{entry.event}</td>
                        <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: '#6B7A99' }}>{entry.course}</td>
                        <td style={{ padding: '14px 20px', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: '500' }}>{entry.time}</td>
                        <td style={{ padding: '14px 20px' }}>
                          {standard ? (
                            <span style={{ background: standardColors[standard], color: '#fff', fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                              {standard}
                            </span>
                          ) : (
                            <span style={{ color: '#6B7A99', fontSize: '0.85rem' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: '#6B7A99' }}>{entry.meet}</td>
                        <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: '#6B7A99' }}>{entry.date}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  )
}