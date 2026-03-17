export default function SignupPage() {
  return (
    <main style={{ maxWidth: '400px', margin: '80px auto', padding: '0 20px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '32px',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Create an account</h1>
        <p style={{ color: '#6B7A99', fontSize: '0.9rem', marginBottom: '28px' }}>Join SwimOS for free</p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Full name</label>
          <input
            type="text"
            placeholder="Jordan Smith"
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>I am a</label>
          <select style={{
            width: '100%',
            padding: '10px 14px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '0.9rem',
            outline: 'none',
            background: '#fff',
          }}>
            <option value="swimmer">Swimmer</option>
            <option value="coach">Coach</option>
            <option value="triathlete">Triathlete</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
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

        <button style={{
          width: '100%',
          background: '#00B4A0',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '0.95rem',
          fontWeight: '500',
          cursor: 'pointer',
        }}>Create account</button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#6B7A99' }}>
          Already have an account? <a href="/login" style={{ color: '#00B4A0', fontWeight: '500' }}>Sign in</a>
        </p>
      </div>
    </main>
  )
}
