import { useState, useEffect, useCallback, useRef } from 'react';
import { stopNarration, playNarration } from '../utils/audio';

const STORY_SLIDES = [
  {
    image: '/assets/images/yuki.png',
    title: "Tokyo, Japan 🇯🇵",
    text: <>Yuki's city is huge with exactly <strong>9700000</strong> people! That's hard to read, right? Let's add commas to group the digits in sets of three: <strong>9,700,000!</strong> Now it's much simpler!</>,
    highlight: '"Group in 3s from the right!"',
    mascotText: "Commas make it easy! 🌟",
  },
  {
    image: '/assets/images/sofia.png',
    title: "Paris, France 🇫🇷",
    text: <>Sofia is visiting the Eiffel Tower. Did you know <strong>six million nine hundred thousand</strong> people visit it every year? Let's write this in numerals: <strong>6,900,000!</strong></>,
    highlight: '"Words to Numerals!"',
    mascotText: "Write it down! 📝",
  },
  {
    image: '/assets/images/priya.png',
    title: "Mumbai, India 🇮🇳",
    text: <>Priya's vibrant city has the exact same big number: <strong>6,900,000</strong>. Let's write it in expanded form to see the true value of every digit: <strong>6,000,000 + 900,000</strong>.</>,
    highlight: '"Value of every digit!"',
    mascotText: "Break it apart! 🧩",
  },
  {
    image: '/assets/images/carlos.png',
    title: "Rio de Janeiro, Brazil 🇧🇷",
    text: <>Carlos read that <strong>1,500,000</strong> people visited this sunny beach. What is the value of the 5? It's in the <strong>hundred-thousands</strong> place, so it means <strong>500,000!</strong></>,
    highlight: '"Place Value Chart!"',
    mascotText: "Find its place! 📍",
  },
  {
    image: '/assets/images/amara.png',
    title: "Lagos, Nigeria 🇳🇬",
    text: <>Amara sees a digital billboard showing her city grew by <strong>2,300,000</strong> people. Big numbers are everywhere! Are you ready to try building large numbers yourself?</>,
    highlight: '"You are a Number Master!"',
    mascotText: "Let's practice! 🚀",
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    playNarration(`story_${slide + 1}`);
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); stopNarration(); };
  }, [slide]);

  const goNext = useCallback(() => {
    if (anim) return;
    stopNarration();
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    stopNarration();
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      
      {/* Progress Bar */}
      <div className="story-progress" style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '1000px' }}>
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>

      {/* Main Card */}
      <div className={`story-card ${anim ? 'flipping' : ''}`} style={{
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', /* PERFECT SPLIT */
        width: '100%', 
        maxWidth: '1000px',
        background: 'var(--bg-card-glass, rgba(20,20,40,0.8))', 
        borderRadius: '24px', 
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        minHeight: '450px',
        maxHeight: '500px'
      }}>
        
        {/* Left Side: Image (100% height, cover) */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; }} />
        </div>

        {/* Right Side: Text */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--gold)', marginBottom: '1rem', fontFamily: 'var(--font-display, inherit)' }}>{s.title}</h2>
          
          <p style={{ fontSize: '1.5rem', lineHeight: '1.5', color: '#e0e0e0', marginBottom: '1.2rem', opacity: textVis ? 1 : 0, transition: 'opacity 0.8s ease' }}>
            {s.text}
          </p>
          
          <div style={{ background: 'rgba(255,215,0,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', borderLeft: '4px solid var(--gold)', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--gold)', opacity: hlVis ? 1 : 0, transition: 'all 0.5s ease', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✨</span> <span>{s.highlight}</span>
          </div>

          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', padding: '6px 10px', background: 'var(--blue-mid, #2a52be)', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }}>{s.mascotText}</div>
            <div style={{ fontSize: '1.2rem', background: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>🧭</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="story-nav" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2rem', width: '100%', maxWidth: '1000px' }}>
        <button className="btn btn-outline btn-lg" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>◀ Back</button>
        
        <div className="story-dots" style={{ display: 'flex', gap: '10px' }}>
          {STORY_SLIDES.map((_, i) => (
            <div key={i} style={{
              width: i === slide ? '30px' : '12px',
              height: '12px',
              borderRadius: '6px',
              background: i === slide ? 'var(--gold)' : i < slide ? 'var(--green)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
        
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-lg`} onClick={goNext}>
          {isLast ? "🚀 Let's Practice!" : 'Next ▶'}
        </button>
      </div>

    </div>
  );
}
