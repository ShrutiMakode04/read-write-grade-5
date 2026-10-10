# Product Requirements Document (PRD)

## Reading & Writing Large Numbers — Whole Numbers up to 10 Million | Grade 5 Math
### Intellia SG | Singapore Primary Mathematics Curriculum (MOE) — Global Edition

| | |
|---|---|
| **Document Version** | 1.0 |
| **Date** | July 2026 |
| **Product** | Intellia SG — Grade 5 Math, Section 1, Lesson 1.1 |
| **Lesson Title** | Reading & Writing Large Numbers (Whole Numbers up to 10,000,000) |
| **Curriculum** | Singapore MOE Primary 5 Mathematics — Whole Numbers, cross‑mapped to global syllabi |
| **Reference UI (strict mirror)** | https://equal-tau.vercel.app/ |
| **Reference Repo (strict mirror)** | https://github.com/dsamyak/equal |
| **Parent Course Page** | https://intelliasg.com/courses/grade-5-math/ |
| **Lesson URL (target)** | https://intelliasg.com/courses/grade-5-math/lessons/reading-writing-large-numbers/ |
| **Status** | Draft for engineering handoff |

---

## 1. Executive Summary

This document defines product requirements for **"Reading & Writing Large Numbers"** — an interactive, gamified, simulation-based lesson module delivered as **Lesson 1.1** within Intellia SG's **Grade 5 Math** program. The module targets 10–11 year‑old learners around the world and teaches the foundational Grade 5 / Primary 5 "Whole Numbers" topic: reading, writing, building, comparing and rounding whole numbers up to **10,000,000 (ten million)**, fully aligned with the **Singapore MOE Primary Mathematics Syllabus** and cross-mapped to the equivalent stage in Common Core (US), the UK National Curriculum (KS2), Cambridge Primary, and the CBSE (India) syllabus.

The product is a standalone web page to be hosted at:

```
https://intelliasg.com/courses/grade-5-math/lessons/reading-writing-large-numbers/
```

It is built using **React (Vite + JSX, JavaScript/CSS)** and is designed to **strictly mirror** the visual language, component structure, and UX mechanics established at **https://equal-tau.vercel.app/** and its repository **https://github.com/dsamyak/equal** — the same reference already used to build the Grade 1 "Equal Groups" lesson, keeping the entire Intellia SG catalogue visually and architecturally consistent.

Audio narration uses **ElevenLabs exclusively** (Voice: *Alice*, Voice ID: `Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`), with the same style-based voice-settings pipeline already shipping in the reference repo's `src/utils/audio.js` (see §10 and the TRD for exact values). No uploaded reference audio clip was found in this workspace at the time of writing — see the note in §10.0 — so the pipeline below is reverse-engineered directly from the **live, shipping code** of the reference lesson rather than from an aspirational spec, which gives it a stronger guarantee of "strict" parity.

Unlike the Grade 1 lesson (which used a Singapore-only cast for a Singapore-only classroom context), this module is explicitly built **for students of global countries**. It reframes the same Intellia learning model around a narrative device — **"The Great Number Expedition"** — in which the LearnFlow AI mascot and a globally diverse cast of student characters (John, Sarah, Mike, Priya, Wei, Fatima, Carlos, Amara, Yuki, Omar, and others — see §12.1) travel the world encountering genuinely large numbers (city populations, landmark visitor counts, daily commuters, etc.), reading and writing them together.

The module follows Intellia's established 6-stage learner journey:

```
Stage 0 — INTRO     → Welcome screen + 5-phase progress map
Phase 1 — WONDER    → Curiosity hook
Phase 2 — STORY     → "The Great Number Expedition" narrative
Phase 3 — SIMULATE  → 3 CPA simulation stations + 1 signature bonus station
Phase 4 — PLAY      → IntelliPlay™ gamified practice (100 randomised, procedurally-generated questions)
Phase 5 — REFLECT   → Journal / LearnFlow AI prompt + completion certificate
```

---

## 2. Product Vision & Goals

**Vision** — To make reading, writing, and reasoning about large whole numbers feel like a global expedition rather than a worksheet: every learner, in any country, builds true place-value understanding up to ten million through a concrete→pictorial→abstract simulation path, procedurally-randomised practice, and a narrative cast that looks like the world's classrooms actually look.

**Goals**

| Goal | Metric |
|---|---|
| Learning Completion | ≥85% of students complete all 5 phases |
| Practice Engagement | ≥90% attempt at least 10 practice questions |
| Score Achievement | Average IntelliPlay™ score ≥75% on first attempt |
| Session Duration | Average engagement ≥18 minutes per session |
| Curriculum Alignment | 100% aligned to Singapore MOE Primary 5 (Whole Numbers, Lesson 1.1), cross-checked against Common Core, UK KS2, CBSE, Cambridge Primary |
| Phase Progression | ≥80% reach Play phase in a single session |
| Simulation Interaction Rate | ≥95% attempt all 3 core simulation stations |
| Global Representation | ≥10 countries/regions represented across names, word problems and the World Map |
| Randomisation Integrity | 0% of sessions present an identical question set/order to a prior session for the same learner |

---

## 3. Target Users

**Primary: Grade 5 / Primary 5 Students (Age 10–11)**
- Comfortable readers; ready for longer word problems and multi-step reasoning
- Still benefit from concrete manipulatives (place-value discs) before abstract drill, per CPA pedagogy
- Motivated by mastery, collection mechanics (badges, world map), and a sense of "going somewhere"
- Global audience: may be following Singapore MOE, Common Core, UK, CBSE, or IB/Cambridge curricula at home or school

**Secondary: Parents & Teachers**
- Assign as classwork, homework, or holiday enrichment
- Expect strict curriculum alignment and a visible learning-objective map
- Monitor via phase-completion indicators and the end-of-lesson certificate/summary

**Tertiary: English-Language Learners**
- The "no browser-TTS fallback, ElevenLabs-only" narration policy (see §10) means every phrase is spoken aloud in clear, natural speech — important for students whose first language is not English, which is common across a global user base

---

## 4. Curriculum Alignment — Global Grade 5 Whole Numbers

### 4.1 Primary Standard (Backbone)

```
Topic:      Whole Numbers — Reading and Writing Numbers up to 10,000,000
Programme:  Intellia SG Grade 5 Math — Section 1: Whole Numbers
Lesson URL: https://intelliasg.com/courses/grade-5-math/lessons/reading-writing-large-numbers/
```

**Source References**
- Singapore MOE Primary Mathematics Syllabus (Primary 1–6), Whole Numbers strand
  → Strand: Number and Algebra → Sub-strand: Whole Numbers
  → Primary 5 anchor: "numbers up to 10 million — reading and writing numbers in numerals and in words"
- Primary Mathematics / My Pals Are Here! Primary 5A, Chapter 1: Whole Numbers
- Targeting Mathematics Primary 5A, Chapter 1: Numbers to 10 Million

### 4.2 Cross-Mapping to Other Global Syllabi

This lesson is deliberately built so that the *same* number range and skill set serve multiple national curricula at once — a genuine "global classroom" design choice, not a re-skin:

| System | Stage | Equivalent requirement |
|---|---|---|
| Singapore MOE | Primary 5 | Numbers to 10,000,000; read/write in numerals and words |
| UK National Curriculum (KS2) | Year 6 | "Read, write, order and compare numbers up to 10,000,000" |
| Cambridge Primary | Stage 5–6 | Read/write/compare whole numbers to 1,000,000+ with place value to millions |
| US Common Core | Grade 4–5 boundary | 4.NBT.A.2 (read/write multi-digit numbers, numerals/words/expanded form); 5.NBT.A.1 (a digit represents 10× the value of the digit to its right) |
| CBSE (India) | Class 5 | "Large Numbers" chapter — Indian System (ones, thousands, lakhs, crores) *and* International System (ones, thousands, millions); **1 crore = 10,000,000**, an exact match to the Singapore/UK ceiling used here |

Because 1 crore is mathematically identical to 10 million, the single number range chosen for this lesson (0 – 10,000,000) lets the product serve the Indian-system curriculum and the International-system curricula from one shared content set — see the **Numeration System Toggle** in §12.3.

### 4.3 Learning Objectives (LO)

| # | Objective |
|---|---|
| LO1 | Read whole numbers up to 10,000,000, correctly identifying the place value of every digit (ones → millions) |
| LO2 | Write whole numbers in **numerals** from a spoken/word-form description |
| LO3 | Write whole numbers in **words** from a numeral, following formal number-name conventions |
| LO4 | Express a number in **expanded form** and reconstruct standard form from an expanded form |
| LO5 | State the place value *and* value of a specified digit within a large number |
| LO6 | Compare two or more whole numbers up to 10,000,000 using `>`, `<`, `=`, and order a set ascending/descending |
| LO7 | Round whole numbers to the nearest 10, 100, 1,000, 10,000 or 100,000 |
| LO8 | Recognise and convert between the **International system** (ones/thousands/millions) and the **Indian system** (ones/thousands/lakhs/crores) |
| LO9 | Apply LO1–LO7 to real-world, globally-contextualised word problems (populations, landmark visitors, commuters, etc.) |
| LO10 | Explain that a digit in one place is worth 10× the same digit one place to its right (place-value generalisation shared with Common Core 5.NBT.A.1) |

### 4.4 CPA Progression for This Lesson

```
Concrete   → Place-value discs (1, 10, 100, 1,000 … 1,000,000) placed on a place-value
             chart mat, with a "10-for-1 exchange" mechanic — the same manipulative
             Singapore MOE itself uses to teach this exact topic
Pictorial  → Place-value charts, comma/period grouping, numeral ↔ word-form match cards
Abstract   → Expanded-form equations, word-form sentence building, symbolic comparison
             (>, <, =)
```

### 4.5 Number Ranges & Vocabulary

**Number Ranges**
- Easy: 10,000 – 999,999 (5–6 digits)
- Medium: 1,000,000 – 4,999,999 (7 digits, low millions)
- Hard: 5,000,000 – 9,999,999 (7 digits, high millions, near the syllabus ceiling); includes reverse/multi-blank items and system-conversion items

**Vocabulary Focus**
digit, numeral, standard form, expanded form, word form, place value, face value, period (ones / thousands / millions), comma, greater than / less than, ascending / descending, round off, nearest, estimate, lakh, crore

> **Teaching rule built into the content:** formal number names do **not** use "and" between groups (e.g. *"two hundred thirty-four thousand six hundred one,"* not *"…and six hundred and one"*) — "and" is reserved for reading a decimal point, a distinction explicitly called out in the Wonder-phase vocabulary card so students carry the rule into later decimal lessons.

---

## 5. The 6-Stage Learner Journey (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  INTRO SCREEN → Progress Map (5-step visual tracker, top bar)              │
│  Welcome: "Hi Explorer! Ready to discover the world's biggest numbers? 🌍" │
│  Lesson badge shown (locked). 5 glowing phase dots visible.                │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1 — WONDER  (≈ 1–2 min)                                             │
│  Hook: "A city on the other side of the world has 9,700,000 people in     │
│  it. Can you say that number out loud? Can you write it down?"            │
│  Visual: digits fly onto the screen one at a time, then scramble           │
│  Narration (ElevenLabs, Alice): reads the hook warmly                     │
│  → LearnFlow appears, hands the learner "The Number Compass" 🧭            │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2 — STORY  (≈ 3–4 min) — "The Great Number Expedition"              │
│  6 illustrated panels; LearnFlow + a rotating global cast visit 3 places   │
│  Introduces: periods/commas, reading strategy, word form, expanded form    │
│  (full script in §6)                                                       │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3 — SIMULATE  (≈ 7–9 min)                                           │
│  Station A — Disc Exchange Station   (Concrete)                            │
│  Station B — World Number Match      (Pictorial)                          │
│  Station C — Word-Builder Machine    (Abstract)                           │
│  + Signature Bonus — The Rounding Runway (unique to this lesson, §7.4)     │
│  All 3 core stations required to advance; Rounding Runway unlocks after    │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4 — PLAY  (≈ 8–10 min)                                              │
│  IntelliPlay™ Level: 100 procedurally-generated, randomised questions      │
│  across 10 "World Map" countries. 10 Q per world; unlock at ≥6/10 correct  │
│  Stars (1–3), XP, badges, streak fire all active                          │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5 — REFLECT  (≈ 1–2 min)                                            │
│  Journal prompt: "Which country's big number surprised you most? Why?"    │
│  Lesson-complete certificate unlocks. Summary of XP, stars, badges shown   │
│  → "Share with your teacher!" export button                               │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Phase 2 — STORY Design: "The Great Number Expedition"

A single consistent narrative frame carries all six panels: LearnFlow and the learner use **the Number Compass** to visit three real places on a spinning globe, meeting a different member of the global cast at each stop. Every on-screen sentence in this section is also the exact ElevenLabs narration string (1:1 parity rule, §10.6).

| Panel | Setting | Cast | Content beat |
|---|---|---|---|
| 1 | Explorer Base (intro) | LearnFlow + Sarah (London 🇬🇧) | "Some numbers are so big, we need a whole new way to read them. Let's go find one!" — globe spins, compass glows |
| 2 | Tokyo, Japan 🇯🇵 | Yuki | "Yuki's home city has 9,700,000 people!" — digits appear ungrouped: `9700000`; comma-grouping animates into `9,700,000`; **ones/thousands/millions periods** highlight in three colours |
| 3 | Tokyo (cont.) | Yuki + LearnFlow | Reading strategy taught: "Group in 3s from the right. Name each period: nine **million**, seven hundred **thousand**." Word form assembles on screen: *"nine million seven hundred thousand"* |
| 4 | Paris, France 🇫🇷 | Sofia | "About 6,900,000 people visit the Eiffel Tower every year." Same number shown first in **words**, this time the panel challenges: "Can you write this one in numerals?" — numeral builds digit-by-digit as the learner watches |
| 5 | Mumbai, India 🇮🇳 | Priya | Same big number (6,900,000) shown a third way — **place-value chart** with column headers (Millions · Hundred-Thousands · Ten-Thousands · Thousands · Hundreds · Tens · Ones) — bridges into **expanded form**: `6,900,000 = 6,000,000 + 900,000` |
| 6 | Explorer Base (return) | LearnFlow + full cast silhouettes | Recap of the 3 forms (numeral / word / expanded) + the Indian-system aside: "In India, this same number is called *69 lakh*!" — transitions into Simulate phase |

**Key vocabulary highlighted on-screen:** *period, place value, comma, million, hundred-thousand, word form, expanded form, lakh*

---

## 7. Phase 3 — SIMULATE Design (Detailed)

All four stations share the reference site's interaction language (drag, tap-to-select, number pad) so the *feel* of this lesson is indistinguishable from the rest of the Intellia SG catalogue, while each station teaches a genuinely different representation of the same number.

### 7.1 Station A — "Disc Exchange Station" (Concrete)

Visual: a place-value chart mat with 7 labelled columns (Ones · Tens · Hundreds · Thousands · Ten-Thousands · Hundred-Thousands · Millions). A tray of colour-coded place-value discs (1, 10, 100, 1,000, 10,000, 100,000, 1,000,000) sits to the side — the same manipulative Singapore MOE itself prescribes for this exact syllabus point.

Interaction:
- Student drags discs onto the mat to build a target number spoken/written by LearnFlow
- **10-for-1 exchange mechanic**: if a column collects 10 discs of one value, a prompt appears — *"You have 10 hundred-discs! Trade them for 1 thousand-disc?"* — tapping "Trade" animates the exchange, reinforcing regrouping/place-value logic rather than rote counting
- A live readout below the mat updates the numeral, and a second readout shows the word form, as discs are placed
- Accessibility: tap-to-place + tap-destination-column fallback for non-drag input

Feedback: correct final number → mascot celebration + disc mat "locks in" with a glow; mismatched total → gentle shake on the readout with a "Check your columns" hint, no disc penalty

Variants per round (randomised): target numbers drawn from all three difficulty bands (§4.5); at least one round per session forces a 10-for-1 exchange

### 7.2 Station B — "World Number Match" (Pictorial)

Visual: a 12-card, face-down memory-match grid. Cards show one of: a numeral (`6,420,315`), a word form (*"six million four hundred twenty thousand three hundred fifteen"*), an expanded form (`6,000,000 + 400,000 + 20,000 + 300 + 15`), or a place-value chart snapshot — 3 cards per number, drawn from a pool of 4 target numbers, shuffled to a 12-card grid

Interaction:
- Tap two cards; if they represent the **same number**, both glow green and lock; if not, they flip back after a beat
- Distractor design mirrors the reference repo's rule: near-miss cards differ by a single swapped place value (e.g. `6,420,315` vs `6,402,315`) so careless place-value reading is genuinely tested, not just visual memory

Teaching goal: build fluency translating between numeral / word / expanded / chart representations of the *same* number — directly targets LO1–LO4

3 rounds of increasing size (8, 10, then 12 cards)

### 7.3 Station C — "Word-Builder Machine" (Abstract)

Visual: `_______________ = 6,420,315` with a bank of word-tiles below (*six, sixty, hundred, thousand, million, four, twenty, three, fifteen, …* — including 2–3 decoy tiles)

Interaction:
- Student drags word-tiles into the blank, in order, to build the correct word form
- A **"Show place-value chart"** hint button is always visible (scaffold, never penalised)
- On submit: correct → tiles snap into a neat sentence with a bounce animation; incorrect → the wrong tile shakes and returns to the bank

Variants (rotated per round, mirrors reference's "which blank is missing" idea, adapted to full-sentence construction):
- Numeral → words (primary direction, most rounds)
- Words → numeral, using a number pad instead of word-tiles
- Expanded form → standard numeral

ElevenLabs narrates the target number aloud before the student begins each round (tests listening + writing, not just visual copying).

### 7.4 Signature Bonus Station — "The Rounding Runway" (Unique to This Lesson)

This is the standout, purpose-built simulation requested for this topic — it does not exist in the Grade 1 reference lesson because "equal groups" has no rounding equivalent, but it is essential for whole-number magnitude sense, and it is the closest analogue to a direct-manipulation "measurement" simulation (in the spirit of a geometry measurement tool) applied to number sense instead of shapes.

Visual: a long, scaled **number-line runway** (500,000 → 10,000,000, scale adjustable by round) with clearly marked posts at round intervals. LearnFlow's hot-air balloon sits at a random starting number.

Interaction:
- Student drags the balloon along the runway
- The task changes the required "landing precision" each round: *"Round 6,420,315 to the nearest hundred-thousand — land the balloon at the nearest post!"*
- As the student drags, the two nearest valid posts glow, and a live distance readout shows how far the balloon is from each
- Releasing near a post snaps the balloon to it; correct nearest-post landing → confetti + "Touchdown!" celebration; wrong post → balloon gently bounces back to start with a distance-comparison hint (*"6,420,315 is closer to 6,400,000 than to 6,500,000 — try again!"*)

Teaching goal: directly targets LO7 (rounding) and reinforces magnitude/number-line sense that underlies LO6 (comparing/ordering) — the single most requested "new" mechanic for this topic, kept visually and mechanically consistent with the reference's drag-and-snap language (same interaction family as Station A's disc placement) so it still feels like the same product family, not a bolt-on.

Rounding targets rotate across nearest 10,000 / 100,000 / 1,000,000 across rounds, increasing in difficulty.

---

## 8. Phase 4 — PLAY: IntelliPlay™ Question Bank

### 8.1 Question Types (10 types × 10 questions per session = 100 total, procedurally generated — see TRD §5)

| Type | Description | Example |
|---|---|---|
| Q1 | Read the numeral → choose correct word form | `6,420,315` → which is correct? (4 word-form options) |
| Q2 | Write the numeral from a word form (number pad input) | "four million eighty thousand nine hundred" → ______ |
| Q3 | Identify the place value of a highlighted digit | In `4,586,213`, what is the value of the digit **5**? |
| Q4 | Expanded form → standard numeral | `5,000,000 + 300,000 + 20,000 + 6` = ______ |
| Q5 | Standard numeral → expanded form (fill missing addend) | `6,420,315 = 6,000,000 + 400,000 + ___ + 300 + 15` |
| Q6 | Compare two numbers (`>`, `<`, `=`) | `6,420,315 ___ 6,402,315` |
| Q7 | Order a set of numbers (ascending/descending) | Put these 4 numbers in ascending order |
| Q8 | Round to a stated place value | Round `3,482,910` to the nearest hundred-thousand |
| Q9 | Global real-world word problem | "Yuki's city has 9,700,000 people. Priya's city has 9,720,000. Which city is bigger, and by how much?" |
| Q10 | True/False or "spot the error" in a numeral↔words conversion | *"6,050,203 is written 'six million five thousand two hundred three.' True or False?"* |

### 8.2 Question Distribution by Difficulty (mirrors reference proportions)

| Type | Count | Easy (≤999,999) | Medium (1M–4.99M) | Hard (5M–9,999,999) |
|---|---|---|---|---|
| Q1 | 10 | 5 | 3 | 2 |
| Q2 | 10 | 5 | 3 | 2 |
| Q3 | 10 | 4 | 4 | 2 |
| Q4 | 10 | 3 | 4 | 3 |
| Q5 | 10 | 3 | 4 | 3 |
| Q6 | 10 | 3 | 4 | 3 |
| Q7 | 10 | 3 | 4 | 3 |
| Q8 | 10 | 5 | 3 | 2 |
| Q9 | 10 | 4 | 4 | 2 |
| Q10 | 10 | 3 | 4 | 3 |
| **Total** | **100** | **38** | **37** | **25** |

### 8.3 Randomisation Requirement (Critical)

> Every question is **procedurally generated at session start**, not selected from a static bank of pre-written items — matching the reference repo's real `questionBank.js` pattern (10 generator functions, each called with a prescribed difficulty distribution, producing fresh random numbers, names, and contexts every single call). Two students — or the same student replaying the lesson — must never see the same 100 questions in the same order, and in practice will rarely see the exact same *numbers* either. Full generator specification is in the TRD, §5.

### 8.4 World Map (IntelliPlay™ Level Progression)

| World | Country / Theme | Question range | Difficulty |
|---|---|---|---|
| 1 | 🇸🇬 Merlion Bay (Singapore, home base) | Q1–10 | Easy |
| 2 | 🇯🇵 Tokyo Towers (Japan) | Q11–20 | Easy–Medium |
| 3 | 🇪🇬 Sahara Sands (Egypt) | Q21–30 | Medium |
| 4 | 🇧🇷 Carnival Coast (Brazil) | Q31–40 | Medium |
| 5 | 🇫🇷 Eiffel Heights (France) | Q41–50 | Medium |
| 6 | 🇮🇳 Monsoon Market (India) — Indian numeration system introduced | Q51–60 | Medium–Hard |
| 7 | 🇦🇺 Outback Trails (Australia) | Q61–70 | Hard |
| 8 | 🇨🇦 Northern Lights (Canada) | Q71–80 | Hard |
| 9 | 🇰🇪 Savanna Trail (Kenya) | Q81–90 | Hard |
| 10 | 🚀 Mission Control (finale, space-themed) | Q91–100 | Hardest, mixed + system-conversion |

Unlock gate: ≥6/10 correct required to advance. 3 stars in a world unlocks a hidden "Bonus Fact" card (a real, illustrative large-number fact about that world's country).

> **Content-accuracy note:** all population/visitor/commuter figures used in-world are rounded, illustrative teaching figures chosen to sit at pedagogically useful magnitudes — they are not asserted as precise real-time statistics, the same convention textbooks use when quoting "About 9,700,000 people live in Tokyo."

---

## 9. Gamification Design

### 9.1 Reward System

- **Stars ⭐** — earned per 10-question world (1–3 stars by score)
- **XP** — 10 XP correct first try · 7 XP second try · 5 XP with hint used
- **Streak 🔥** — fire counter for consecutive correct answers; +5 XP bonus once streak ≥ 5

### 9.2 Badges

| Badge | Condition |
|---|---|
| 🏅 Digit Explorer | Complete Wonder + Story phases |
| 🥈 Place-Value Builder | Complete all 3 core Simulate stations |
| 🥇 Millionaire Reader | Score ≥80% on Play phase |
| 💎 Perfect Period | 10/10 in any single world |
| 🔥 Number Streak | Reach a streak of 10 consecutive correct answers |
| 🌟 Full Expedition | Complete all 5 phases |
| 🎯 Sharp-Eyed Comparer | 5 correct comparing/ordering (Q6/Q7) questions with no wrong pick |
| 🌍 Globe Trotter | Answer 5 global word problems (Q9) correctly |
| 🧭 Rounding Ranger | Successfully complete the Rounding Runway bonus station |
| 🔢 Numeration Navigator | Correctly convert a number between the International and Indian systems |

### 9.3 Feedback Mechanics

Identical philosophy to the reference lesson — **no negative scoring, encouragement-first**:
- ✅ Correct: bounce animation, ElevenLabs celebration line, floating XP, streak increment
- ❌ Attempt 1 wrong: gentle shake + Hint 1 (place-value chart highlighted)
- ❌ Attempt 2 wrong: stronger shake + Hint 2 (animated digit-by-digit walkthrough)
- ❌ Attempt 3 wrong: full explanation revealed and read aloud, no penalty

### 9.4 Mascot

**LearnFlow** (the same robot companion used across the Intellia SG catalogue) — mood states idle / curious / happy / thinking / celebrating / encouraging; appears at every phase transition and every simulation station.

---

## 10. Audio & Narration Design

### 10.0 Note on the Reference Audio File

No audio file was found uploaded to this workspace at the time of writing this PRD ("the audio should be like the provided file" — please upload it if you have a specific reference clip in mind, e.g. a target voice sample or SFX set, and we will re-tune this section). In its absence, the specification below is reverse-engineered directly from the **live, shipping** `src/utils/audio.js` in the reference repository, which is arguably the strictest possible match available: it is the *actual audio engine currently running* on the site you asked us to mirror.

### 10.1 Voice & Pipeline

- Provider: **ElevenLabs only** — no browser Web Speech API fallback for narration
- Voice: **Alice**, Voice ID `Xb7hH8MSUJpSbSDYk0k2`
- Model: `eleven_multilingual_v2` (supports clear pronunciation across the many accents implied by a global cast)
- Backend: server-side proxy at `/api/elevenlabs` (keeps the API key off the client) with a direct-call client-side fallback if the proxy fails and a local key is present
- All dynamically fetched clips are cached in-memory per session (never re-fetched twice for the same text+style)

### 10.2 Speech Styles (exact values, matched to the reference's real code, not its aspirational doc)

| Style | stability | similarity_boost | style | Use case |
|---|---|---|---|---|
| statement / instruction (default) | 0.20 | 0.55 | 0.50 | Story narration, station instructions |
| question | 0.20 | 0.55 | 0.55 | Practice question read-aloud |
| encouragement | 0.16 | 0.50 | 0.65 | Correct-answer feedback |
| emphasis | 0.16 | 0.50 | 0.60 | Key vocabulary highlight |
| thinking | 0.24 | 0.60 | 0.35 | Mascot thinking moments |
| celebration | 0.12 | 0.45 | 0.75 | Badge unlock, world complete |

All requests also set `use_speaker_boost: true`.

### 10.3 Sample Narration Script

```
Wonder   (thinking):     "A city on the other side of the world has nine million
                          seven hundred thousand people in it."
Wonder   (question):     "Can you say that number out loud? Can you write it down?"
Story P2 (statement):    "Yuki's home city has nine million, seven hundred thousand
                          people!"
Story P3 (emphasis):     "Group in threes from the right. Name each period: nine
                          million, seven hundred thousand."
Station A (instruction): "Drag the discs onto the chart to build the number.
                          Ten of one disc? Trade them for the next one up!"
Play (celebration):      "Touchdown! You rounded that number perfectly!"
Reflect (thinking):      "Which country's big number surprised you the most? Tell
                          me why!"
```

### 10.4 1:1 Narration Parity Rule

Every on-screen string that is narrated must match the audio-generation script **exactly** (same words, punctuation, capitalisation) — identical policy to the reference repo. Any UI copy change requires updating the audio phrase list and regenerating the affected clip before merging.

### 10.5 Non-Voice Sound Effects

Short Web Audio API tone effects (oscillator-based, no external asset) run independently of ElevenLabs for snappy micro-feedback: `correct` (ascending 3-note chime), `wrong` (single low tone), `badge` (4-note fanfare), `click`, `streak` — matching the reference's `sounds` utility 1:1.

---

## 11. UX & Visual Design Requirements

### 11.1 Visual Theme (strict parity — values extracted directly from the reference repo's shipping CSS)

- Brand: Intellia SG — *Think. Explore. Become.*
- Reference UI: https://equal-tau.vercel.app/ (mirror exactly)
- Reference Repo: https://github.com/dsamyak/equal (mirror exactly)
- Background: deep-space gradient — `#0a0a2e → #2d1b69 → #1a0a3e → #0d1b3e`
- Palette: purple family (`#2d1b69 / #4a2c8a / #7c5cbf`), blue family (`#1a237e / #283593 / #3f51b5`), gold accent (`#ffc107 / #ffd54f / #f9a825`), green success (`#4caf50`), red/coral error (`#ef5350 / #ff7043`)
- Typography: **Fredoka** (display/headers) + **Nunito** (body) — both loaded from Google Fonts, both already used site-wide in the reference
- Corner radii: 8 / 16 / 24 / 32px + full-pill scale, glass-card surfaces with backdrop blur, exactly as implemented in the reference's `.glass-card`
- Full token table and component class list is reproduced verbatim in the TRD (§13) for engineering handoff

### 11.2 Layout Structure (mirrors equal-tau.vercel.app)

- **Top bar:** Home button (left) · Journey progress dots (centre, hidden on Intro) · Audio mute toggle (right)
- **Main area:** phase content, full height, smooth phase-to-phase transitions
- **HUD:** XP · streak fire · stars, shown during Play phase
- No persistent sidebar — matches the reference's single-column, phase-at-a-time layout on all breakpoints

### 11.3 Accessibility

- Minimum 44×44px tap targets on all interactive elements
- WCAG AA colour contrast on all text
- All narration via ElevenLabs (no silent-only interactions)
- Full keyboard navigation (Tab + Enter/Space)
- No mandatory time pressure
- Every drag interaction (discs, balloon, word-tiles) has a tap-tap fallback for non-drag/assistive input

### 11.4 Responsive Design

- Primary: tablet (768px+) — classroom context
- Secondary: desktop (1024px+)
- Tertiary: mobile (375px+) — single-column stack, matching the reference's existing breakpoints exactly

---

## 12. Content Requirements

### 12.1 Global Name & Context Cast

Deliberately diverse, spanning six populated continents, so "global countries" is a lived design choice rather than a slogan:

| Name | Represented context |
|---|---|
| Sarah | London, UK 🇬🇧 |
| John | Toronto, Canada 🇨🇦 |
| Mike | Sydney, Australia 🇦🇺 |
| Priya | Mumbai, India 🇮🇳 |
| Wei | Beijing, China 🇨🇳 |
| Fatima | Cairo, Egypt 🇪🇬 |
| Carlos | Rio de Janeiro, Brazil 🇧🇷 |
| Amara | Lagos, Nigeria 🇳🇬 |
| Yuki | Tokyo, Japan 🇯🇵 |
| Omar | Dubai, UAE 🇦🇪 |
| Sofia | Rome, Italy 🇮🇹 |
| Aisha | Nairobi, Kenya 🇰🇪 |
| Diego | Mexico City, Mexico 🇲🇽 |
| Elena | Athens, Greece 🇬🇷 |
| Liam | Dublin, Ireland 🇮🇪 |

Used consistently across Story panels, word problems (Q9), and the World Map. Names rotate per session so no learner sees the exact same cast pairing twice in a row.

### 12.2 Word-Problem Templates (global style)

```
Comparison sense:
  "[Name 1]'s city has [number A] people. [Name 2]'s city has [number B] people.
   Which city has more people, and how many more?"

Reading/writing sense:
  "[Name] read that [context, e.g. 'a stadium'] had [number] visitors last year.
   How do you write that number in words?"

Rounding sense:
  "[Name] says [context] had about [number] [unit]. Round this to the nearest
   [place value] to make it easier to remember."
```

### 12.3 Numeration System Toggle (unique feature of this lesson)

A visible **International ↔ Indian** toggle available from World 6 onward:
- International: `6,420,315` → *"six million four hundred twenty thousand three hundred fifteen"*
- Indian: `64,20,315` → *"sixty-four lakh twenty thousand three hundred fifteen"*
- Because 10,000,000 = 1 crore exactly, every number in this lesson converts cleanly between systems, letting the same content serve Singapore/UK/US-aligned classrooms and Indian/South-Asian-aligned classrooms without a separate build

### 12.4 Content Accuracy

All real-world large-number facts used in Story panels and World Map flavour text are rounded, illustrative figures appropriate for teaching (see §8.4 footnote) and should be reviewed by the curriculum team before final publication if precise, citable statistics are required for a specific market.

---

## 13. Success Criteria (v1.0)

| Criterion | Target |
|---|---|
| All 100 questions procedurally randomised (numbers, names, contexts) | ✅ Required |
| All 3 core simulation stations + 1 signature bonus station functional | ✅ Required |
| All 5 phases navigable end-to-end | ✅ Required |
| Gamification (XP, streaks, 10 badges) working | ✅ Required |
| World map (10-country) progression logic correct | ✅ Required |
| ElevenLabs audio plays for all phase narration | ✅ Required |
| Numeration System Toggle (International ↔ Indian) functioning correctly | ✅ Required |
| Mobile/tablet responsive layout | ✅ Required |
| Singapore MOE Primary 5 Whole Numbers syllabus 100% covered | ✅ Required |
| Cross-mapped coverage of Common Core / UK / CBSE / Cambridge equivalents documented | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches equal-tau.vercel.app structure and design tokens | ✅ Required |
| Hosted correctly at intelliasg.com lesson URL | ✅ Required |

---

## 14. Out of Scope (v1.0)

- Teacher dashboard / backend analytics
- Student login / cross-device account persistence
- Multiplayer or class-vs-class competition features
- Parent progress-report emails
- Print-worksheet generation
- Decimal numbers, fractions, or negative numbers (separate future lessons)
- Numbers beyond 10,000,000 in graded content (an optional, non-graded "Beyond Ten Million" enrichment card may appear only as a Bonus Fact unlock, never in scored questions)
- Full backend/CMS integration beyond the WordPress embed described in the TRD

---

## 15. Risks & Assumptions

| Risk / Assumption | Mitigation |
|---|---|
| `intelliasg.com/courses/grade-5-math` could not be reached from this workspace at the time of research (domain did not resolve in available search/fetch tools) | Content was built from the verified, live reference implementation (equal-tau.vercel.app / dsamyak/equal) plus public Singapore MOE / Common Core / CBSE / UK syllabus documentation; recommend a final visual diff against the actual grade‑5 course page once accessible |
| `geometry-shapes-ashen.vercel.app` returned the same content as equal-tau.vercel.app on fetch, suggesting the deployment may be stale, redirected, or unavailable | Simulation design instead extends the *proven* interaction patterns already live in the equal-tau reference (drag-to-target, tap-to-match, number-pad fill) into new place-value-appropriate mechanics, keeping strict UI/UX family resemblance |
| No reference audio file was found uploaded | Audio spec matches the reference repo's real shipping ElevenLabs pipeline exactly (see §10); re-tune on request if a specific voice/SFX sample is provided |
| Real-world large-number facts are illustrative, not live-sourced statistics | Flagged explicitly in §8.4 and §12.4; recommend curriculum-team fact-check before publication |

---

## 16. Appendix — Reference Sources

- Reference UI (strict mirror): https://equal-tau.vercel.app/
- Reference Repo (strict mirror): https://github.com/dsamyak/equal
- Parent course page: https://intelliasg.com/courses/grade-5-math/
- Singapore MOE Primary Mathematics Syllabus — Whole Numbers strand, Primary 5
- UK National Curriculum, Key Stage 2, Year 6 — "Read, write, order and compare numbers up to 10,000,000"
- CBSE Class 5 Mathematics — "Large Numbers" chapter (Indian & International numeration systems)
- US Common Core State Standards — 4.NBT.A.2, 5.NBT.A.1

---

*Document Version 1.0 | July 2026 | Intellia SG — Grade 5 Math, Lesson 1.1*
