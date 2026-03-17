
const workouts = [
  {
    id: 1,
    title: 'Aerobic Base Builder',
    level: 'All levels',
    yards: 4200,
    focus: 'Aerobic',
    sets: [
      '800 warm-up easy free',
      '4x200 on :20 rest descend',
      '8x100 on 1:45 steady pace',
      '4x50 kick on 1:00',
      '400 cool-down easy',
    ]
  },
  {
    id: 2,
    title: 'Sprint Power Session',
    level: 'Advanced',
    yards: 3500,
    focus: 'Sprint',
    sets: [
      '600 warm-up choice',
      '6x50 drill/swim by 25',
      '10x50 sprint on 2:00 off blocks',
      '8x25 max effort on 1:00',
      '400 cool-down backstroke',
    ]
  },
  {
    id: 3,
    title: 'IM Endurance',
    level: 'Intermediate',
    yards: 4500,
    focus: 'IM',
    sets: [
      '800 warm-up IM order',
      '4x200 IM on 3:30',
      '8x100 IM on 1:50',
      '4x50 stroke on 1:00',
      '300 cool-down easy free',
    ]
  },
]

export default function WorkoutsPage() {
  return (
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Workouts</h1>
      <p style={{ color: '#6B7A99', marginBottom: '32px' }}>Coach-built workouts ready to use.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {workouts.map((workout) => (
          <div key={workout.id} style={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{workout.title}</h2>
                <p style={{ color: '#6B7A99', fontSize: '0.85rem', marginTop: '4px' }}>{workout.level} · {workout.yards.toLocaleString()} yards</p>
              </div>
              <span style={{
                background: '#E0FAF7',
                color: '#007A6C',
                fontSize: '0.75rem',
                fontWeight: '500',
                padding: '4px 10px',
                borderRadius: '20px',
              }}>{workout.focus}</span>
            </div>

            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {workout.sets.map((set, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#3D4A63' }}>{set}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </main>
  )
}