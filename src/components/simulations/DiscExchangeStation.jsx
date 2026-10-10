import { useState } from 'react';
import { sounds } from '../../utils/audio';

const DISC_VALUES = [
  { value: 1000000, label: 'Millions', color: 'var(--disc-millions)' },
  { value: 100000, label: 'Hundred-Thousands', color: 'var(--disc-hundred-thousands)' },
  { value: 10000, label: 'Ten-Thousands', color: 'var(--disc-ten-thousands)' },
  { value: 1000, label: 'Thousands', color: 'var(--disc-thousands)' },
  { value: 100, label: 'Hundreds', color: 'var(--disc-hundreds)' },
  { value: 10, label: 'Tens', color: 'var(--disc-tens)' },
  { value: 1, label: 'Ones', color: 'var(--disc-ones)' },
];

export default function DiscExchangeStation({ onComplete }) {
  const [target] = useState(243000); // hardcoded for demo or randomize
  const [mat, setMat] = useState({
    1000000: 0, 100000: 0, 10000: 0, 1000: 0, 100: 0, 10: 0, 1: 0
  });
  const [selectedDisc, setSelectedDisc] = useState(null);
  const [tradePrompt, setTradePrompt] = useState(null); // { val: number }

  const currentTotal = () => {
    return Object.entries(mat).reduce((sum, [val, count]) => sum + (Number(val) * count), 0);
  };

  const handleColumnClick = (val) => {
    if (selectedDisc) {
      if (selectedDisc === val) {
        // place disc
        sounds.click();
        const newCount = mat[val] + 1;
        setMat({ ...mat, [val]: newCount });
        setSelectedDisc(null);
        
        if (newCount >= 10 && val * 10 <= 1000000) {
          setTradePrompt({ val });
        }
      } else {
        sounds.wrong();
        setSelectedDisc(null);
      }
    }
  };

  const handleTrade = () => {
    sounds.badge();
    const val = tradePrompt.val;
    const nextVal = val * 10;
    setMat(prev => ({
      ...prev,
      [val]: prev[val] - 10,
      [nextVal]: prev[nextVal] + 1
    }));
    setTradePrompt(null);
  };

  const checkNumber = () => {
    if (currentTotal() === target) {
      sounds.correct();
      onComplete();
    } else {
      sounds.wrong();
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--gold)' }}>Build the number: {target.toLocaleString()}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Current: {currentTotal().toLocaleString()}</p>
      </div>

      {tradePrompt && (
        <div style={{ background: 'var(--bg-card-solid)', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem', textAlign: 'center', border: '1px solid var(--gold)' }}>
          <p>You have 10 discs in the {tradePrompt.val}s column!</p>
          <button className="btn btn-primary mt-1" onClick={handleTrade}>Trade for 1 × {tradePrompt.val * 10}</button>
        </div>
      )}

      {/* Place Value Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, 1fr)`, gap: '0.5rem', marginBottom: '2rem' }}>
        {DISC_VALUES.map((col) => (
          <div 
            key={col.value} 
            onClick={() => handleColumnClick(col.value)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px',
              padding: '0.5rem',
              minHeight: '200px',
              border: `2px dashed ${selectedDisc === col.value ? col.color : 'rgba(255,255,255,0.2)'}`,
              cursor: selectedDisc ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{col.label}</div>
            {/* Draw discs */}
            {Array.from({ length: mat[col.value] }).map((_, i) => (
              <div key={i} style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: col.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', color: '#000', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                animation: 'discSnap 0.3s'
              }}>
                {col.value >= 1000 ? (col.value/1000)+'k' : col.value}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Disc Tray */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {DISC_VALUES.map((col) => (
           <div 
             key={col.value}
             onClick={() => { sounds.click(); setSelectedDisc(selectedDisc === col.value ? null : col.value); }}
             style={{
               width: '50px', height: '50px', borderRadius: '50%',
               background: col.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
               fontSize: '0.7rem', color: '#000', fontWeight: 'bold',
               cursor: 'pointer',
               boxShadow: selectedDisc === col.value ? '0 0 15px white' : '0 4px 8px rgba(0,0,0,0.3)',
               transform: selectedDisc === col.value ? 'translateY(-5px)' : 'none',
               transition: 'all 0.2s'
             }}
           >
             {col.value >= 1000 ? (col.value/1000)+'k' : col.value}
           </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-green" onClick={checkNumber}>Check my number</button>
      </div>
    </div>
  );
}
