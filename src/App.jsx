import { useState, useCallback, useEffect } from 'react';
import { stopNarration, setMuted } from './utils/audio';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';
import { Volume2, VolumeX, Home } from 'lucide-react';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '🌍', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Play' },
  { icon: '📓', label: 'Reflect' },
];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats] = useState(null);
  const [numeration, setNumeration] = useState('international');

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => { 
      const next = !prev;
      setMuted(!next);
      if (!next) stopNarration();
      return next; 
    });
  }, []);

  const goHome = useCallback(() => { stopNarration(); setPhase('intro'); setPlayStats(null); }, []);
  const restart = useCallback(() => { stopNarration(); setPhase('wonder'); setPlayStats(null); }, []);

  useEffect(() => {
    // Preload images
    const imagesToPreload = [
      '/assets/images/yuki.png',
      '/assets/images/sofia.png',
      '/assets/images/priya.png',
      '/assets/images/carlos.png',
      '/assets/images/amara.png'
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Preload audio
    const audioToPreload = [
      'intro', 'wonder', 'story_1', 'story_2', 'story_3', 'story_4', 'story_5',
      'station_1', 'station_2', 'station_3', 'station_4', 'correct', 'wrong', 'play_intro', 'reflect'
    ];
    audioToPreload.forEach(id => {
      const a = new Audio();
      a.src = `/assets/audio/${id}.mp3`;
      a.preload = 'auto';
    });

    return () => stopNarration();
  }, []);

  const phaseIndex = PHASES.indexOf(phase);
  const showJourney = phase !== 'intro';

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">
        <div className="app-header">
          {showJourney ? (
            <button className="home-btn" onClick={goHome}><Home size={20} /> Home</button>
          ) : <div style={{width: 100}}></div>}

          {showJourney && (
            <div className="journey-bar">
              {JOURNEY_ITEMS.map((item, i) => {
                const stepPhaseIndex = i + 1;
                const isActive = phaseIndex === stepPhaseIndex;
                const isCompleted = phaseIndex > stepPhaseIndex;
                return (
                  <div key={i} className="journey-step-container">
                    <div className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                      <div className="journey-step-dot">{isCompleted ? '✓' : item.icon}</div>
                      <div className="journey-step-label">{item.label}</div>
                    </div>
                    {i < JOURNEY_ITEMS.length - 1 && (
                      <div className={`journey-connector ${phaseIndex > stepPhaseIndex ? 'filled' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button className="audio-toggle-btn" onClick={toggleAudio}>
            {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        {phase === 'intro'    && <IntroScreen onStart={() => setPhase('wonder')} audioEnabled={audioEnabled} onToggleAudio={toggleAudio} />}
        {phase === 'wonder'   && <WonderPhase onComplete={() => setPhase('story')} audioEnabled={audioEnabled} />}
        {phase === 'story'    && <StoryPhase onComplete={() => setPhase('simulate')} audioEnabled={audioEnabled} />}
        {phase === 'simulate' && <SimulatePhase onComplete={() => setPhase('play')} audioEnabled={audioEnabled} />}
        {phase === 'play'     && <PlayPhase onComplete={(stats) => { setPlayStats(stats); setPhase('reflect'); }} audioEnabled={audioEnabled} numeration={numeration} onToggleNumeration={() => setNumeration(n => n === 'international' ? 'indian' : 'international')} />}
        {phase === 'reflect'  && <ReflectPhase stats={playStats} onRestart={restart} onGoHome={goHome} audioEnabled={audioEnabled} />}
      </div>
    </>
  );
}
