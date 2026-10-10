import { numberToWords } from './numberWords';
import { globalCast } from '../data/worldContent';

function genNumber(diff) {
  const ranges = { 
    1: [10000, 999999], 
    2: [1000000, 4999999], 
    3: [5000000, 9999999] 
  };
  const [min, max] = ranges[diff];
  return Math.floor(min + Math.random() * (max - min));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateDistractors(correct, min = 0, max = 10000000, count = 3) {
  const distractors = new Set();
  const offsets = [-100000, -10000, -1000, 1000, 10000, 100000];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (typeof d === 'number' && d >= min && d <= max && d !== correct && distractors.size < count) distractors.add(d);
  });
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1) * 1000;
    if (d <= max && d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...distractors]);
}

function swapAdjacentDigits(num) {
  let s = String(num).split('');
  if (s.length > 1) {
    const idx = Math.floor(Math.random() * (s.length - 1));
    [s[idx], s[idx+1]] = [s[idx+1], s[idx]];
  }
  return parseInt(s.join(''), 10);
}

// Q1: Read numeral, choose correct word form
function genQ1(id, diff) {
  const value = genNumber(diff);
  const correct = numberToWords(value);
  const distractors = shuffleArray([
    numberToWords(value + pick([10, 100, 1000, 10000])),
    numberToWords(swapAdjacentDigits(value)),
    numberToWords(Math.max(0, value - pick([10, 100, 1000, 10000]))),
  ]).slice(0, 3);
  return {
    id, type: 'read_numeral', difficulty: diff, value,
    questionText: `How do you read ${value.toLocaleString()} in words?`,
    visual: 'plain', numerationSystem: 'international',
    options: shuffleArray([correct, ...distractors]),
    hint1: 'Group the digits in 3s from the right, then name each group.',
    hint2: `The last group is the ones. Before that comes thousands, then millions.`,
    explanation: `${value.toLocaleString()} is written "${correct}".`,
    correctAnswer: correct,
  };
}

// Q2: Write numeral from word form
function genQ2(id, diff) {
  const value = genNumber(diff);
  const words = numberToWords(value);
  return {
    id, type: 'write_numeral', difficulty: diff, value,
    questionText: `Write "${words}" as a number.`,
    visual: 'plain', numerationSystem: 'international',
    options: generateDistractors(value, 0, 10000000, 3),
    hint1: 'Break it into periods: millions, thousands, and ones.',
    hint2: 'Use commas to separate the periods.',
    explanation: `"${words}" is written as ${value.toLocaleString()}.`,
    correctAnswer: value,
  };
}

// Q3: Place value identification
function genQ3(id, diff) {
  const value = genNumber(diff);
  const digits = String(value).split('').reverse();
  const placeNames = ['ones','tens','hundreds','thousands','ten-thousands','hundred-thousands','millions'];
  const nonZeroIdx = digits.map((d, i) => ({ d: Number(d), i })).filter(o => o.d !== 0);
  const target = pick(nonZeroIdx);
  const placeValue = target.d * Math.pow(10, target.i);
  return {
    id, type: 'place_value_id', difficulty: diff, value,
    questionText: `In ${value.toLocaleString()}, what is the value of the digit ${target.d} in the ${placeNames[target.i]} place?`,
    visual: 'placeValueChart', numerationSystem: 'international',
    options: shuffleArray([placeValue, placeValue*10, placeValue/10, target.d]).filter(v => typeof v === 'number' && !isNaN(v)).slice(0,4),
    hint1: `Find the digit ${target.d} in the ${placeNames[target.i]} column of the place-value chart.`,
    hint2: `A digit's value = the digit × its place (${placeNames[target.i]}).`,
    explanation: `The ${target.d} is in the ${placeNames[target.i]} place, so its value is ${placeValue.toLocaleString()}.`,
    correctAnswer: placeValue,
  };
}

// Q4: Expanded to std
function genQ4(id, diff) {
  const value = genNumber(diff);
  const exp = String(value).split('').reverse().map((d,i) => Number(d) * Math.pow(10,i)).filter(v=>v!==0).reverse();
  return {
    id, type: 'expanded_to_std', difficulty: diff, value,
    questionText: `What is ${exp.join(' + ')} in standard form?`,
    visual: 'plain', numerationSystem: 'international',
    options: generateDistractors(value, 0, 10000000, 3),
    hint1: `Line up the numbers by their place values and add them.`,
    hint2: `Check the zeros carefully.`,
    explanation: `${exp.join(' + ')} is ${value.toLocaleString()}.`,
    correctAnswer: value,
  };
}

// Q5: Missing expanded
function genQ5(id, diff) {
  const value = genNumber(diff);
  const exp = String(value).split('').reverse().map((d,i) => Number(d) * Math.pow(10,i)).filter(v=>v!==0).reverse();
  const blankIdx = Math.floor(Math.random() * exp.length);
  const missing = exp[blankIdx];
  const blankExp = [...exp];
  blankExp[blankIdx] = '___';
  return {
    id, type: 'std_to_expanded', difficulty: diff, value, missingDigitPlace: missing,
    questionText: `Complete the expanded form:\n${value.toLocaleString()} = ${blankExp.join(' + ')}`,
    visual: 'plain', numerationSystem: 'international',
    options: generateDistractors(missing, 0, 10000000, 3),
    hint1: `Which place value is missing from the equation?`,
    hint2: `Find the difference between ${value.toLocaleString()} and the sum of the other parts.`,
    explanation: `The missing part is ${missing.toLocaleString()}.`,
    correctAnswer: missing,
  };
}

// Q6: Compare
function genQ6(id, diff) {
  const a = genNumber(diff);
  const b = a + pick([10, 100, 1000, -10, -100, -1000]);
  const correct = a > b ? '>' : a < b ? '<' : '=';
  return {
    id, type: 'compare', difficulty: diff, value: a, compareValue: b,
    questionText: `Compare the numbers:\n${a.toLocaleString()} ___ ${b.toLocaleString()}`,
    visual: 'plain', numerationSystem: 'international',
    options: ['>', '<', '=', 'None'],
    hint1: `Compare the highest place value digits first.`,
    hint2: `The open mouth of > or < always points to the bigger number.`,
    explanation: `${a.toLocaleString()} is ${correct === '>' ? 'greater than' : 'less than'} ${b.toLocaleString()}.`,
    correctAnswer: correct,
  };
}

// Q7: Order (Find the largest)
function genQ7(id, diff) {
  const nums = [genNumber(diff), genNumber(diff), genNumber(diff), genNumber(diff)];
  const largest = Math.max(...nums);
  return {
    id, type: 'order', difficulty: diff, value: largest,
    questionText: `Which of these numbers is the largest?`,
    visual: 'plain', numerationSystem: 'international',
    options: shuffleArray(nums),
    hint1: `Check the millions place first, then hundred-thousands.`,
    hint2: `Line them up in a place value chart to compare easily.`,
    explanation: `${largest.toLocaleString()} is the largest number.`,
    correctAnswer: largest,
  };
}

// Q8: Rounding
function genQ8(id, diff) {
  const value = genNumber(diff);
  const roundPlace = pick([10000, 100000]);
  const rounded = Math.round(value / roundPlace) * roundPlace;
  const placeName = roundPlace === 100000 ? 'hundred-thousand' : 'ten-thousand';
  return {
    id, type: 'round', difficulty: diff, value, roundTo: roundPlace,
    questionText: `Round ${value.toLocaleString()} to the nearest ${placeName}.`,
    visual: 'numberLine', numerationSystem: 'international',
    options: generateDistractors(rounded, 0, 10000000, 3),
    hint1: `Look at the digit to the right of the ${placeName}s place.`,
    hint2: `If it's 5 or more, round up. If it's 4 or less, round down.`,
    explanation: `${value.toLocaleString()} rounded to the nearest ${placeName} is ${rounded.toLocaleString()}.`,
    correctAnswer: rounded,
  };
}

// Q9: Word Problem
function genQ9(id, diff) {
  const a = genNumber(diff), b = a + pick([1000, 5000, 20000, 100000]) * pick([1, -1]);
  const [p1, p2] = shuffleArray(globalCast).slice(0, 2);
  const bigger = a > b ? p1 : p2;
  const diffVal = Math.abs(a - b);
  return {
    id, type: 'word_problem', difficulty: diff, value: Math.max(a, b),
    characterName: `${p1.name} & ${p2.name}`, characterContext: `${p1.context} / ${p2.context}`,
    questionText: `${p1.name}'s city (${p1.context}) has ${a.toLocaleString()} people. ${p2.name}'s city (${p2.context}) has ${b.toLocaleString()} people. What is the difference in population?`,
    visual: 'plain', numerationSystem: 'international',
    options: generateDistractors(diffVal, 0, 10000000, 3),
    hint1: `Line up the digits by place value before comparing.`,
    hint2: `Subtract the smaller number from the larger number.`,
    explanation: `The difference is ${diffVal.toLocaleString()}.`,
    correctAnswer: diffVal,
  };
}

// Q10: True False
function genQ10(id, diff) {
  const value = genNumber(diff);
  const isCorrect = Math.random() > 0.5;
  const word = isCorrect ? numberToWords(value) : numberToWords(swapAdjacentDigits(value));
  return {
    id, type: 'true_false', difficulty: diff, value,
    questionText: `True or False: ${value.toLocaleString()} is written as "${word}".`,
    visual: 'plain', numerationSystem: 'international',
    options: ['True', 'False'],
    hint1: `Read the number carefully: ${value.toLocaleString()}`,
    hint2: `Check the place value of each digit.`,
    explanation: isCorrect ? 'The statement is True.' : 'The statement is False.',
    correctAnswer: isCorrect ? 'True' : 'False',
  };
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
      let q = gen(`Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff);
      if(q.options) {
        // Ensure correctAnswer is always in the options exactly once
        if(!q.options.includes(q.correctAnswer)) {
           q.options[0] = q.correctAnswer;
           q.options = shuffleArray(q.options);
        }
      }
      bank.push(q);
      qid++;
    });
  });
  const selected = shuffleArray(bank).slice(0, 60);
  selected.forEach((q, index) => { q.world = Math.floor(index / 10); });
  return selected;
}
