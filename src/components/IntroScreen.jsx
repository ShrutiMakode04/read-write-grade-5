import { useState, useEffect } from 'react';
import { stopNarration, playNarration } from '../utils/audio';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A big number mystery!' },
  { icon: '🌍', label: 'Story', desc: 'Numbers around the world' },
  { icon: '⚙️', label: 'Simulate', desc: 'Build and compare' },
  { icon: '🎮', label: 'Play', desc: 'Gamified challenges' },
  { icon: '🏅', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled, onToggleAudio }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    return () => stopNarration();
  }, []);

  const handleStartLearning = () => {
    setStarted(true);
    playNarration('intro');
  };

  const handleStart = () => {
    onStart(); // playNarration('wonder') is already in WonderPhase's useEffect
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        📚  · Grade 5 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Large Numbers</span>{' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>Reading & Writing</span>
      </h1>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🧭</div>
        <div className="speech-bubble">
          Let's explore big numbers! 🌟
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to read, write, and compare <strong style={{ color: 'var(--gold)' }}>large whole numbers</strong> up to ten million in both standard and expanded forms!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow"> </div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!started ? (
        <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStartLearning}>
          🎧 Start Learning
        </button>
      ) : (
        <button className="btn btn-green btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
          🚀 Begin Your Journey!
        </button>
      )}

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🧠</div>
          <div className="feature-card-label">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🔢</div>
          <div className="feature-card-label">Place Value</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🏅</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
