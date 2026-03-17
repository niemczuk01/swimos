import { supabase } from '../lib/supabase'

export default async function WorkoutsPage() {
  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('*')

  if (error) {
    console.error(error)
    return <p>Error loading workouts.</p>
  }

  return (
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Workouts</h1>
      <p style={{ color: '#6B7A99', marginBottom: '32px' }}>Coach-built workouts ready to use.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {workouts?.map((workout) => (
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
              {JSON.parse(workout.sets).map((set: string, i: number) => (
                <li key={i} style={{ fontSize: '0.9rem', color: '#3D4A63' }}>{set}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </main>
  )
}