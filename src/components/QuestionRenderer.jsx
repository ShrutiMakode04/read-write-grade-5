import { useState, useEffect } from 'react';
import { numberToWords, numberToWordsIndian } from '../utils/numberWords';

export default function QuestionRenderer({ question, onAnswer, numeration, showHint, attemptCount }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // true/false

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswerCorrect(null);
  }, [question]);

  const handleOptionClick = (opt) => {
    if (isAnswerCorrect === true) return; // already got it right
    
    setSelectedOption(opt);
    const correct = String(opt) === String(question.correctAnswer);
    setIsAnswerCorrect(correct);
    onAnswer(correct);
  };

  const getOptionClass = (opt) => {
    if (selectedOption === opt) {
      return isAnswerCorrect ? 'correct' : 'wrong';
    }
    return '';
  };

  // Pre-process text based on numeration if needed (for true_false or Q1/Q2 which rely on word forms)
  // We'll trust the question generator for most text, but can override if numeration='indian'
  // Actually, PRD says Q1/Q2 word forms adapt if system toggle is used.
  // For simplicity here, we'll render options directly from question object, which has international by default.
  // To fully support Indian in options, we would map the options if they match international strings.
  const displayOptions = question.options ? [...question.options] : [];

  return (
    <div className="glass-card" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
        Question Type: {question.type.replace('_', ' ')}
      </h3>
      
      <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
        {question.questionText}
      </h2>

      {/* Visual Component if any */}
      {question.visual === 'placeValueChart' && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem', letterSpacing: '5px', color: 'var(--gold)' }}>{question.value.toLocaleString()}</span>
        </div>
      )}

      {/* Options */}
      {displayOptions.length > 0 && (
        <div className="options-grid" style={{ marginTop: 'auto' }}>
          {displayOptions.map((opt, i) => (
            <button 
              key={i} 
              className={`option-btn ${getOptionClass(opt)}`}
              onClick={() => handleOptionClick(opt)}
              disabled={isAnswerCorrect === true}
            >
              {typeof opt === 'number' ? opt.toLocaleString() : opt}
            </button>
          ))}
        </div>
      )}

      {/* Hints & Explanation */}
      {attemptCount > 0 && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 83, 80, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--red)' }}>
          {showHint === 1 && <p><strong>Hint 1:</strong> {question.hint1}</p>}
          {showHint === 2 && <p><strong>Hint 2:</strong> {question.hint2}</p>}
          {attemptCount >= 3 && <p><strong>Explanation:</strong> {question.explanation}</p>}
        </div>
      )}
      
      {isAnswerCorrect === true && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--green)', animation: 'fadeIn 0.3s' }}>
          <p><strong>Correct!</strong> {question.explanation}</p>
        </div>
      )}
    </div>
  );
}
