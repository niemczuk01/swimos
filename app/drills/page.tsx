'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase'

type Drill = {
  id: string;
  title: string;
  stroke: string;
  level: string;
  description: string;
  youtube_url: string;
};

const STROKES = ['All', 'Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'IM / General'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function getYouTubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const videoId = u.searchParams.get('v') || u.pathname.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return '';
  }
}

export default function DrillsPage() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [search, setSearch] = useState('');
  const [stroke, setStroke] = useState('All');
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrills = async () => {
      const { data, error } = await supabase.from('drills').select('*').order('stroke').order('level');
      if (!error && data) setDrills(data);
      setLoading(false);
    };
    fetchDrills();
  }, []);

  const filtered = drills.filter((d) => {
    const matchStroke = stroke === 'All' || d.stroke === stroke;
    const matchLevel = level === 'All' || d.level === level;
    const matchSearch =
      search === '' ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchStroke && matchLevel && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Swim Drills</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Search and filter drills by stroke, level, or keyword.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search drills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: '0.95rem',
            minWidth: 220,
          }}
        />
        <select
          value={stroke}
          onChange={(e) => setStroke(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '0.95rem' }}
        >
          {STROKES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '0.95rem' }}
        >
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading drills...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#888' }}>No drills found. Try adjusting your filters.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((drill) => (
            <div
              key={drill.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {/* YouTube Embed */}
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={getYouTubeEmbedUrl(drill.youtube_url)}
                  title={drill.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>

              {/* Card Body */}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    background: '#e8f4fd', color: '#1a6fb5', fontSize: '0.75rem',
                    padding: '2px 8px', borderRadius: 20, fontWeight: 600
                  }}>{drill.stroke}</span>
                  <span style={{
                    background: drill.level === 'Beginner' ? '#e8fdf0' : drill.level === 'Intermediate' ? '#fff8e1' : '#fdecea',
                    color: drill.level === 'Beginner' ? '#1a7f4b' : drill.level === 'Intermediate' ? '#b36b00' : '#b71c1c',
                    fontSize: '0.75rem', padding: '2px 8px', borderRadius: 20, fontWeight: 600
                  }}>{drill.level}</span>
                </div>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700 }}>{drill.title}</h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#555', lineHeight: 1.5 }}>{drill.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}