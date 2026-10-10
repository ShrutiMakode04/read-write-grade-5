import { useState } from 'react';
import { sounds } from '../../utils/audio';

const PLACES = [
  { id: 'm', label: 'Millions', color: '#E91E63' },
  { id: 'hth', label: 'H-Thousands', color: '#9C27B0' },
  { id: 'tth', label: 'T-Thousands', color: '#673AB7' },
  { id: 'th', label: 'Thousands', color: '#3F51B5' },
  { id: 'h', label: 'Hundreds', color: '#2196F3' },
  { id: 't', label: 'Tens', color: '#00BCD4' },
  { id: 'o', label: 'Ones', color: '#4CAF50' }
];

export default function NumberVaultStation({ onComplete }) {
  const targetNumber = 4250813;
  const targetWords = "Four million, two hundred fifty thousand, eight hundred thirteen";
  
  const [dials, setDials] = useState([0,0,0,0,0,0,0]);
  const [unlocked, setUnlocked] = useState(false);

  const changeDial = (idx, dir) => {
    sounds.click();
    const newDials = [...dials];
    let val = newDials[idx] + dir;
    if (val > 9) val = 0;
    if (val < 0) val = 9;
    newDials[idx] = val;
    setDials(newDials);
  };

  const handleUnlock = () => {
    const current = parseInt(dials.join(''), 10);
    if (current === targetNumber) {
      sounds.correct();
      setUnlocked(true);
      setTimeout(onComplete, 2000);
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '4px solid #0f3460', width: '100%', maxWidth: '900px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {unlocked && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(76, 175, 80, 0.9)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.5s' }}>
          <span style={{ fontSize: '6rem' }}>🔓</span>
          <h2 style={{ fontSize: '3rem', color: '#fff' }}>Vault Unlocked!</h2>
        </div>
      )}

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', marginBottom: '40px', border: '2px dashed var(--gold)' }}>
        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>Secret Code:</h3>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>"{targetWords}"</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
        {dials.map((val, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <button className="btn btn-outline" style={{ padding: '5px 15px', fontSize: '1.5rem', borderColor: PLACES[idx].color }} onClick={() => changeDial(idx, 1)}>▲</button>
            <div style={{ 
              width: '80px', 
              height: '100px', 
              background: '#222', 
              borderRadius: '10px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              fontSize: '4rem', 
              fontWeight: 'bold', 
              color: PLACES[idx].color,
              boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.5)',
              border: `2px solid ${PLACES[idx].color}`,
              textShadow: `0 0 10px ${PLACES[idx].color}`
            }}>
              {val}
            </div>
            <button className="btn btn-outline" style={{ padding: '5px 15px', fontSize: '1.5rem', borderColor: PLACES[idx].color }} onClick={() => changeDial(idx, -1)}>▼</button>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '60px', wordWrap: 'break-word', lineHeight: '1.2' }}>{PLACES[idx].label}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ fontSize: '1.5rem', padding: '15px 40px', borderRadius: '50px' }} onClick={handleUnlock}>
        🔓 Attempt Unlock
      </button>

    </div>
  );
}
