import { useState, useEffect } from 'react';
import { numberToWords, toExpandedForm } from '../../utils/numberWords';
import { shuffleArray } from '../../utils/questionBank';
import { sounds } from '../../utils/audio';

export default function WorldNumberMatch({ onComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());

  useEffect(() => {
    // Generate targets
    const targets = [1500000, 1050000, 3200000, 3020000];
    const newCards = [];
    targets.forEach((val, i) => {
      newCards.push({ id: `${i}-num`, matchId: i, display: val.toLocaleString(), kind: 'numeral' });
      newCards.push({ id: `${i}-word`, matchId: i, display: numberToWords(val), kind: 'words' });
      newCards.push({ id: `${i}-exp`, matchId: i, display: toExpandedForm(val).join(' + ').replace(/(\d)(?=(\d{3})+$)/g,'$1'), kind: 'expanded' });
    });
    setCards(shuffleArray(newCards));
  }, []);

  const handleCardClick = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.has(idx)) return;
    
    sounds.click();
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const c1 = cards[newFlipped[0]];
      const c2 = cards[newFlipped[1]];
      
      if (c1.matchId === c2.matchId) {
        // match!
        setTimeout(() => {
          sounds.correct();
          const newMatched = new Set(matched);
          newMatched.add(newFlipped[0]);
          newMatched.add(newFlipped[1]);
          setMatched(newMatched);
          setFlipped([]);
          if (newMatched.size === cards.length) {
            setTimeout(onComplete, 1000);
          }
        }, 500);
      } else {
        // wrong
        setTimeout(() => {
          sounds.wrong();
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '900px' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--gold)', marginBottom: '2rem' }}>World Number Match</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.has(idx);
          const isMatched = matched.has(idx);
          
          return (
            <div 
              key={card.id}
              onClick={() => handleCardClick(idx)}
              style={{
                background: isMatched ? 'rgba(76, 175, 80, 0.2)' : isFlipped ? 'var(--bg-card-solid)' : 'rgba(255,255,255,0.1)',
                border: `2px solid ${isMatched ? 'var(--green)' : isFlipped ? 'var(--blue-bright)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 'var(--radius-md)',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                cursor: isFlipped ? 'default' : 'pointer',
                transition: 'var(--transition)',
                transform: isFlipped ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isFlipped ? 'var(--shadow-glow)' : 'none',
                textAlign: 'center',
                fontSize: card.kind === 'words' ? '0.9rem' : '1.1rem'
              }}
            >
              {isFlipped ? (
                <span style={{ color: 'var(--white)', fontWeight: 'bold' }}>{card.display}</span>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '2rem' }}>?</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
