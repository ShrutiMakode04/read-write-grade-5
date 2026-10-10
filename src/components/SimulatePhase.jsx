import { useState, useEffect } from 'react';
import FormSorterStation from './simulations/FormSorterStation';
import PlinkoPlaceValue from './simulations/PlinkoPlaceValue';
import PeriodFusionReactor from './simulations/PeriodFusionReactor';
import ConveyorBeltBuilder from './simulations/ConveyorBeltBuilder';
import { sounds, playNarration, stopNarration } from '../utils/audio';

const STATIONS = [
  { id: 'vault', icon: '📦', title: 'Form Sorter', desc: 'Sort the cards' },
  { id: 'plinko', icon: '🎯', title: 'Plinko Place Value', desc: 'Drop the tokens' },
  { id: 'fusion', icon: '⚛️', title: 'Period Fusion', desc: 'Combine the blocks' },
  { id: 'conveyor', icon: '🏭', title: 'Conveyor Builder', desc: 'Sort the digits' }
];

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [activeStation, setActiveStation] = useState(0);
  const [completedStations, setCompletedStations] = useState([false, false, false, false]);

  useEffect(() => {
    playNarration(`station_${activeStation + 1}`);
    return () => stopNarration();
  }, [activeStation]);

  const handleStationComplete = () => {
    sounds.badge();
    const newCompleted = [...completedStations];
    newCompleted[activeStation] = true;
    setCompletedStations(newCompleted);
    
    if (activeStation < 3) {
      setTimeout(() => setActiveStation(prev => prev + 1), 1500);
    } else {
      setTimeout(onComplete, 2000);
    }
  };

  return (
    <div className="simulate-phase" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', minHeight: '100vh', width: '100%' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '10px' }}>Interactive Lab</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Complete all 4 stations to become a Number Master!</p>
      </div>

      {/* Modern Geometry-Shapes style navigation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '40px', width: '100%', maxWidth: '1000px' }}>
        {STATIONS.map((station, idx) => {
          const isLocked = idx > 0 && !completedStations[idx - 1];
          const isActive = idx === activeStation;
          const isDone = completedStations[idx];
          
          return (
            <button 
              key={station.id}
              onClick={() => setActiveStation(idx)}
              disabled={isLocked}
              style={{
                background: isActive ? 'var(--gold)' : isDone ? 'var(--green)' : 'var(--bg-card)',
                color: isActive ? '#000' : '#fff',
                border: `2px solid ${isActive ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '16px',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.5 : 1,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 10px 20px rgba(255,215,0,0.3)' : 'none'
              }}
            >
              <span style={{ fontSize: '2rem' }}>{isDone ? '✅' : station.icon}</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{station.title}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{station.desc}</span>
            </button>
          )
        })}
      </div>

      {/* Active Station Container */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {activeStation === 0 && <FormSorterStation onComplete={handleStationComplete} />}
        {activeStation === 1 && <PlinkoPlaceValue onComplete={handleStationComplete} />}
        {activeStation === 2 && <PeriodFusionReactor onComplete={handleStationComplete} />}
        {activeStation === 3 && <ConveyorBeltBuilder onComplete={handleStationComplete} />}
      </div>

    </div>
  );
}
