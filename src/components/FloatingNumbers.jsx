import { useEffect, useState } from 'react';

export default function FloatingNumbers() {
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    const generateNumber = () => {
      const val = Math.floor(Math.random() * 9000000) + 1000000;
      return {
        id: Math.random(),
        value: val.toLocaleString(),
        left: Math.random() * 100 + 'vw',
        animationDuration: (Math.random() * 20 + 15) + 's',
        opacity: Math.random() * 0.3 + 0.1,
        fontSize: (Math.random() * 2 + 1) + 'rem'
      };
    };

    setNumbers(Array.from({ length: 15 }, generateNumber));
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {numbers.map(n => (
        <div key={n.id} style={{
          position: 'absolute',
          bottom: '-10%',
          left: n.left,
          color: 'var(--white)',
          opacity: n.opacity,
          fontSize: n.fontSize,
          fontFamily: 'var(--font-display)',
          animation: `floatUp ${n.animationDuration} linear infinite`
        }}>
          {n.value}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-120vh) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
