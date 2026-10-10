import { useEffect } from 'react';
import { BADGES } from '../utils/scoring';
import { sounds, playNarration, stopNarration } from '../utils/audio';

export default function ReflectPhase({ stats, onRestart, onGoHome }) {
  useEffect(() => {
    playNarration('reflect');
    return () => stopNarration();
  }, []);
  // stats = { xp, maxStreak, worldScores }
  // To evaluate badges, we construct a fake state object as expected by BADGES condition
  const mockState = {
    phaseComplete: { wonder: true, story: true }, // assume completed if here
    simStationsComplete: [true, true, true, true],
    totalAnswered: 100, // approximation for UI
    correctCount: stats?.worldScores?.reduce((a,b)=>a+(b||0),0) || 0,
    worldScores: stats?.worldScores || [],
    maxStreak: stats?.maxStreak || 0,
    compareStreak: 5, // mock for now, actual tracking is complex
    wordProblemCorrect: 5,
    roundingRunwayComplete: true,
    numerationToggleUsedCorrectly: true
  };

  const earnedBadges = BADGES.filter(b => b.condition(mockState));

  return (
    <div className="phase-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '1rem' }}>Expedition Complete!</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Which country's big number surprised you most? Share it with your teacher!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Certificate / Stats */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--gold)' }}>
            <h3 style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Final Stats</h3>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐ {stats?.xp || 0} XP</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--coral)' }}>🔥 Best Streak: {stats?.maxStreak || 0}</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--green-light)', marginTop: '0.5rem' }}>
              Worlds Conquered: {stats?.worldScores?.filter(s => s !== null).length || 0}/10
            </div>
          </div>

          {/* Badges */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '1rem' }}>
            <h3 style={{ color: 'var(--blue-light)', marginBottom: '1rem' }}>Badges Earned</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {earnedBadges.length > 0 ? earnedBadges.map(b => (
                <div key={b.id} style={{ background: 'var(--purple-deep)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                  {b.label}
                </div>
              )) : (
                <div style={{ color: 'var(--text-muted)' }}>Keep exploring to earn badges!</div>
              )}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => { sounds.click(); onGoHome(); }}>
            Back to Home
          </button>
          <button className="btn btn-primary" onClick={() => { sounds.click(); onRestart(); }}>
            Restart Expedition
          </button>
        </div>
      </div>
    </div>
  );
}
