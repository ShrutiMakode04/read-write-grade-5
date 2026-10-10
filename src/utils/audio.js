let isMuted = false;
let currentVoice = null;

// The sounds object will just handle simple UI sounds (beeps, pops) using Web Audio API
// We'll keep these short synthetic sounds for clicks and badges.
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol=0.1) {
  if (isMuted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const sounds = {
  click: () => playTone(500, 'sine', 0.05, 0.2),
  correct: () => { 
    playTone(800, 'sine', 0.1); 
    setTimeout(() => playTone(1200, 'sine', 0.2), 100); 
    playNarration('correct');
  },
  wrong: () => { 
    playTone(300, 'sawtooth', 0.2); 
    setTimeout(() => playTone(250, 'sawtooth', 0.2), 200); 
    playNarration('wrong');
  },
  badge: () => {
    playTone(523.25, 'sine', 0.2); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2), 150); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.4), 300); // G5
  },
  streak: () => {
    playTone(440, 'sine', 0.1); // A4
    setTimeout(() => playTone(554.37, 'sine', 0.1), 100); // C#5
    setTimeout(() => playTone(659.25, 'sine', 0.1), 200); // E5
  }
};

// Voice Narration System using pre-rendered MP3s
const audioCache = {};
const audioIds = [
  'intro', 'wonder', 'story_1', 'story_2', 'story_3', 'story_4', 'story_5',
  'station_1', 'station_2', 'station_3', 'station_4', 'correct', 'wrong', 'play_intro', 'reflect'
];

// Preload into cache immediately
audioIds.forEach(id => {
  const a = new Audio(`/assets/audio/${id}.mp3`);
  a.preload = 'auto';
  audioCache[id] = a;
});

export function setMuted(muted) {
  isMuted = muted;
  if (muted && currentVoice) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
  }
}

export function isAudioMuted() {
  return isMuted;
}

export function stopNarration() {
  if (currentVoice) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
    currentVoice = null;
  }
}

export function playNarration(id) {
  stopNarration();
  if (isMuted) return;
  
  const audio = audioCache[id];
  if (audio) {
    audio.currentTime = 0;
    currentVoice = audio;
    audio.play().catch(e => console.warn("Audio play blocked/failed:", e));
  }
}
