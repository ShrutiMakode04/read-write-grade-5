import { useState } from 'react';
import { sounds } from '../../utils/audio';

const COLUMNS = [
  { id: 'm', val: 1000000, label: 'M', color: '#ff3366' },
  { id: 'hth', val: 100000, label: 'HTh', color: '#ff9933' },
  { id: 'tth', val: 10000, label: 'TTh', color: '#ffcc00' },
  { id: 'th', val: 1000, label: 'Th', color: '#33cc33' },
  { id: 'h', val: 100, label: 'H', color: '#3399ff' },
  { id: 't', val: 10, label: 'T', color: '#9933ff' },
  { id: 'o', val: 1, label: 'O', color: '#ff33cc' }
];

const CHALLENGES = [
  { target: 4328159, exp: "4,000,000 + 300,000 + 20,000 + 8,000 + 100 + 50 + 9" },
  { target: 6050204, exp: "6,000,000 + 50,000 + 200 + 4" },
  { target: 1900870, exp: "1,000,000 + 900,000 + 800 + 70" }
];

export default function PlinkoPlaceValue({ onComplete }) {
  const [round, setRound] = useState(0);
  const [counts, setCounts] = useState([0,0,0,0,0,0,0]);
  const [droppingToken, setDroppingToken] = useState(null);

  const current = CHALLENGES[round];

  const dropToken = (idx) => {
    if (counts[idx] >= 9 || droppingToken !== null) return;
    sounds.click();
    
    setDroppingToken({ idx });
    
    setTimeout(() => {
      sounds.click(); // plink
      const newCounts = [...counts];
      newCounts[idx]++;
      setCounts(newCounts);
      setDroppingToken(null);
    }, 400); // slightly faster
  };

  const removeToken = (idx) => {
    if (counts[idx] <= 0 || droppingToken !== null) return;
    sounds.click();
    const newCounts = [...counts];
    newCounts[idx]--;
    setCounts(newCounts);
  };

  const handleCheck = () => {
    const total = counts.reduce((sum, c, i) => sum + (c * COLUMNS[i].val), 0);
    if (total === current.target) {
      sounds.correct();
      if (round < CHALLENGES.length - 1) {
        setRound(r => r + 1);
        setCounts([0,0,0,0,0,0,0]); // reset for next round
      } else {
        sounds.badge();
        onComplete();
      }
    } else {
      sounds.wrong();
    }
  };

  const total = counts.reduce((sum, c, i) => sum + (c * COLUMNS[i].val), 0);

  return (
    <div style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '4px solid #333', width: '100%', maxWidth: '900px', textAlign: 'center' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Plinko Place Value</span>
        <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>Round {round + 1} / 3</span>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '15px', marginBottom: '30px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Drop tokens to match the Expanded Form:</h3>
        <h2 style={{ color: '#fff', fontSize: '1.8rem', letterSpacing: '2px', margin: '10px 0' }}>{current.exp}</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', position: 'relative', minHeight: '400px' }}>
        {COLUMNS.map((col, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            
            <button 
              onClick={() => dropToken(idx)}
              style={{
                width: '45px', height: '45px', borderRadius: '50%', background: col.color,
                border: 'none', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '15px',
                transform: 'scale(1)', transition: 'transform 0.1s'
              }}
              onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
            >
              +
            </button>

            {/* Tube */}
            <div style={{ flex: 1, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', border: `2px solid rgba(255,255,255,0.1)`, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse', padding: '5px' }}>
              
              {Array.from({ length: counts[idx] }).map((_, i) => (
                <div key={i} style={{ width: '46px', height: '46px', borderRadius: '50%', background: col.color, margin: '2px 0', boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0 }}>
                  {col.label}
                </div>
              ))}

              {droppingToken?.idx === idx && (
                <div style={{ position: 'absolute', top: 0, left: '5px', width: '46px', height: '46px', borderRadius: '50%', background: col.color, animation: 'dropIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards', zIndex: 10 }} />
              )}
            </div>

            <button 
              onClick={() => removeToken(idx)}
              style={{
                width: '40px', height: '40px', borderRadius: '50%', background: '#444',
                border: '2px solid #666', cursor: 'pointer', boxShadow: '0 5px 10px rgba(0,0,0,0.5)',
                color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '15px',
                transform: 'scale(1)', transition: 'transform 0.1s'
              }}
              onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
            >
              -
            </button>
            <div style={{ color: col.color, fontWeight: 'bold', marginTop: '5px', fontSize: '0.85rem' }}>{col.val >= 1000 ? (col.val/1000)+'k' : col.val}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes dropIn {
          0% { transform: translateY(-50px); opacity: 1; }
          100% { transform: translateY(220px); opacity: 0; }
        }
      `}</style>

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', padding: '20px', borderRadius: '15px' }}>
        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
          {total.toLocaleString()}
        </div>
        <button className="btn btn-green" onClick={handleCheck}>Check Number</button>
      </div>

    </div>
  );
}
