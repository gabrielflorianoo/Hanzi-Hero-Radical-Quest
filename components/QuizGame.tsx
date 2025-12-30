
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Radical, QuizQuestion, QuizMode } from '../types';
import { RADICALS } from '../constants';

interface QuizGameProps {
  mode: QuizMode;
  quizLength: number;
  customRadicals?: Radical[];
  onFinish: (score: number, total: number, answeredRadicals: string[]) => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ mode, quizLength, customRadicals, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateQuestions = useCallback(() => {
    const source = customRadicals && customRadicals.length > 0 ? customRadicals : RADICALS;
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, quizLength);
    
    const qs = shuffled.map(rad => {
      const options = [rad.meaning];
      while (options.length < 4) {
        const randomRad = RADICALS[Math.floor(Math.random() * RADICALS.length)];
        if (!options.includes(randomRad.meaning)) {
          options.push(randomRad.meaning);
        }
      }
      return {
        radical: rad,
        options: options.sort(() => Math.random() - 0.5),
        correctAnswer: rad.meaning
      };
    });
    setQuestions(qs);
  }, [quizLength, customRadicals]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  useEffect(() => {
    if (mode === 'hard' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIdx, mode]);

  const validateAnswer = (answer: string) => {
    if (selectedAnswer || isCorrect !== null) return;
    
    const userInput = answer.toLowerCase().trim();
    const fullCorrectAnswer = questions[currentIdx].correctAnswer.toLowerCase().trim();
    const validMeanings = fullCorrectAnswer.split('/').map(m => m.trim());
    const correct = validMeanings.includes(userInput) || userInput === fullCorrectAnswer;
    
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedAnswer(null);
        setTypedAnswer('');
        setIsCorrect(null);
      } else {
        const finalScore = score + (correct ? 1 : 0);
        const answeredRadicals = questions.map(q => q.radical.character);
        onFinish(finalScore, questions.length, answeredRadicals);
      }
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && typedAnswer.trim() !== '') {
      validateAnswer(typedAnswer);
    }
  };

  if (questions.length === 0) return <div className="text-center p-10 font-bold text-indigo-600">Prepare seu pincel...</div>;

  const currentQuestion = questions[currentIdx];
  const displayChar = (mode === 'hard' && Math.random() > 0.5 && currentQuestion.radical.variant) 
    ? currentQuestion.radical.variant 
    : currentQuestion.radical.character;

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Progresso</span>
          <span className="text-gray-900 font-bold">{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="flex-1 mx-6 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Pontos</span>
          <span className="text-indigo-600 font-black">{score}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl p-12 text-center mb-8 border border-indigo-50 relative overflow-hidden">
        {mode === 'hard' && (
          <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            Modo Difícil
          </div>
        )}
        
        <div className="text-sm font-bold text-indigo-400 uppercase mb-4 tracking-tighter">Qual o significado deste radical?</div>
        <div className="text-[10rem] leading-none hanzi-font text-indigo-950 mb-10 transition-transform hover:scale-110 cursor-default">
          {displayChar}
        </div>
        
        {mode === 'normal' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isAnswerCorrect = option === currentQuestion.correctAnswer;
              
              let btnClass = "py-5 px-6 rounded-2xl text-lg font-bold transition-all border-2 ";
              if (selectedAnswer) {
                if (isAnswerCorrect) {
                  btnClass += "bg-green-500 text-white border-green-500 scale-105 shadow-xl shadow-green-100";
                } else if (isSelected) {
                  btnClass += "bg-red-500 text-white border-red-500 animate-shake";
                } else {
                  btnClass += "bg-gray-50 text-gray-300 border-gray-100 opacity-50";
                }
              } else {
                btnClass += "bg-white text-gray-700 border-gray-100 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-xl active:scale-95";
              }

              return (
                <button
                  key={idx}
                  onClick={() => { setSelectedAnswer(option); validateAnswer(option); }}
                  disabled={!!selectedAnswer}
                  className={btnClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              ref={inputRef}
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isCorrect !== null}
              placeholder="Significado..."
              className={`w-full py-5 px-8 rounded-2xl text-center text-2xl font-bold border-4 transition-all outline-none ${
                isCorrect === true ? 'border-green-500 bg-green-50 text-green-700' :
                isCorrect === false ? 'border-red-500 bg-red-50 text-red-700 animate-shake' :
                'border-indigo-100 bg-indigo-50 focus:border-indigo-500 focus:bg-white text-indigo-900'
              }`}
            />
            {isCorrect === false && (
              <div className="text-red-500 font-bold text-sm">
                Resposta correta: <span className="underline">{currentQuestion.correctAnswer}</span>
              </div>
            )}
            <p className="text-gray-400 text-xs">Pressione Enter para confirmar</p>
          </div>
        )}
      </div>

      <div className="h-10">
        {isCorrect === true && (
          <div className="text-center font-black text-2xl text-green-500 animate-bounce">
            ✨ INCRÍVEL! ✨
          </div>
        )}
        {isCorrect === false && (
          <div className="text-center font-black text-2xl text-red-500">
            Quase lá! 🏮
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
