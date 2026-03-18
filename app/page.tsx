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

        {/* Badge */}
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
        }}>Free for swimmers and coaches — always</div>

        {/* Main headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '800',
          color: '#fff',
          lineHeight: '1.1',
          marginBottom: '20px',
          letterSpacing: '-1px',
          maxWidth: '800px',
        }}>
          Train smarter.<br />
          <span style={{ color: '#00B4A0' }}>Swim faster.</span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: '540px',
          lineHeight: '1.6',
          marginBottom: '40px',
        }}>
          We built the tools your coach wishes existed. Track your times, follow expert workouts, and master your technique — all in one place.
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
            transition: 'opacity 0.2s',
          }}>Get started free</a>
          <a href="/workouts" style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>Browse workouts</a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: '48px',
          marginTop: '64px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { value: '100+', label: 'Workouts' },
            { value: 'All ages', label: 'USA Swimming standards' },
            { value: '4 strokes', label: 'Drill library' },
            { value: 'Free', label: 'Always' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature section */}
      <section style={{ background: '#F4F7FB', padding: '80px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '12px' }}>
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
                description: 'Coach-built workouts for every level — from beginner triathletes to competitive swimmers chasing cuts.',
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
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '10px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#6B7A99', lineHeight: '1.6' }}>{feature.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* For swimmers / for coaches split */}
      <section style={{ background: '#fff', padding: '80px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0A1628, #0C2A4A)',
            borderRadius: '16px', padding: '36px', color: '#fff',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🏊‍♂️</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>For swimmers</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Track times and personal bests',
                'See your USA Swimming standard',
                'Follow coach-built workouts',
                'Watch drill videos by stroke',
                'Build a college recruiting profile',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                  <span style={{ color: '#00B4A0', fontWeight: '700' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <a href="/signup" style={{
              display: 'inline-block', marginTop: '24px',
              background: '#00B4A0', color: '#fff',
              padding: '10px 24px', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none',
            }}>Join as a swimmer</a>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a0533, #2D1065)',
            borderRadius: '16px', padding: '36px', color: '#fff',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>For coaches</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Build and share workouts',
                'Plan your season',
                'Share drill progressions',
                'Track athlete times',
                'Access coaching methodology',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                  <span style={{ color: '#A78BFA', fontWeight: '700' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <a href="/signup" style={{
              display: 'inline-block', marginTop: '24px',
              background: '#7C3AED', color: '#fff',
              padding: '10px 24px', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none',
            }}>Join as a coach</a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #0C2A4A 100%)',
        padding: '80px 20px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
          Ready to swim smarter?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '1rem' }}>
          Join swimmers and coaches already using SwimOS. Free, forever.
        </p>
        <a href="/signup" style={{
          background: '#00B4A0', color: '#fff',
          padding: '14px 36px', borderRadius: '10px',
          fontSize: '1rem', fontWeight: '600', textDecoration: 'none',
        }}>Get started free</a>
      </section>
    </main>
  )
}