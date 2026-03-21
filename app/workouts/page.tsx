'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Workout = {
  id: string
  title: string
  level: string
  yards: number
  focus: string
  description: string
  sets: string
  source: string
}

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const FOCUSES = ['All', 'Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'IM', 'Distance', 'Sprint', 'General']

const levelColors: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: '#e8fdf0', color: '#1a7f4b' },
  Intermediate: { bg: '#fff8e1', color: '#b36b00' },
  Advanced: { bg: '#fdecea', color: '#b71c1c' },
}

const focusColors: Record<string, string> = {
  Freestyle: '#3B82F6',
  Backstroke: '#8B5CF6',
  Breaststroke: '#EC4899',
  Butterfly: '#F59E0B',
  IM: '#10B981',
  Distance: '#6366F1',
  Sprint: '#EF4444',
  General: '#6B7280',
}

function getSectionLabel(line: string): 'warmup' | 'mainset' | 'cooldown' | 'preset' | null {
  const l = line.toLowerCase()
  if (l.includes('warm up') || l.includes('warm-up') || l.includes('warmup')) return 'warmup'
  if (l.includes('main set') || l.includes('main:')) return 'mainset'
  if (l.includes('cool down') || l.includes('cool-down') || l.includes('cooldown')) return 'cooldown'
  if (l.includes('pre-set') || l.includes('pre set') || l.includes('preset')) return 'preset'
  return null
}

const sectionStyles: Record<string, { bg: string; color: string; label: string }> = {
  warmup: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Warm Up' },
  mainset: { bg: '#F0FDF4', color: '#15803D', label: 'Main Set' },
  cooldown: { bg: '#FDF4FF', color: '#7E22CE', label: 'Cool Down' },
  preset: { bg: '#FFF7ED', color: '#C2410C', label: 'Pre Set' },
}

function parseWorkoutSections(sets: string) {
  const lines = sets.split('\n').filter(l => l.trim() !== '')
  const sections: { type: string | null; lines: string[] }[] = []
  let currentSection: { type: string | null; lines: string[] } = { type: null, lines: [] }

  for (const line of lines) {
    const sectionType = getSectionLabel(line)
    if (sectionType) {
      if (currentSection.lines.length > 0) sections.push(currentSection)
      currentSection = { type: sectionType, lines: [line] }
    } else {
      currentSection.lines.push(line)
    }
  }
  if (currentSection.lines.length > 0) sections.push(currentSection)
  return sections
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [focus, setFocus] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('level')
      if (!error && data) setWorkouts(data)
      setLoading(false)
    }
    fetchWorkouts()
  }, [])

  const filtered = workouts.filter((w) => {
    const matchLevel = level === 'All' || w.level === level
    const matchFocus = focus === 'All' || w.focus === focus
    const matchSearch =
      search === '' ||
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.description?.toLowerCase().includes(search.toLowerCase()) ||
      w.focus.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchFocus && matchSearch
  })

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Workouts</h1>
      <p style={{ color: '#6B7A99', marginBottom: '1.5rem' }}>
        Real workouts from coaches and Swimming World Magazine.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search workouts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem 1rem', borderRadius: 8,
            border: '1px solid #E2E8F0', fontSize: '0.9rem', minWidth: 200,
          }}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: '0.9rem', background: '#fff' }}>
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={focus} onChange={(e) => setFocus(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: '0.9rem', background: '#fff' }}>
          {FOCUSES.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#6B7A99', marginBottom: '1rem' }}>
        {filtered.length} workout{filtered.length !== 1 ? 's' : ''} found
      </p>

      {loading ? (
        <p style={{ color: '#6B7A99' }}>Loading workouts...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6B7A99' }}>No workouts found. Try adjusting your filters.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((workout) => {
            const sections = parseWorkoutSections(workout.sets || '')
            const isOpen = expanded === workout.id
            return (
              <div key={workout.id} style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}>

                {/* Card Header */}
                <div
                  onClick={() => setExpanded(isOpen ? null : workout.id)}
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    borderBottom: isOpen ? '1px solid #E2E8F0' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                        <span style={{
                          background: levelColors[workout.level]?.bg,
                          color: levelColors[workout.level]?.color,
                          fontSize: '0.72rem', fontWeight: 700,
                          padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.3px'
                        }}>{workout.level}</span>
                        <span style={{
                          background: (focusColors[workout.focus] || '#6B7280') + '18',
                          color: focusColors[workout.focus] || '#6B7280',
                          fontSize: '0.72rem', fontWeight: 700,
                          padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.3px'
                        }}>{workout.focus}</span>
                        {workout.yards && (
                          <span style={{
                            background: '#F1F5F9', color: '#475569',
                            fontSize: '0.72rem', fontWeight: 600,
                            padding: '3px 10px', borderRadius: 20,
                          }}>{workout.yards.toLocaleString()} yds</span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.15rem', fontWeight: 700, color: '#0A1628' }}>
                        {workout.title}
                      </h3>

                      {/* Description */}
                      {workout.description && (
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7A99', lineHeight: 1.5 }}>
                          {workout.description}
                        </p>
                      )}
                    </div>

                    {/* Expand toggle */}
                    <div style={{
                      marginLeft: '1rem', flexShrink: 0,
                      width: 32, height: 32, borderRadius: '50%',
                      background: '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', color: '#6B7A99',
                      transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>▼</div>
                  </div>
                </div>

                {/* Expanded Workout */}
                {isOpen && (
                  <div style={{ padding: '1.5rem', background: '#FAFBFC' }}>

                    {sections.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {sections.map((section, si) => {
                          const style = section.type ? sectionStyles[section.type] : null
                          const headerLine = section.lines[0]
                          const bodyLines = section.lines.slice(1)

                          return (
                            <div key={si} style={{
                              borderRadius: 10,
                              overflow: 'hidden',
                              border: '1px solid #E2E8F0',
                            }}>
                              {/* Section header */}
                              {style && (
                                <div style={{
                                  background: style.bg,
                                  padding: '8px 14px',
                                  display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                  <span style={{
                                    fontSize: '0.72rem', fontWeight: 700,
                                    color: style.color, textTransform: 'uppercase', letterSpacing: '0.5px'
                                  }}>{style.label}</span>
                                  <span style={{ fontSize: '0.85rem', color: style.color, fontWeight: 500 }}>
                                    {headerLine.replace(/warm.?up:?|main.?set:?|cool.?down:?|pre.?set:?/gi, '').trim()}
                                  </span>
                                </div>
                              )}

                              {/* Section body */}
                              <div style={{ background: '#fff', padding: '8px 0' }}>
                                {(style ? bodyLines : section.lines).map((line, li) => {
                                  const isIndented = line.startsWith('  ') || line.startsWith('\t')
                                  const isHeader = line.endsWith(':') || (line === line.toUpperCase() && line.length > 3)
                                  return (
                                    <div key={li} style={{
                                      padding: '6px 14px',
                                      paddingLeft: isIndented ? '28px' : '14px',
                                      fontSize: isHeader ? '0.78rem' : '0.9rem',
                                      fontWeight: isHeader ? 700 : 400,
                                      color: isHeader ? '#475569' : '#0A1628',
                                      textTransform: isHeader ? 'uppercase' : 'none',
                                      letterSpacing: isHeader ? '0.3px' : 'normal',
                                      borderBottom: li < (style ? bodyLines : section.lines).length - 1 ? '1px solid #F1F5F9' : 'none',
                                      fontFamily: isIndented ? 'monospace' : 'inherit',
                                    }}>
                                      {line.trim()}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <pre style={{
                        margin: 0, fontFamily: 'monospace',
                        fontSize: '0.875rem', color: '#0A1628',
                        whiteSpace: 'pre-wrap', lineHeight: 1.8,
                      }}>{workout.sets}</pre>
                    )}

                    {workout.source && (
                      <p style={{ margin: '1rem 0 0', fontSize: '0.75rem', color: '#94A3B8' }}>
                        Source: {workout.source}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}