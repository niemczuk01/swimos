const times = [
  {
    id: 1,
    event: '100m Freestyle',
    course: 'SCY',
    time: '48.72',
    date: '2024-03-01',
    meet: 'Spring Invitational',
    pb: true,
  },
  {
    id: 2,
    event: '200m Freestyle',
    course: 'SCY',
    time: '1:49.30',
    date: '2024-02-15',
    meet: 'Winter Championships',
    pb: false,
  },
  {
    id: 3,
    event: '100m Backstroke',
    course: 'SCY',
    time: '55.18',
    date: '2024-03-01',
    meet: 'Spring Invitational',
    pb: true,
  },
  {
    id: 4,
    event: '50m Freestyle',
    course: 'SCY',
    time: '22.14',
    date: '2024-01-20',
    meet: 'January Open',
    pb: false,
  },
]

export default function TimesPage() {
  return (
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>My Times</h1>
          <p style={{ color: '#6B7A99' }}>Your personal best and recent times.</p>
        </div>
        <button style={{
          background: '#00B4A0',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '0.9rem',
          fontWeight: '500',
          cursor: 'pointer',
        }}>+ Log a time</button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F4F7FB' }}>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Meet</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7A99', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {times.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '14px 20px', fontSize: '0.9rem', fontWeight: '500' }}>
                  {entry.event}
                  {entry.pb && (
                    <span style={{
                      marginLeft: '8px',
                      background: '#FFF4DC',
                      color: '#8B6110',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      padding: '2px 7px',
                      borderRadius: '4px',
                    }}>PB</span>
                  )}
                </td>
                <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: '#6B7A99' }}>{entry.course}</td>
                <td style={{ padding: '14px 20px', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: '500' }}>{entry.time}</td>
                <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: '#6B7A99' }}>{entry.meet}</td>
                <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: '#6B7A99' }}>{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}