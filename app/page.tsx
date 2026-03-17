export default function Home() {
   return ( 
   <main style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}> 
   <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0A1628' }}> 
      Swim<span style={{ color: '#00B4A0' }}>OS</span> 
   </h1>
   <p style={{ fontSize: '1.1rem', color: '#6B7A99', marginTop: '12px' }}> 
      The free platform for swimmers and coaches. 
   </p> 
   <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}> 
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: 1 }}> 
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Swimmers</h2> 
        <p style={{ color: '#6B7A99', marginTop: '8px', fontSize: '0.95rem' }}>Track your times, log workouts, and watch drill videos.</p> 
        </div> 
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: 1 }}> 
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Coaches</h2> 
          <p style={{ color: '#6B7A99', marginTop: '8px', fontSize: '0.95rem' }}>Build workouts, plan seasons, and share methodology.</p> 
        </div> 
      </div> 
    </main> 
    ) 
  }