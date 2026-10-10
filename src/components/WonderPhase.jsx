import { useState, useEffect, useCallback, useRef } from 'react';
import { stopNarration, playNarration } from '../utils/audio';

const WONDER_QUESTIONS = [
  {
    question: "Did you know that distances in space or populations of big cities are written with millions? We use commas to break these massive numbers into smaller groups called periods.",
    subtext: "Each period has ones, tens, and hundreds. Let's explore how to read and write these giant numbers!",
    emoji: "🚀",
    bgEmojis: ["🌟", "🪐", "🏙️", "👩‍🚀"],
  }
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[0]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    playNarration('wonder');
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
    
    return () => stopNarration();
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleDiscover = useCallback(() => {
    stopNarration();
    // In audio enabled, we would narrate the transition
    setTimeout(() => onComplete(), 600);
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase" style={{ minHeight: '100vh', padding: '20px', overflowY: 'auto' }}>
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center' }}>
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">❓</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🤔</div>
          <div className="speech-bubble wonder-bubble">Wow... that is huge! 😲</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`} style={{ padding: '20px', maxWidth: '800px', margin: '0 auto 20px auto' }}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text" style={{ fontSize: '1.5rem' }}>{wonder.question}</h2>
          <p className="wonder-subtext" style={{ fontSize: '1.1rem' }}>{wonder.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn" style={{ marginBottom: '40px' }}>
          <span className="wonder-btn-sparkle">✨</span>
          Let's find out!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
