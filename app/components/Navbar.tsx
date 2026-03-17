export default function Navbar() {
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
      <div style={{ display: 'flex', gap: '28px' }}>
        <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Home</a>
        <a href="/workouts" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Workouts</a>
        <a href="/drills" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Drills</a>
        <a href="/times" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>My Times</a>
      </div>
    </nav>
  )
}