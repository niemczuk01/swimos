const drills = [
  {
    id: 1,
    name: 'Catch-up Drill',
    stroke: 'Freestyle',
    level: 'Beginner',
    duration: '2:14',
    description: 'Focuses on full extension and timing. One arm waits at the front until the other catches up.',
    videoId: 'your-youtube-id-here',
  },
  {
    id: 2,
    name: 'Single Arm Backstroke',
    stroke: 'Backstroke',
    level: 'Intermediate',
    duration: '1:55',
    description: 'Isolates each arm to improve rotation and catch position on backstroke.',
    videoId: 'your-youtube-id-here',
  },
  {
    id: 3,
    name: 'Body Dolphin',
    stroke: 'Butterfly',
    level: 'Beginner',
    duration: '3:02',
    description: 'Teaches the undulation motion core to butterfly. Done without arms to isolate the kick.',
    videoId: 'your-youtube-id-here',
  },
]

const strokeColors: Record<string, { bg: string; color: string }> = {
  Freestyle: { bg: '#E0FAF7', color: '#007A6C' },
  Backstroke: { bg: '#EAF3FF', color: '#185FA5' },
  Butterfly: { bg: '#FFF4DC', color: '#8B6110' },
  Breaststroke: { bg: '#F4EEF9', color: '#6B3FA0' },
}

export default function DrillsPage() {
  return (
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Drill Library</h1>
      <p style={{ color: '#6B7A99', marginBottom: '32px' }}>Technique drills organized by stroke and skill level.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {drills.map((drill) => {
          const colors = strokeColors[drill.stroke] || { bg: '#F4F7FB', color: '#6B7A99' }
          return (
            <div key={drill.id} style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <div style={{
                background: colors.bg,
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem', color: colors.color }}>{drill.stroke}</span>
                <span style={{ fontSize: '0.75rem', color: colors.color, background: '#fff', padding: '3px 8px', borderRadius: '20px' }}>{drill.level}</span>
              </div>
              <div style={{ padding: '18px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>{drill.name}</h2>
                <p style={{ fontSize: '0.85rem', color: '#6B7A99', lineHeight: '1.5', marginBottom: '12px' }}>{drill.description}</p>
                <p style={{ fontSize: '0.8rem', color: '#6B7A99' }}>Duration: {drill.duration}</p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}