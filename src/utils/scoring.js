export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  return base + (streak >= 5 ? 5 : 0);
}

export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 6;
}

export const BADGES = [
  { id: 'digit_explorer',       label: '🏅 Digit Explorer',       condition: s => s.phaseComplete.wonder && s.phaseComplete.story },
  { id: 'place_value_builder',  label: '🥈 Place-Value Builder',  condition: s => s.simStationsComplete.every(Boolean) },
  { id: 'millionaire_reader',   label: '🥇 Millionaire Reader',   condition: s => s.totalAnswered > 0 && (s.correctCount / s.totalAnswered) >= 0.8 },
  { id: 'perfect_period',       label: '💎 Perfect Period',       condition: s => s.worldScores.some(ws => ws === 10) },
  { id: 'number_streak',        label: '🔥 Number Streak',        condition: s => s.maxStreak >= 10 },
  { id: 'full_expedition',      label: '🌟 Full Expedition',      condition: s => Object.values(s.phaseComplete).every(Boolean) },
  { id: 'sharp_eyed_comparer',  label: '🎯 Sharp-Eyed Comparer',  condition: s => s.compareStreak >= 5 },
  { id: 'globe_trotter',        label: '🌍 Globe Trotter',        condition: s => s.wordProblemCorrect >= 5 },
  { id: 'rounding_ranger',      label: '🧭 Rounding Ranger',      condition: s => s.roundingRunwayComplete },
  { id: 'numeration_navigator', label: '🔢 Numeration Navigator', condition: s => s.numerationToggleUsedCorrectly },
];
