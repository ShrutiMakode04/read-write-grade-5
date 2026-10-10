import { useState } from 'react';
import { sounds } from '../../utils/audio';

const CHALLENGES = [
  {
    targetWords: "Nine million, four hundred two thousand, fifty-five",
    targetFused: "9,402,055",
    blocks: [
      { id: 'b1', val: '055', type: 'ones', color: '#4CAF50' },
      { id: 'b2', val: '9', type: 'millions', color: '#E91E63' },
      { id: 'b3', val: '402', type: 'thousands', color: '#3F51B5' }
    ]
  },
  {
    targetWords: "Two million, one hundred thousand, three",
    targetFused: "2,100,003",
    blocks: [
      { id: 'b4', val: '100', type: 'thousands', color: '#3F51B5' },
      { id: 'b5', val: '003', type: 'ones', color: '#4CAF50' },
      { id: 'b6', val: '2', type: 'millions', color: '#E91E63' }
    ]
  },
  {
    targetWords: "Five million, ninety thousand, eight hundred",
    targetFused: "5,090,800",
    blocks: [
      { id: 'b7', val: '5', type: 'millions', color: '#E91E63' },
      { id: 'b8', val: '800', type: 'ones', color: '#4CAF50' },
      { id: 'b9', val: '090', type: 'thousands', color: '#3F51B5' }
    ]
  }
];

export default function PeriodFusionReactor({ onComplete }) {
  const [round, setRound] = useState(0);
  const current = CHALLENGES[round];

  // We need a way to reset state completely when round changes. 
  // We'll use a useEffect to sync bank to current.blocks.
  
  const [bank, setBank] = useState(current.blocks);
  const [reactor, setReactor] = useState({ millions: null, thousands: null, ones: null });

  // Whenever round changes, reset the bank and reactor
  useState(() => {
    setBank(current.blocks);
    setReactor({ millions: null, thousands: null, ones: null });
  }, [round]);

  const handleBlockClick = (block, fromBank) => {
    sounds.click();
    if (fromBank) {
      if (!reactor[block.type]) {
        setReactor({ ...reactor, [block.type]: block });
        setBank(bank.filter(b => b.id !== block.id));
      }
    } else {
      setReactor({ ...reactor, [block.type]: null });
      setBank([...bank, block]);
    }
  };

  const handleCheck = () => {
    if (reactor.millions && reactor.thousands && reactor.ones) {
      const fused = `${reactor.millions.val},${reactor.thousands.val},${reactor.ones.val}`;
      if (fused === current.targetFused) {
        sounds.correct(); 
        if (round < CHALLENGES.length - 1) {
          const nextRound = round + 1;
          setRound(nextRound);
          setBank(CHALLENGES[nextRound].blocks);
          setReactor({ millions: null, thousands: null, ones: null });
        } else {
          sounds.badge();
          onComplete();
        }
      } else {
        sounds.wrong();
      }
    } else {
      sounds.wrong();
    }
  };

  const renderSlot = (type, label) => {
    const block = reactor[type];
    return (
      <div 
        onClick={() => block && handleBlockClick(block, false)}
        style={{
          width: '120px', height: '120px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.05)',
          border: `3px dashed ${block ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          cursor: block ? 'pointer' : 'default', position: 'relative'
        }}
      >
        {!block && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>}
        {block && (
          <div style={{ width: '100%', height: '100%', borderRadius: '17px', background: block.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 'bold', color: '#fff', boxShadow: `0 0 20px ${block.color}`, animation: 'popIn 0.3s' }}>
            {block.val}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', padding: '40px', borderRadius: '30px', border: '4px solid #00d2ff', width: '100%', maxWidth: '900px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0, 210, 255, 0.3)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--gold)', margin: 0 }}>Period Fusion Reactor ⚛️</h2>
        <span style={{ color: 'var(--green)', fontWeight: 'bold', fontSize: '1.2rem' }}>Round {round + 1} / 3</span>
      </div>
      
      <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '40px' }}>Fuse the blocks to create:<br/>
        <strong style={{color: '#FFD700', fontSize: '1.8rem', textShadow: '0 0 10px rgba(255, 215, 0, 0.8)', padding: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', display: 'inline-block', marginTop: '10px'}}>
          {current.targetWords}
        </strong>
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '50px', background: 'rgba(0,0,0,0.5)', padding: '30px', borderRadius: '20px' }}>
        {renderSlot('millions', 'Millions')}
        <span style={{ fontSize: '3rem', color: 'var(--gold)' }}>,</span>
        {renderSlot('thousands', 'Thousands')}
        <span style={{ fontSize: '3rem', color: 'var(--gold)' }}>,</span>
        {renderSlot('ones', 'Ones')}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', minHeight: '100px', marginBottom: '40px' }}>
        {bank.map(b => (
          <div key={b.id} onClick={() => handleBlockClick(b, true)} style={{ width: '100px', height: '100px', borderRadius: '15px', background: b.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.4)', transition: 'transform 0.1s' }} onMouseOver={e => e.target.style.transform='translateY(-5px)'} onMouseOut={e => e.target.style.transform='none'}>
            {b.val}
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ fontSize: '1.5rem', padding: '15px 40px' }} onClick={handleCheck}>
        INITIATE FUSION
      </button>

      <style>{`
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
