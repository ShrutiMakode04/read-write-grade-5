# Technical Requirements Document (TRD)

## Reading & Writing Large Numbers — Whole Numbers up to 10 Million | Grade 5 Math
### Intellia SG | Singapore Primary Mathematics Curriculum (MOE) — Global Edition

| | |
|---|---|
| **Document Version** | 1.0 |
| **Date** | July 2026 |
| **Companion Document** | `reading-writing-large-numbers-prd.md` |
| **Reference UI (strict mirror)** | https://equal-tau.vercel.app/ |
| **Reference Repo (strict mirror)** | https://github.com/dsamyak/equal |

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, simulation logic, gamification implementation, audio pipeline, and quality standards for **"Reading & Writing Large Numbers"** (Lesson 1.1) within Intellia SG's Grade 5 Math program.

Everything in this TRD was produced by **reverse-engineering the actual, currently-shipping source code** at `github.com/dsamyak/equal` (cloned and inspected directly — not guessed from its own planning documents, which in places had already drifted from what actually shipped). Where the reference project's own PRD/TRD text disagreed with its real code, this document follows the **real code**, because that is the thing you asked us to strictly match. Every place that happens is called out explicitly with a *"Source note"* box.

The module is a **React 18 application (Vite + JSX)**, structured to match the reference repository's real (not aspirational) file layout, and styled using the reference's actual CSS custom-property design system, extracted verbatim from `src/index.css`. It will be embeddable in WordPress at:

```
https://intelliasg.com/courses/grade-5-math/lessons/reading-writing-large-numbers/
```

---

## 2. Technology Stack

| Layer | Technology | Source note |
|---|---|---|
| UI Framework | React 18.3.x (JSX, Vite 6) | Exact versions pinned in reference `package.json`: `react@^18.3.1`, `vite@^6.0.0` |
| State Management | `useState` + `useCallback` in a root `App.jsx` | **Source note:** the reference TRD text describes an elaborate `useReducer` with 15+ action types, but the real shipping `App.jsx` uses plain `useState('intro')` for phase, `useState(true)` for audio, `useState(null)` for play stats — nothing more. We mirror the *real, simpler* pattern (§4) and note `useReducer` only as an optional scaling path if a future lesson needs it. |
| Styling | Hand-written CSS with CSS custom properties (`src/index.css`) | **No Tailwind, no CSS Modules** in the real `package.json`/`src` tree, despite being mentioned in the reference's own aspirational TRD. One global stylesheet, ~390 lines, is the actual approach — replicated here. |
| Icons | `lucide-react` | Pinned `^1.16.0` in the real `package.json` |
| Animation | CSS `@keyframes` + transitions only | No animation library in the dependency tree |
| SVG / Diagrams | Inline SVG in JSX | For the place-value disc mat, number-line runway, and world-map path |
| Persistence (production) | `localStorage`, 24-hour resume window | Present in the reference's design; **not used in the accompanying HTML prototype artifact**, which keeps all state in memory only, per artifact platform constraints |
| Audio (primary) | ElevenLabs REST API via `/api/elevenlabs` serverless proxy, with client-side fallback | Verified against the real `api/elevenlabs.js` and `src/utils/audio.js` |
| Audio (playback) | HTML5 `Audio` API | No audio library |
| Audio (SFX) | Web Audio API oscillator tones | Matches real `sounds` export in `src/utils/audio.js` |
| Math / RNG | Vanilla JS (`Math.random`, Fisher–Yates) | No library required |
| Build Tool | Vite 6 | `vite.config.js` present in reference, same here |
| Deployment | Vercel (static build) + WordPress iframe embed | Matches reference `api/` directory convention (Vercel serverless functions) |

---

## 3. Project Structure

The reference repo's **real** `src/components/` folder is flat — six phase components plus two shared components — not the deeply-nested `phases/ simulations/ quiz/ gamification/ shared/` tree its own TRD text describes. We mirror the real, flat pattern and extend it only where new content genuinely requires a new file:

```
reading-writing-large-numbers/
├── public/
│   └── assets/
│       ├── audio/                       # Pre-generated ElevenLabs .mp3 (build-time)
│       │   ├── audio_wonder_hook_0.mp3
│       │   ├── audio_story_panel1_0.mp3
│       │   ├── audio_story_panel2_0.mp3
│       │   ├── audio_story_panel3_0.mp3
│       │   ├── audio_story_panel4_0.mp3
│       │   ├── audio_story_panel5_0.mp3
│       │   ├── audio_story_panel6_0.mp3
│       │   ├── audio_station_a_instruction_0.mp3
│       │   ├── audio_station_b_instruction_0.mp3
│       │   ├── audio_station_c_instruction_0.mp3
│       │   ├── audio_rounding_runway_instruction_0.mp3
│       │   ├── audio_correct_0.mp3
│       │   ├── audio_reflect_prompt_0.mp3
│       │   └── … (all phase phrases pre-generated, see §11.3)
│       └── images/
│           ├── mascot-idle.svg / mascot-happy.svg / mascot-thinking.svg / mascot-celebrate.svg
│           ├── world-map-bg.svg
│           └── flags/ (10 small country/region icons for the World Map)
├── src/
│   ├── main.jsx                          # React entry point
│   ├── App.jsx                           # Root component — phase switch (useState), matches real pattern
│   ├── index.css                         # Global styles — design tokens extended in §13
│   ├── components/
│   │   ├── FloatingNumbers.jsx           # Ambient background digits (renamed from FloatingNumbers, same idea)
│   │   ├── IntroScreen.jsx               # Welcome + phase dot tracker
│   │   ├── WonderPhase.jsx               # Phase 1 hook
│   │   ├── StoryPhase.jsx                # Phase 2, 6-panel "Great Number Expedition"
│   │   ├── SimulatePhase.jsx             # Phase 3 wrapper — renders the 4 stations below
│   │   ├── PlayPhase.jsx                 # Phase 4 — IntelliPlay™ quiz engine + World Map
│   │   ├── ReflectPhase.jsx              # Phase 5 — journal + certificate
│   │   ├── QuestionRenderer.jsx          # Polymorphic dispatcher → Q1..Q10 view
│   │   ├── PlaceValueChart.jsx           # Reusable SVG: 7-column chart w/ disc rendering (new — plays the role EqualGroupDiagram.jsx played in the reference)
│   │   ├── DiscExchangeStation.jsx       # Station A (Concrete)
│   │   ├── WorldNumberMatch.jsx          # Station B (Pictorial)
│   │   ├── WordBuilderStation.jsx        # Station C (Abstract)
│   │   ├── RoundingRunway.jsx            # Signature bonus station (new, unique to this lesson)
│   │   ├── NumerationToggle.jsx          # International ⇄ Indian system switch (new, unique to this lesson)
│   │   └── WorldMap.jsx                  # 10-world horizontal progress path
│   ├── utils/
│   │   ├── audio.js                      # ElevenLabs + tone-SFX engine — ported 1:1 from reference (§11)
│   │   ├── audioMap.js                   # AUTO-GENERATED text → .mp3 path map
│   │   ├── narration.js                  # `say/ask/cheer/emphasize/think/celebrate/instruct` script builders
│   │   ├── numberWords.js                # Numeral ⇄ words engine, both numeration systems (§6)
│   │   ├── questionBank.js               # 10 generator functions + shuffle + distractors (§5)
│   │   └── scoring.js                    # XP / stars / badge condition functions (§12)
│   └── data/
│       └── worldContent.js               # 10 world/country flavour objects + 15-name global cast (§5.4)
├── scripts/
│   ├── generate_audio.js                 # Offline ElevenLabs pre-generation
│   └── clean_audio.js                    # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                     # Server-side ElevenLabs proxy — ported 1:1 from reference
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

**Source note:** the reference's own aspirational TRD proposes a `useReducer` with a 15-entry `ACTIONS` enum. The reference's **actual, live** `App.jsx` does none of that — it is six `useState` calls and a handful of `useCallback` handlers. We follow the real pattern below, because "strictly mirror the reference" means matching what is actually deployed.

### 4.1 Root Component (`App.jsx` — mirrors the real file almost line for line)

```jsx
import { useState, useCallback, useEffect } from 'react';
import { stopNarration } from './utils/audio';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';

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
  const [numeration, setNumeration] = useState('international'); // 'international' | 'indian'

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => { if (prev) stopNarration(); return !prev; });
  }, []);

  const goHome = useCallback(() => { stopNarration(); setPhase('intro'); setPlayStats(null); }, []);
  const restart = useCallback(() => { stopNarration(); setPhase('wonder'); setPlayStats(null); }, []);

  useEffect(() => () => stopNarration(), []);

  const phaseIndex = PHASES.indexOf(phase);
  const showJourney = phase !== 'intro';

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">
        <button className="audio-toggle-btn" onClick={toggleAudio}>{audioEnabled ? '🔊' : '🔇'}</button>
        {showJourney && <button className="home-btn" onClick={goHome}>🏠 Home</button>}
        {showJourney && (
          <div className="journey-bar">
            {JOURNEY_ITEMS.map((item, i) => {
              const stepPhaseIndex = i + 1;
              const isActive = phaseIndex === stepPhaseIndex;
              const isCompleted = phaseIndex > stepPhaseIndex;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
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
```

### 4.2 Per-Phase Local State

Each phase component owns its own local `useState` (story panel index, current simulation station, current question index, etc.) rather than lifting everything into a global store — again, matching the real reference implementation rather than the more centralised design its own planning docs describe. This keeps each phase file self-contained and easy to reason about in isolation, which is the same trade-off the reference project made.

### 4.3 Session Persistence (Production Only)

```js
const SESSION_KEY = 'intellia_g5_large_numbers_v1';

// On mount: restore if saved within the last 24 hours
const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (saved && Date.now() - saved.timestamp < 86400000) {
  // rehydrate phase, xp, streak, badges, worldScores, numeration preference
}

// On relevant state change: persist
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ phase, xp, streak, badges, worldScores, numeration, timestamp: Date.now() }));
}, [phase, xp, streak, badges, worldScores, numeration]);
```

> **Artifact note:** the accompanying interactive prototype (`large-numbers-expedition-simulation.html`) intentionally omits `localStorage` — all state lives in in-memory JS variables for the session only — because persistent browser storage is unsupported in the artifact preview environment. This section describes the production Vite/Vercel build only.

---

## 5. Question Data Model & Procedural Generators

**Source note:** the reference's own aspirational TRD describes a static bank of "100 pre-written question objects." The reference's **real** `src/utils/questionBank.js` does something better: 10 generator *functions*, each called with a difficulty argument, that build a brand-new randomised question object *every time they're called* — numbers, names, objects, and emoji are all re-rolled. We adopt this exact pattern, because it is what genuinely satisfies "every question should be random."

### 5.1 Question Schema

```ts
interface Question {
  id: string;                 // e.g. "Q3_014"
  type: QuestionType;         // one of 10 enum values
  world: number;               // 0–9, assigned after shuffle (see 5.3)
  difficulty: 1 | 2 | 3;       // 1=easy(≤999,999) 2=medium(1M–4.99M) 3=hard(5M–9,999,999)

  // Core value(s) this question is built around
  value: number;                // primary target number
  compareValue?: number;        // for Q6/Q7 (comparison/ordering)
  roundTo?: number;              // for Q8 (place value to round to, e.g. 100000)
  missingDigitPlace?: string;    // for Q5 (which expanded-form term is blanked)

  // Rendering
  questionText: string;          // full narrated question text
  visual: 'placeValueChart' | 'numberLine' | 'wordTiles' | 'plain';
  numerationSystem: 'international' | 'indian';

  // Word-problem-only
  characterName?: string;
  characterContext?: string;     // e.g. "Tokyo, Japan"

  // MCQ
  options?: (number | string)[]; // always includes the correct answer, 4 total

  hint1: string;
  hint2: string;
  explanation: string;
  correctAnswer: number | string;
}

type QuestionType =
  | 'read_numeral'        // Q1
  | 'write_numeral'       // Q2
  | 'place_value_id'      // Q3
  | 'expanded_to_std'     // Q4
  | 'std_to_expanded'     // Q5
  | 'compare'             // Q6
  | 'order'               // Q7
  | 'round'               // Q8
  | 'word_problem'        // Q9
  | 'true_false';         // Q10
```

### 5.2 Number Generator by Difficulty

```js
function genNumber(diff) {
  const ranges = { 1: [10000, 999999], 2: [1000000, 4999999], 3: [5000000, 9999999] };
  const [min, max] = ranges[diff];
  return Math.floor(min + Math.random() * (max - min));
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
```

### 5.3 Fisher–Yates Shuffle & Session Assembly (ported 1:1 from the reference's real `shuffleArray`/`generateSessionQuestions`)

```js
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const generators = [genQ1, genQ2, genQ3, genQ4, genQ5, genQ6, genQ7, genQ8, genQ9, genQ10];
const diffDist = {
  q1: [1,1,1,1,1,2,2,2,3,3],  q2: [1,1,1,1,1,2,2,2,3,3],
  q3: [1,1,1,1,2,2,2,2,3,3],  q4: [1,1,1,2,2,2,2,3,3,3],
  q5: [1,1,1,2,2,2,2,3,3,3],  q6: [1,1,1,2,2,2,2,3,3,3],
  q7: [1,1,1,2,2,2,2,3,3,3],  q8: [1,1,1,1,1,2,2,2,3,3],
  q9: [1,1,1,1,2,2,2,2,3,3],  q10:[1,1,1,2,2,2,2,3,3,3],
};

export function generateSessionQuestions() {
  const bank = [];
  let qid = 1;
  const qKeys = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'];
  generators.forEach((gen, gi) => {
    diffDist[qKeys[gi]].forEach(diff => {
      bank.push(gen(`Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff));
      qid++;
    });
  });
  const selected = shuffleArray(bank);
  selected.forEach((q, index) => { q.world = Math.floor(index / 10); });
  return selected;
}
```

Because `generateSessionQuestions()` is called fresh every time the Play phase mounts, and every `genQ*` function re-rolls its own random number/name/context on every call, **no two sessions — and no two worlds within a session — are ever guaranteed identical**, satisfying the randomisation requirement in PRD §8.3.

### 5.4 Sample Generator Functions

```js
import { numberToWords } from './numberWords';
import { globalCast } from '../data/worldContent';

// Q1 — Read the numeral, choose the correct word form
function genQ1(id, diff) {
  const value = genNumber(diff);
  const correct = numberToWords(value);
  const distractors = shuffleArray([
    numberToWords(value + pick([10, 100, 1000, 10000])),
    numberToWords(swapAdjacentDigits(value)),
    numberToWords(value - pick([10, 100, 1000, 10000])),
  ]);
  return {
    id, type: 'read_numeral', difficulty: diff, world: 0, value,
    questionText: `How do you read ${value.toLocaleString()} in words?`,
    visual: 'plain', numerationSystem: 'international',
    options: shuffleArray([correct, ...distractors]),
    hint1: 'Group the digits in 3s from the right, then name each group.',
    hint2: `The last group is the ones. Before that comes thousands, then millions.`,
    explanation: `${value.toLocaleString()} is written "${correct}."`,
    correctAnswer: correct,
  };
}

// Q3 — Place value identification
function genQ3(id, diff) {
  const value = genNumber(diff);
  const digits = String(value).split('').reverse(); // index 0 = ones
  const placeNames = ['ones','tens','hundreds','thousands','ten-thousands','hundred-thousands','millions'];
  const nonZeroIdx = digits.map((d, i) => ({ d: Number(d), i })).filter(o => o.d !== 0);
  const target = pick(nonZeroIdx);
  const placeValue = target.d * Math.pow(10, target.i);
  return {
    id, type: 'place_value_id', difficulty: diff, world: 0, value,
    questionText: `In ${value.toLocaleString()}, what is the value of the digit ${target.d} in the ${placeNames[target.i]} place?`,
    visual: 'placeValueChart', numerationSystem: 'international',
    options: generateDistractors(placeValue, 0, 10000000),
    hint1: `Find the digit ${target.d} in the ${placeNames[target.i]} column of the place-value chart.`,
    hint2: `A digit's value = the digit × its place (${placeNames[target.i]}).`,
    explanation: `The ${target.d} is in the ${placeNames[target.i]} place, so its value is ${placeValue.toLocaleString()}.`,
    correctAnswer: placeValue,
  };
}

// Q9 — Global word problem (comparison sense)
function genQ9(id, diff) {
  const a = genNumber(diff), b = a + pick([1000, 5000, 20000, 100000]) * pick([1, -1]);
  const [p1, p2] = shuffleArray(globalCast).slice(0, 2);
  const bigger = a > b ? p1 : p2;
  const diffVal = Math.abs(a - b);
  return {
    id, type: 'word_problem', difficulty: diff, world: 0, value: Math.max(a, b),
    characterName: `${p1.name} & ${p2.name}`, characterContext: `${p1.context} / ${p2.context}`,
    questionText: `${p1.name}'s city (${p1.context}) has ${a.toLocaleString()} people. ${p2.name}'s city (${p2.context}) has ${b.toLocaleString()} people. Whose city is bigger, and by how many?`,
    visual: 'plain', numerationSystem: 'international',
    options: generateDistractors(diffVal, 0, 10000000),
    hint1: `Line up the digits by place value before comparing.`,
    hint2: `Subtract the smaller number from the larger number.`,
    explanation: `${bigger.name}'s city is bigger by ${diffVal.toLocaleString()}.`,
    correctAnswer: diffVal,
  };
}
```

*(Q2, Q4, Q5, Q6, Q7, Q8, Q10 follow the identical pattern — parametrised template + `Math.random()` + pre-written hint/explanation templates — and are included in full in the shipped `questionBank.js`.)*

### 5.5 MCQ Distractor Generation (ported 1:1 from the reference)

```js
export function generateDistractors(correct, min = 0, max = 10000000, count = 3) {
  const distractors = new Set();
  const offsets = [-100000, -10000, -1000, 1000, 10000, 100000];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d >= min && d <= max && d !== correct && distractors.size < count) distractors.add(d);
  });
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1) * 1000;
    if (d <= max && d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...distractors]);
}
```

---

## 6. Number-to-Words / Numeration Engine

This is the single most important module in the codebase — it *is* the skill being taught — so it ships with the unit tests in §6.3 run against it before merge.

### 6.1 International System (verified — see §6.3 for test output)

```js
const ONES = ['', 'one','two','three','four','five','six','seven','eight','nine'];
const TEENS = ['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

function twoDigitToWords(n) {
  if (n === 0) return '';
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10), o = n % 10;
  return TENS[t] + (o ? '-' + ONES[o] : '');
}
function threeDigitToWords(n) {
  const h = Math.floor(n / 100), rest = n % 100;
  const parts = [];
  if (h) parts.push(ONES[h] + ' hundred');
  if (rest) parts.push(twoDigitToWords(rest));
  return parts.join(' ');
}

// Formal curriculum convention: NO "and" between groups — reserved for decimals
// (e.g. "3.5" = "three AND five tenths"). This is called out explicitly in the
// PRD's vocabulary section as a deliberate teaching point, not an oversight.
export function numberToWords(n) {
  if (n === 0) return 'zero';
  const millions = Math.floor(n / 1000000);
  const thousands = Math.floor((n % 1000000) / 1000);
  const ones = n % 1000;
  const parts = [];
  if (millions) parts.push(threeDigitToWords(millions) + ' million');
  if (thousands) parts.push(threeDigitToWords(thousands) + ' thousand');
  if (ones) parts.push(threeDigitToWords(ones));
  return parts.join(' ').trim();
}
```

### 6.2 Indian System (lakh / crore) — for the Numeration System Toggle

```js
export function toIndianGrouping(n) {
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  const groups = [];
  while (rest.length > 2) { groups.unshift(rest.slice(-2)); rest = rest.slice(0, -2); }
  if (rest.length) groups.unshift(rest);
  return groups.join(',') + ',' + last3;
}

export function numberToWordsIndian(n) {
  if (n === 0) return 'zero';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const ones = n % 1000;
  const parts = [];
  if (crore) parts.push(threeDigitToWords(crore) + ' crore');
  if (lakh) parts.push(twoDigitToWords(lakh) + ' lakh');
  if (thousand) parts.push(twoDigitToWords(thousand) + ' thousand');
  if (ones) parts.push(threeDigitToWords(ones));
  return parts.join(' ').trim();
}

export function toExpandedForm(n) {
  return String(n).split('').reverse()
    .map((d, i) => Number(d) * Math.pow(10, i))
    .filter(v => v !== 0)
    .reverse();
}
```

### 6.3 Verification (run in Node before this module ships)

The engine above was executed against 20 hand-picked edge cases (exact millions, exact hundred-thousands, embedded zeros, the 10,000,000 ceiling, single digits) during the build of this TRD. Sample output:

```
6,420,315 → "six million four hundred twenty thousand three hundred fifteen"
9,999,999 → "nine million nine hundred ninety-nine thousand nine hundred ninety-nine"
1,000,001 → "one million one"
10,000,000 → "ten million"                       |  Indian: "one crore"
7,000,000 → Indian grouping "70,00,000"           |  "seventy lakh"
1,234,567 → Indian grouping "12,34,567"           |  "twelve lakh thirty-four thousand five hundred sixty-seven"
```

All outputs matched expected formal number-name conventions with no "and"-insertion errors and no off-by-one place-value errors. **QA must re-run this suite (or the equivalent Jest test file) on every change to `numberWords.js`** — a silent regression here would teach the core skill incorrectly.

---

## 7. Station A — Disc Exchange Station (Concrete) — Component Spec

```jsx
// DiscExchangeStation.jsx (props: targetValue, onComplete, audioEnabled)
const DISC_VALUES = [1, 10, 100, 1000, 10000, 100000, 1000000];
const COLUMN_LABELS = ['Ones','Tens','Hundreds','Thousands','Ten-Thousands','Hundred-Thousands','Millions'];

// mat state: { [discValue]: countPlaced }
// exchange rule: whenever mat[v] >= 10, prompt "Trade 10 × {v} for 1 × {v*10}?"
function checkExchange(mat, discValue) {
  return mat[discValue] >= 10 && discValue * 10 <= 1000000;
}
function currentTotal(mat) {
  return DISC_VALUES.reduce((sum, v) => sum + (mat[v] || 0) * v, 0);
}
```

Interaction contract: `onDrop(discValue, columnIndex)` appends to `mat[discValue]`; if `checkExchange` fires, show the trade modal before accepting further drops. On "Check my number," compare `currentTotal(mat)` to `targetValue`; correct → `onComplete()`; incorrect → shake + `hint1`. Tap-to-place fallback: tap a disc in the tray (selects it), then tap a column (places it) — required for non-drag/assistive input per PRD §11.3.

---

## 8. Station B — World Number Match (Pictorial) — Component Spec

```jsx
// WorldNumberMatch.jsx
// Build a 12-card deck from 4 target numbers × 3 representations each
function buildDeck(targets) {
  const cards = [];
  targets.forEach((value, i) => {
    cards.push({ id: `${i}-numeral`, matchId: i, display: value.toLocaleString(), kind: 'numeral' });
    cards.push({ id: `${i}-words`,   matchId: i, display: numberToWords(value), kind: 'words' });
    cards.push({ id: `${i}-expanded`,matchId: i, display: toExpandedForm(value).join(' + ').replace(/(\d)(?=(\d{3})+$)/g,'$1'), kind: 'expanded' });
  });
  return shuffleArray(cards);
}
```

Distractor rule (matches the reference's "differs by one place value" philosophy): the 4 `targets` are generated so that at least one pair differs by a single swapped digit (e.g. `6,420,315` vs `6,402,315`), forcing careful place-value reading rather than pattern-matching on card position.

---

## 9. Station C — Word-Builder Machine (Abstract) — Component Spec

```jsx
// WordBuilderStation.jsx (props: targetValue, direction: 'toWords' | 'toNumeral' | 'toExpanded')
function buildWordBank(targetValue) {
  const correctTiles = numberToWords(targetValue).split(' ');
  const decoys = shuffleArray(['and','times','over','plus']).slice(0, 2);
  return shuffleArray([...correctTiles, ...decoys]);
}
// Student assembles tiles into an ordered slot row; submit compares the
// joined slot content (trimmed, lower-cased) to numberToWords(targetValue).
```

`direction: 'toNumeral'` swaps the word-tile bank for the shared `NumberPad` component (0–9 digit buttons); `direction: 'toExpanded'` pre-fills all-but-one addend and asks for the missing term (mirrors PRD §7.3, Q5).

---

## 10. Signature Bonus — Rounding Runway — Component Spec

```jsx
// RoundingRunway.jsx (props: startValue, roundTo, onComplete)
function nearestPosts(value, roundTo) {
  const lower = Math.floor(value / roundTo) * roundTo;
  const upper = lower + roundTo;
  return { lower, upper, nearest: (value - lower <= upper - value) ? lower : upper };
}
// Drag handler maps pointer X → a value along the scaled runway (linear
// interpolation between the runway's min/max props). On release, snap to the
// closer of nearestPosts(value, roundTo).lower/upper if within a snap-radius;
// compare the snapped post to nearestPosts(...).nearest for correctness.
```

Visual scale is computed per round from `roundTo` (e.g. a "round to nearest 100,000" round zooms the runway to a ±1,000,000 window around `startValue` so the two candidate posts are comfortably far apart on screen).

---

## 11. Audio Pipeline (ElevenLabs — ported 1:1 from the reference's real code)

### 11.1 Voice Configuration

```
Voice Name:  Alice
Voice ID:    Xb7hH8MSUJpSbSDYk0k2
Model:       eleven_multilingual_v2
API Key Var: VITE_ELEVENLABS_API_KEY (server-side, read in api/elevenlabs.js)
```

### 11.2 Style Settings (exact values — extracted from the real `getElevenLabsSettings()`, not the reference's own aspirational doc, which quotes different numbers)

```js
const getElevenLabsSettings = (speechStyle) => {
  switch (speechStyle) {
    case 'celebration':   return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
    case 'question':      return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':      return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking':      return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
    default:               return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }; // statement/instruction
  }
};
```

### 11.3 Client Engine (`src/utils/audio.js` — ported 1:1, phrase list swapped for this lesson's content)

```js
const elevenLabsCache = new Map();
const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';

export async function getAudioUrl(text, style) {
  if (audioMap[text]) return audioMap[text];
  const cacheKey = `${text}_${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  const fetchPromise = (async () => {
    const localApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceSettings = getElevenLabsSettings(style);
    let response = await fetch('/api/elevenlabs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId: ELEVENLABS_VOICE_ID, voiceSettings }),
    });
    const isHtmlFallback = (response.headers.get('content-type') || '').includes('text/html');
    if ((!response.ok || isHtmlFallback) && localApiKey) {
      response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': localApiKey },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: voiceSettings }),
      });
    }
    if (!response.ok || isHtmlFallback) throw new Error('Audio fetch failed on both paths');
    return URL.createObjectURL(await response.blob());
  })();

  elevenLabsCache.set(cacheKey, fetchPromise);
  fetchPromise.catch(() => elevenLabsCache.delete(cacheKey));
  return fetchPromise;
}

export function narrate(segments, enabled = true) { /* sequential playback + look-ahead preload — identical to reference */ }
export function stopNarration() { /* cancels in-flight queue + pauses current Audio() */ }

export const say = (text, pause = 0) => ({ text, style: 'statement', pause });
export const ask = (text, pause = 0) => ({ text, style: 'question', pause });
export const cheer = (text, pause = 0) => ({ text, style: 'encouragement', pause });
export const celebrate = (text, pause = 0) => ({ text, style: 'celebration', pause });
```

### 11.4 Server Proxy (`api/elevenlabs.js` — ported 1:1 from the reference)

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  const { text, voiceId, voiceSettings } = req.body;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: voiceSettings }),
  });
  if (!response.ok) return res.status(response.status).json({ error: await response.text() });
  res.setHeader('Content-Type', 'audio/mpeg');
  res.send(Buffer.from(await response.arrayBuffer()));
}
```

### 11.5 Non-Voice SFX (Web Audio tones — ported 1:1)

```js
export const sounds = {
  correct: () => { playTone(523,150); setTimeout(()=>playTone(659,150),150); setTimeout(()=>playTone(784,200),300); },
  wrong:   () => playTone(220, 300),
  badge:   () => [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,200), i*150)),
  click:   () => playTone(440, 80),
  streak:  () => { playTone(880,100); setTimeout(()=>playTone(1100,150),100); },
};
```

### 11.6 1:1 Narration Parity Rule

Identical policy to the reference: every narrated string must match its on-screen text exactly. A lint script (`scripts/check_narration_parity.js`) can diff `narration.js` strings against JSX text nodes at build time to catch drift automatically — recommended addition beyond what the reference currently does.

---

## 12. Gamification Implementation

```js
// XP — identical formula to the reference
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  return base + (streak >= 5 ? 5 : 0);
}

// Stars per 10-question world — identical thresholds to the reference
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}
export function canUnlockWorld(worldScore) { return worldScore !== null && worldScore >= 5; }

export const BADGES = [
  { id: 'digit_explorer',       label: '🏅 Digit Explorer',       condition: s => s.phaseComplete.wonder && s.phaseComplete.story },
  { id: 'place_value_builder',  label: '🥈 Place-Value Builder',  condition: s => s.simStationsComplete.every(Boolean) },
  { id: 'millionaire_reader',   label: '🥇 Millionaire Reader',   condition: s => s.correctCount / s.totalAnswered >= 0.8 },
  { id: 'perfect_period',       label: '💎 Perfect Period',       condition: s => s.worldScores.some(ws => ws === 10) },
  { id: 'number_streak',        label: '🔥 Number Streak',        condition: s => s.maxStreak >= 10 },
  { id: 'full_expedition',      label: '🌟 Full Expedition',      condition: s => Object.values(s.phaseComplete).every(Boolean) },
  { id: 'sharp_eyed_comparer',  label: '🎯 Sharp-Eyed Comparer',  condition: s => s.compareStreak >= 5 },
  { id: 'globe_trotter',        label: '🌍 Globe Trotter',        condition: s => s.wordProblemCorrect >= 5 },
  { id: 'rounding_ranger',      label: '🧭 Rounding Ranger',      condition: s => s.roundingRunwayComplete },
  { id: 'numeration_navigator', label: '🔢 Numeration Navigator', condition: s => s.numerationToggleUsedCorrectly },
];
```

---

## 13. CSS Design Tokens & Animation Keyframes (extracted verbatim from the reference's real `src/index.css`)

### 13.1 Root Tokens (unchanged — strict parity requirement)

```css
:root {
  --bg-dark: #0a0a2e; --bg-card: rgba(30,30,100,0.7); --bg-card-solid: #1a1a5e;
  --purple-deep: #2d1b69; --purple-mid: #4a2c8a; --purple-light: #7c5cbf;
  --blue-deep: #1a237e; --blue-mid: #283593; --blue-bright: #3f51b5;
  --gold: #ffc107; --gold-light: #ffd54f; --gold-dark: #f9a825;
  --green: #4caf50; --green-light: #81c784; --red: #ef5350; --red-light: #ef9a9a; --coral: #ff7043;
  --white: #ffffff; --text-primary: #ffffff; --text-secondary: rgba(255,255,255,0.7); --text-muted: rgba(255,255,255,0.4);
  --font-display: 'Fredoka', sans-serif; --font-body: 'Nunito', sans-serif;
  --radius-sm: 8px; --radius-md: 16px; --radius-lg: 24px; --radius-xl: 32px; --radius-full: 9999px;
  --shadow-glow: 0 0 30px rgba(124,92,191,0.3); --shadow-card: 0 8px 32px rgba(0,0,0,0.3); --shadow-button: 0 4px 15px rgba(0,0,0,0.3);
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 13.2 New Tokens Required for This Lesson's Unique Components

```css
:root {
  --disc-ones: #ffd54f;        --disc-tens: #ffb74d;         --disc-hundreds: #ff8a65;
  --disc-thousands: #7c5cbf;   --disc-ten-thousands: #5c6bc0; --disc-hundred-thousands: #3f51b5;
  --disc-millions: #f9a825;
  --runway-track: rgba(255,255,255,0.08);
  --runway-post: var(--gold);
  --lakh-crore-accent: #26a69a;  /* distinguishes the Indian-system toggle state */
}
```

### 13.3 Fonts (unchanged from reference `index.html`)

```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
```

### 13.4 Reused Component Classes (unchanged)

`.glass-card` `.btn` `.btn-primary/.btn-secondary/.btn-green/.btn-outline` `.progress-dots` `.progress-bar-*` `.hud` `.question-card` `.options-grid` `.option-btn(.selected/.correct/.wrong)` `.mascot(.happy/.thinking)` `.speech-bubble` `.feature-cards` `.feedback-overlay` `.xp-popup` `.score-circle` `.journey-bar/.journey-step/.journey-connector` — all reused verbatim; no renaming, so the two lessons can even share a compiled CSS bundle if desired.

### 13.5 New Keyframes

```css
@keyframes discSnap   { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
@keyframes discTrade  { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; } 100% { transform: translateY(-40px) scale(0); opacity: 0; } }
@keyframes balloonDrift { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
@keyframes postGlow   { 0%,100% { box-shadow: 0 0 8px var(--gold); } 50% { box-shadow: 0 0 20px var(--gold); } }
```

---

## 14. Component Prop Contracts (selected)

```ts
DiscExchangeStation: { targetValue: number; onComplete: () => void; audioEnabled: boolean }
WorldNumberMatch:    { targets: number[]; onComplete: () => void; audioEnabled: boolean }
WordBuilderStation:  { targetValue: number; direction: 'toWords'|'toNumeral'|'toExpanded'; onComplete: () => void }
RoundingRunway:      { startValue: number; roundTo: number; onComplete: (correct: boolean) => void }
NumerationToggle:    { value: 'international'|'indian'; onChange: (v: string) => void }
QuestionRenderer:    { question: Question; onAnswer: (isCorrect: boolean) => void; numeration: string }
WorldMap:            { worldScores: (number|null)[]; currentWorld: number; onSelectWorld: (i: number) => void }
```

---

## 15. Performance Requirements

- Initial load (Vite production build): **< 3 seconds** on a mid-range tablet over 4G
- Question transition: **< 100ms** perceived latency (all generation is synchronous local computation — no network round-trip per question)
- Audio clip fetch (dynamic, cache-miss path): show a subtle "…" mascot-thinking state; never block the UI thread
- Bundle budget: keep `lucide-react` icon imports tree-shaken (import only the icons used, not the barrel file)

---

## 16. Browser & Device Support

| Tier | Target |
|---|---|
| Primary | iPad / Android tablet (768px+), Safari/Chrome current − 2 versions |
| Secondary | Desktop Chrome, Firefox, Edge, Safari, current − 2 versions |
| Tertiary | Mobile phones (375px+), single-column layout |
| Not supported | Internet Explorer (any version) |

---

## 17. Accessibility Implementation

- All draggable elements (discs, balloon, word-tiles) implement `onKeyDown`/`tabIndex` tap-tap alternates, per PRD §11.3
- `aria-live="polite"` region announces the running numeral/word-form readout as discs are placed (Station A) so screen-reader users get equivalent real-time feedback
- Colour is never the sole signal: correct/incorrect states pair colour with an icon (✓ / ✗) and a shape change
- Respects `prefers-reduced-motion`: disc/balloon animations shorten to instant snaps when the OS setting is on

---

## 18. Deployment

### 18.1 Build & Host

- `npm run build` → static Vite bundle → deploy to Vercel (same platform as the reference)
- `api/elevenlabs.js` deploys automatically as a Vercel serverless function
- Environment variable `VITE_ELEVENLABS_API_KEY` set in the Vercel project, never committed

### 18.2 WordPress Embedding (Intellia SG)

```html
<iframe
  src="https://reading-writing-large-numbers.vercel.app/"
  style="width:100%; height:100vh; border:0;"
  title="Reading & Writing Large Numbers — Grade 5 Math"
  loading="lazy">
</iframe>
```

Matches the reference lesson's embedding convention on `intelliasg.com/courses/grade-5-math/lessons/reading-writing-large-numbers/`.

---

## 19. Quality Assurance Checklist

| Check | Status |
|---|---|
| `numberWords.js` unit-test suite passes (20+ edge cases, §6.3) | ✅ Required |
| All 100 questions generate with correct math (value === sum of expanded terms) | ✅ Required |
| No duplicate question order across 10 consecutive session generations (spot-check) | ✅ Required |
| All 3 core stations + Rounding Runway completable via keyboard only | ✅ Required |
| Numeration toggle produces mathematically consistent output in both systems | ✅ Required |
| ElevenLabs narration plays for every phase; silent, non-blocking skip if API key absent | ✅ Required |
| WCAG AA contrast check on `.option-btn`, `.journey-step-label`, `.hint-text` | ✅ Required |
| Responsive check at 375px / 768px / 1024px+ | ✅ Required |
| Certificate/summary numbers reconcile with actual XP/star/badge state | ✅ Required |
| UI diff against equal-tau.vercel.app shows no unintended token drift | ✅ Required |

---

## 20. Appendix — Source Verification Notes

This TRD was written after directly cloning `github.com/dsamyak/equal` into a sandbox and inspecting, in order: `package.json`, `src/index.css`, `index.html`, `src/App.jsx`, `src/components/` (directory listing), `src/utils/audio.js`, `api/elevenlabs.js`, `src/utils/questionBank.js`, and the reference project's own `..._prd.txt` / `..._trd.txt`. Every numeric constant quoted in this document (CSS hex values, ElevenLabs `stability`/`similarity_boost`/`style` settings, XP/star formulas, Fisher–Yates implementation) was copied from the **real source**, not paraphrased from memory — with explicit "Source note" call-outs anywhere the reference's own planning documents had drifted from what is actually shipping, so the engineering team knows exactly which parts are load-bearing precedent versus new design for this lesson.

---

*Document Version 1.0 | July 2026 | Intellia SG — Grade 5 Math, Lesson 1.1*
