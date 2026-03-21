export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #0C2A4A 50%, #0A3A5C 100%)',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Water effect circles */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,160,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,100,200,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* Top tagline badge */}
        <div style={{
          background: 'rgba(0,180,160,0.15)',
          border: '1px solid rgba(0,180,160,0.3)',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '0.8rem',
          color: '#00B4A0',
          fontWeight: '500',
          marginBottom: '28px',
          letterSpacing: '0.5px',
        }}>Free for swimmers and coaches </div>

        {/* Main headline */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: '800',
          color: '#fff',
          lineHeight: '1.15',
          marginBottom: '20px',
          letterSpacing: '-1px',
          maxWidth: '800px',
        }}>
          Smarter training for<br />
          <span style={{ color: '#00B4A0' }}>real performance gains.</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: '580px',
          lineHeight: '1.7',
          marginBottom: '40px',
        }}>
          Track your times, follow structured workouts, and improve technique with tools designed for swimmers — all in one place.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/signup" style={{
            background: '#00B4A0',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            textDecoration: 'none',
          }}>Get Started — Free</a>
          <a href="/workouts" style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>View Workouts</a>
        </div>

        {/* Bottom stats row */}
        <div style={{
          display: 'flex',
          gap: '48px',
          marginTop: '64px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '40px',
          width: '100%',
          maxWidth: '700px',
        }}>
          {[
            { value: '100+', label: 'Structured Workouts' },
            { value: 'All Skill Levels', label: 'Beginner to Elite' },
            { value: 'All Four Strokes', label: 'Drill Library' },
            { value: 'Always Free', label: 'No paywalls, ever' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature section */}
      <section style={{ background: '#F4F7FB', padding: '80px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', textAlign: 'center', marginBottom: '12px' }}>
            Everything you need in the water
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7A99', marginBottom: '48px', fontSize: '1rem' }}>
            Built by a coach, for swimmers at every level.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: '📈',
                title: 'Times & Progression',
                description: 'Log your times, track your personal bests, and see your progression over the season. USA Swimming standards built in.',
                color: '#E0FAF7',
                link: '/times',
              },
              {
                icon: '🏊',
                title: 'Workout Library',
                description: 'Structured workouts for every level — from beginner swimmers to competitive athletes chasing cuts.',
                color: '#EAF3FF',
                link: '/workouts',
              },
              {
                icon: '🎥',
                title: 'Drill Library',
                description: 'Video drills for all four strokes. Improve your technique with expert coaching cues and progressions.',
                color: '#FFF4DC',
                link: '/drills',
              },
            ].map((feature) => (
              <a key={feature.title} href={feature.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '28px',
                  height: '100%',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: feature.color,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', marginBottom: '16px',
                  }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '10px', color: '#0A1628' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#6B7A99', lineHeight: '1.6' }}>{feature.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #0C2A4A 100%)',
        padding: '80px 20px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
          Ready to swim smarter?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 32px' }}>
          Join swimmers already using Natare to track their progress and improve their technique.
        </p>
        <a href="/signup" style={{
          background: '#00B4A0', color: '#fff',
          padding: '14px 36px', borderRadius: '10px',
          fontSize: '1rem', fontWeight: '600', textDecoration: 'none',
        }}>Get Started — Free</a>
      </section>
    </main>
  )
}