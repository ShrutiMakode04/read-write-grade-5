import { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';

const CHALLENGES = [
  {
    targetStr: '9,753,108',
    options: ['8,753,109', '9,753,108', '9,108,753'],
    desc: 'Mission: Select the LARGEST possible number using digits 8, 1, 9, 3, 5, 0, 7'
  },
  {
    targetStr: '1,035,789',
    options: ['1,350,789', '1,789,035', '1,035,789'],
    desc: 'Mission: Select the SMALLEST possible number using digits 8, 1, 9, 3, 5, 0, 7'
  },
  {
    targetStr: '5,400,000',
    options: ['5,400,000', '5,004,000', '4,500,000'],
    desc: 'Mission: Select "Five million, four hundred thousand"'
  }
];

export default function ConveyorBeltBuilder({ onComplete }) {
  const [round, setRound] = useState(0);
  const current = CHALLENGES[round];

  const [bank, setBank] = useState([]);
  const [selected, setSelected] = useState(null);

  // Sync bank to current challenge on round change
  useEffect(() => {
    // Shuffle options
    setBank([...current.options].sort(() => Math.random() - 0.5).map((opt, i) => ({ id: i, val: opt })));
    setSelected(null);
  }, [round, current.options]);

  const handleOptionClick = (opt) => {
    sounds.click();
    setSelected(opt);
  };

  const handleCheck = () => {
    if (selected) {
      if (selected.val === current.targetStr) {
        sounds.correct();
        if (round < CHALLENGES.length - 1) {
          setRound(r => r + 1);
        } else {
          sounds.badge();
          onComplete();
        }
      } else {
        sounds.wrong();
        setSelected(null);
      }
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', padding: '40px', borderRadius: '30px', border: '4px solid #fff', width: '100%', maxWidth: '1000px', textAlign: 'center', boxShadow: '0 10px 40px rgba(56, 239, 125, 0.4)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Conveyor Belt Builder 🏭</h2>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', background: 'rgba(0,0,0,0.2)', padding: '5px 15px', borderRadius: '15px' }}>Round {round + 1} / 3</span>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '3px solid #ffcc00', boxShadow: '0 0 20px rgba(255, 204, 0, 0.4)', display: 'inline-block' }}>
        <h3 style={{ color: '#ffcc00', margin: '0 0 10px 0', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Target Challenge</h3>
        <p style={{ color: '#fff', fontSize: '1.6rem', margin: 0, fontWeight: 'bold' }}>
          {current.desc}
        </p>
      </div>

      {/* Selected Display */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{
            width: '400px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px',
            border: '4px dashed rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontSize: '3rem', fontWeight: 'bold', color: '#fff',
            boxShadow: selected ? '0 5px 15px rgba(0,0,0,0.3)' : 'inset 0 5px 10px rgba(0,0,0,0.2)',
            backgroundColor: selected ? '#ff9f43' : 'transparent',
            borderStyle: selected ? 'solid' : 'dashed',
            letterSpacing: '3px'
          }}
        >
          {selected ? selected.val : <span style={{fontSize: '1.5rem', opacity: 0.7}}>Select an option from the belt</span>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        
        {/* Conveyor Belt */}
        <div style={{ flex: 1, background: '#2f3542', padding: '20px', borderRadius: '50px', position: 'relative', overflow: 'hidden', border: '4px solid #57606f', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5)', maxWidth: '700px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', position: 'relative', zIndex: 2, minHeight: '60px' }}>
            {bank.map(b => (
              <div 
                key={b.id} 
                onClick={() => handleOptionClick(b)}
                style={{
                  padding: '15px 30px', background: selected?.id === b.id ? '#ff9f43' : '#ff4757', borderRadius: '25px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem',
                  fontWeight: 'bold', color: '#fff', cursor: 'pointer', boxShadow: '0 5px 10px rgba(0,0,0,0.3)',
                  border: `4px solid ${selected?.id === b.id ? '#fff' : '#ff6b81'}`,
                  transition: 'all 0.2s',
                  transform: selected?.id === b.id ? 'scale(1.1)' : 'scale(1)',
                  letterSpacing: '2px'
                }}
              >
                {b.val}
              </div>
            ))}
          </div>
          {/* Conveyor lines */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '100%', background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.3) 40px, rgba(0,0,0,0.3) 80px)', animation: 'conveyorMove 3s linear infinite', zIndex: 1 }} />
        </div>

        <button className="btn btn-primary" style={{ fontSize: '1.5rem', padding: '15px 40px', background: '#fff', color: '#11998e', border: 'none', borderRadius: '25px', fontWeight: 'bold' }} onClick={handleCheck}>
          Check
        </button>
      </div>

      <style>{`
        @keyframes conveyorMove { 0% { transform: translateX(0); } 100% { transform: translateX(-80px); } }
      `}</style>
    </div>
  );
}
