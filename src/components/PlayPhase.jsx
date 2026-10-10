import { useState, useEffect } from 'react';
import { generateSessionQuestions } from '../utils/questionBank';
import { calcXP, calcStars, canUnlockWorld } from '../utils/scoring';
import { sounds, playNarration, stopNarration } from '../utils/audio';
import { worlds } from '../data/worldContent';
import QuestionRenderer from './QuestionRenderer';

export default function PlayPhase({ onComplete, numeration, onToggleNumeration }) {
  const [questions, setQuestions] = useState([]);
  const [worldScores, setWorldScores] = useState(Array(6).fill(null));
  const [currentWorld, setCurrentWorld] = useState(null); // null = map view
  
  const [qIndex, setQIndex] = useState(0); // 0-9 inside a world
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(null);

  const [worldCorrect, setWorldCorrect] = useState(0);

  useEffect(() => {
    playNarration('play_intro');
    setQuestions(generateSessionQuestions());
    return () => stopNarration();
  }, []);

  const startWorld = (idx) => {
    sounds.click();
    setCurrentWorld(idx);
    setQIndex(0);
    setWorldCorrect(0);
    setAttemptCount(0);
    setShowHint(null);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      sounds.correct();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      if (newStreak >= 5) sounds.streak();
      
      const earnedXp = calcXP(attemptCount + 1, showHint ? 1 : 0, newStreak);
      setXp(x => x + earnedXp);
      setWorldCorrect(c => c + 1);
      
      setTimeout(nextQuestion, 1500);
    } else {
      sounds.wrong();
      setStreak(0);
      setAttemptCount(a => a + 1);
      if (attemptCount === 0) setShowHint(1);
      else if (attemptCount === 1) setShowHint(2);
    }
  };

  const nextQuestion = () => {
    setAttemptCount(0);
    setShowHint(null);
    if (qIndex < 9) {
      setQIndex(q => q + 1);
    } else {
      // World Complete
      sounds.badge();
      const newScores = [...worldScores];
      // Keep best score
      newScores[currentWorld] = Math.max(newScores[currentWorld] || 0, worldCorrect + 1); // +1 because current correct just happened
      setWorldScores(newScores);
      
      setTimeout(() => setCurrentWorld(null), 2000);
    }
  };

  const activeQuestion = questions.length > 0 && currentWorld !== null ? questions[currentWorld * 10 + qIndex] : null;

  return (
    <div className="phase-container" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="hud">
          <div className="hud-item xp">⭐ {xp} XP</div>
          <div className="hud-item streak">🔥 Streak: {streak}</div>
        </div>

        {currentWorld !== null && currentWorld >= 5 && (
          <button className="btn btn-outline" onClick={onToggleNumeration} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            System: {numeration === 'international' ? 'International' : 'Indian'}
          </button>
        )}
      </div>

      {currentWorld === null ? (
        /* World Map */
        <div className="glass-card" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--gold)', marginBottom: '1rem' }}>The Great Number Expedition Map</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {worlds.map((w, i) => {
              const locked = i > 0 && !canUnlockWorld(worldScores[i-1]);
              const score = worldScores[i];
              const stars = score !== null ? calcStars(score) : 0;
              return (
                <div key={w.id} className="glass-card" style={{ padding: '1rem', opacity: locked ? 0.5 : 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '3rem' }}>{w.flag}</div>
                  <h3 style={{ fontSize: '1.2rem' }}>{w.theme}</h3>
                  {score !== null && (
                    <div style={{ color: 'var(--gold)' }}>
                      {'⭐'.repeat(stars)}{'🌑'.repeat(3-stars)} <br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{score}/10</span>
                    </div>
                  )}
                  <button className="btn btn-primary" onClick={() => startWorld(i)} disabled={locked}>
                    {locked ? 'Locked' : score !== null ? 'Replay' : 'Play'}
                  </button>
                </div>
              );
            })}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-green" onClick={() => onComplete({ xp, maxStreak, worldScores })} disabled={!canUnlockWorld(worldScores[0])}>
              Finish Expedition & Reflect
            </button>
          </div>
        </div>
      ) : (
        /* Question View */
        activeQuestion && (
          <QuestionRenderer 
            question={activeQuestion} 
            onAnswer={handleAnswer} 
            numeration={numeration} 
            showHint={showHint}
            attemptCount={attemptCount}
          />
        )
      )}

    </div>
  );
}
