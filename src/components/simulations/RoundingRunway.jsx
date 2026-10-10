import { useState } from 'react';
import { sounds } from '../../utils/audio';

export default function RoundingRunway({ onComplete }) {
  const target = 6420315;
  const roundTo = 100000;
  
  const lower = Math.floor(target / roundTo) * roundTo;
  const upper = lower + roundTo;
  const correctNearest = (target - lower <= upper - target) ? lower : upper;

  const [position, setPosition] = useState(50); // percentage 0-100

  const handleSliderChange = (e) => {
    setPosition(e.target.value);
  };

  const checkRounding = () => {
    const val = lower + (position / 100) * (upper - lower);
    // Did they snap close to the correct post?
    const distanceToLower = Math.abs(val - lower);
    const distanceToUpper = Math.abs(val - upper);
    const selected = distanceToLower < distanceToUpper ? lower : upper;

    if (selected === correctNearest) {
      sounds.correct();
      onComplete();
    } else {
      sounds.wrong();
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '900px', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>The Rounding Runway</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
        Round <strong style={{color: 'var(--gold)'}}>{target.toLocaleString()}</strong> to the nearest hundred-thousand.
      </p>

      <div style={{ position: 'relative', height: '100px', marginBottom: '3rem', margin: '0 40px' }}>
        {/* Posts */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ width: '4px', height: '40px', background: 'var(--gold)', margin: '0 auto', animation: 'postGlow 2s infinite' }}></div>
          <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{lower.toLocaleString()}</div>
        </div>

        <div style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateX(50%)', textAlign: 'center' }}>
          <div style={{ width: '4px', height: '40px', background: 'var(--gold)', margin: '0 auto', animation: 'postGlow 2s infinite' }}></div>
          <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{upper.toLocaleString()}</div>
        </div>

        {/* The target marker to show where the exact number actually lives? Or let the user slide? 
            The TRD says: "Drag the balloon along the runway. Landing precision... Snap to post." */}
        <input 
          type="range" 
          min="0" max="100" 
          value={position}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            position: 'absolute',
            bottom: '20px',
            left: 0,
            margin: 0,
            zIndex: 10,
            cursor: 'pointer'
          }}
        />

        <div style={{
            position: 'absolute',
            bottom: '40px',
            left: `${position}%`,
            transform: 'translateX(-50%)',
            fontSize: '3rem',
            animation: 'balloonDrift 3s ease-in-out infinite',
            pointerEvents: 'none'
        }}>
          🎈
        </div>
      </div>

      <button className="btn btn-primary" onClick={checkRounding}>Land the Balloon</button>
    </div>
  );
}
