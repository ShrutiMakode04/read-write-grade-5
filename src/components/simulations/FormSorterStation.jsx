import { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';

const BOXES = [
  { id: 'standard', title: 'Standard Form', color: '#ff3366', icon: '🔢' },
  { id: 'word', title: 'Word Form', color: '#33cc33', icon: '📝' },
  { id: 'expanded', title: 'Expanded Form', color: '#3399ff', icon: '🧩' }
];

const CHALLENGES = [
  [
    { id: 'i1', type: 'standard', content: '7,405,000' },
    { id: 'i2', type: 'word', content: 'Seven million, four hundred five thousand' },
    { id: 'i3', type: 'expanded', content: '7,000,000 + 400,000 + 5,000' }
  ],
  [
    { id: 'i4', type: 'standard', content: '1,020,300' },
    { id: 'i5', type: 'word', content: 'One million, twenty thousand, three hundred' },
    { id: 'i6', type: 'expanded', content: '1,000,000 + 20,000 + 300' }
  ],
  [
    { id: 'i7', type: 'standard', content: '9,909,909' },
    { id: 'i8', type: 'word', content: 'Nine million, nine hundred nine thousand, nine hundred nine' },
    { id: 'i9', type: 'expanded', content: '9,000,000 + 900,000 + 9,000 + 900 + 9' }
  ]
];

export default function FormSorterStation({ onComplete }) {
  const [round, setRound] = useState(0);
  const [bank, setBank] = useState([]);
  const [placed, setPlaced] = useState({ standard: null, word: null, expanded: null });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setBank([...CHALLENGES[round]].sort(() => Math.random() - 0.5));
  }, [round]);

  const handleItemClick = (item) => {
    sounds.click();
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleBoxClick = (boxId) => {
    if (!selectedItem) {
      if (placed[boxId]) {
        sounds.click();
        setBank([...bank, placed[boxId]]);
        setPlaced({ ...placed, [boxId]: null });
      }
      return;
    }

    sounds.click();
    
    const newBank = bank.filter(b => b.id !== selectedItem.id);
    if (placed[boxId]) {
      newBank.push(placed[boxId]);
    }
    
    setBank(newBank);
    setPlaced({ ...placed, [boxId]: selectedItem });
    setSelectedItem(null);
  };

  const handleCheck = () => {
    if (!placed.standard || !placed.word || !placed.expanded) {
      sounds.wrong();
      return;
    }

    if (
      placed.standard.type === 'standard' &&
      placed.word.type === 'word' &&
      placed.expanded.type === 'expanded'
    ) {
      sounds.correct();
      if (round < CHALLENGES.length - 1) {
        setRound(r => r + 1);
        setPlaced({ standard: null, word: null, expanded: null });
        setSelectedItem(null);
      } else {
        sounds.badge();
        onComplete();
      }
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2a0845 100%)', padding: '40px', borderRadius: '30px', border: '4px solid #6441A5', width: '100%', maxWidth: '1000px', textAlign: 'center', boxShadow: '0 10px 40px rgba(100, 65, 165, 0.4)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Form Sorter 📦</span>
        <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>Round {round + 1} / 3</span>
      </div>

      <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '30px' }}>
        Click a card below, then click a box to place it! Match the correct forms.
      </p>

      {/* The 3 Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {BOXES.map(box => (
          <div 
            key={box.id} 
            onClick={() => handleBoxClick(box.id)}
            style={{ 
              background: placed[box.id] ? `${box.color}22` : 'rgba(255,255,255,0.05)', 
              border: `3px dashed ${selectedItem ? box.color : placed[box.id] ? box.color : 'rgba(255,255,255,0.2)'}`, 
              borderRadius: '20px', 
              padding: '20px', 
              minHeight: '200px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedItem ? `0 0 15px ${box.color}44` : 'none'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{box.icon}</div>
            <h3 style={{ color: box.color, marginBottom: '20px' }}>{box.title}</h3>
            
            {placed[box.id] ? (
              <div style={{ 
                background: box.color, 
                color: '#fff', 
                padding: '15px', 
                borderRadius: '12px', 
                width: '100%', 
                fontWeight: 'bold',
                fontSize: placed[box.id].type === 'word' ? '1rem' : '1.2rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                animation: 'popIn 0.3s'
              }}>
                {placed[box.id].content}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click here to place card</div>
            )}
          </div>
        ))}
      </div>

      {/* The Bank of Cards */}
      <div style={{ minHeight: '100px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', marginBottom: '30px' }}>
        {bank.length === 0 && <span style={{ color: 'var(--text-muted)' }}>All cards placed!</span>}
        {bank.map(item => (
          <div 
            key={item.id} 
            onClick={() => handleItemClick(item)}
            style={{ 
              background: selectedItem?.id === item.id ? 'var(--gold)' : '#fff', 
              color: '#000', 
              padding: '15px 25px', 
              borderRadius: '12px', 
              fontWeight: 'bold',
              fontSize: item.type === 'word' ? '1rem' : '1.2rem',
              cursor: 'pointer',
              boxShadow: selectedItem?.id === item.id ? '0 0 20px var(--gold)' : '0 5px 15px rgba(0,0,0,0.2)',
              transform: selectedItem?.id === item.id ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
              maxWidth: '300px'
            }}
          >
            {item.content}
          </div>
        ))}
      </div>

      <button 
        className="btn btn-primary" 
        style={{ fontSize: '1.5rem', padding: '15px 50px', borderRadius: '50px' }} 
        onClick={handleCheck}
      >
        ✅ Check Answers
      </button>

      <style>{`
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
