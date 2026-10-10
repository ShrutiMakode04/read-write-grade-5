import { useState, useEffect } from 'react';
import { numberToWords } from '../../utils/numberWords';
import { shuffleArray } from '../../utils/questionBank';
import { sounds } from '../../utils/audio';

export default function WordBuilderStation({ onComplete }) {
  const targetValue = 6420315;
  const [bank, setBank] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const correctTiles = numberToWords(targetValue).split(' ');
    const decoys = shuffleArray(['and', 'times', 'over', 'plus']).slice(0, 2);
    setBank(shuffleArray([...correctTiles, ...decoys].map((t, i) => ({ id: i, word: t }))));
  }, []);

  const handleTileClick = (tile, fromBank) => {
    sounds.click();
    if (fromBank) {
      setBank(bank.filter(t => t.id !== tile.id));
      setSlots([...slots, tile]);
    } else {
      setSlots(slots.filter(t => t.id !== tile.id));
      setBank([...bank, tile]);
    }
  };

  const checkSentence = () => {
    const sentence = slots.map(t => t.word).join(' ').trim();
    if (sentence === numberToWords(targetValue)) {
      sounds.correct();
      onComplete();
    } else {
      sounds.wrong();
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '900px' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--gold)', marginBottom: '2rem' }}>Word-Builder Machine</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem' }}>
        Build the word form for: <strong style={{color: 'var(--gold)'}}>{targetValue.toLocaleString()}</strong>
      </p>

      {/* Slots */}
      <div style={{
        minHeight: '80px', 
        borderBottom: '2px solid rgba(255,255,255,0.2)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center',
        padding: '1rem'
      }}>
        {slots.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Tap words below to build the sentence...</span>}
        {slots.map(tile => (
          <div 
            key={tile.id} 
            onClick={() => handleTileClick(tile, false)}
            style={{
              background: 'var(--blue-mid)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              animation: 'discSnap 0.2s'
            }}
          >
            {tile.word}
          </div>
        ))}
      </div>

      {/* Bank */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.8rem',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        {bank.map(tile => (
          <div 
            key={tile.id} 
            onClick={() => handleTileClick(tile, true)}
            style={{
              background: 'var(--purple-mid)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 'bold',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'transform 0.1s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {tile.word}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-green" onClick={checkSentence}>Submit Sentence</button>
      </div>
    </div>
  );
}
