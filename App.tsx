
import React, { useState, useEffect } from 'react';
import { GameState, QuizMode, Radical } from './types';
import { RADICALS } from './constants';
import RadicalCard from './components/RadicalCard';
import QuizGame from './components/QuizGame';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [quizMode, setQuizMode] = useState<QuizMode>('normal');
  const [quizLength, setQuizLength] = useState(10);
  const [studyIndex, setStudyIndex] = useState(0);
  const [lastResult, setLastResult] = useState<{ score: number; total: number } | null>(null);
  const [seenRadicals, setSeenRadicals] = useState<string[]>([]);
  const [activeRadicals, setActiveRadicals] = useState<Radical[]>([]);

  // Load seen radicals from storage
  useEffect(() => {
    const saved = localStorage.getItem('seenRadicals');
    if (saved) {
      setSeenRadicals(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (answeredCharacters: string[]) => {
    const newSeen = Array.from(new Set([...seenRadicals, ...answeredCharacters]));
    setSeenRadicals(newSeen);
    localStorage.setItem('seenRadicals', JSON.stringify(newSeen));
  };

  const startQuiz = (mode: QuizMode, onlyNew = false) => {
    let pool = RADICALS;
    if (onlyNew) {
      pool = RADICALS.filter(r => !seenRadicals.includes(r.character));
      if (pool.length === 0) {
        alert("Você já viu todos os radicais disponíveis! Reiniciando progresso...");
        setSeenRadicals([]);
        localStorage.removeItem('seenRadicals');
        pool = RADICALS;
      }
    }
    setActiveRadicals(pool);
    setQuizMode(mode);
    setGameState('quiz');
  };

  const startStudy = () => {
    setGameState('study');
    setStudyIndex(0);
  };

  const finishQuiz = (score: number, total: number, answered: string[]) => {
    saveProgress(answered);
    setLastResult({ score, total });
    setGameState('result');
  };

  const nextStudy = () => {
    // Mark current study card as seen
    saveProgress([RADICALS[studyIndex].character]);
    if (studyIndex < RADICALS.length - 1) {
      setStudyIndex(prev => prev + 1);
    } else {
      setGameState('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FDFCFB]">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-50 py-4 px-8 border-b border-indigo-50 flex justify-between items-center shadow-sm">
        <div 
          onClick={() => setGameState('home')} 
          className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer flex items-center gap-2"
        >
          <span className="text-3xl">🏮</span> Hanzi Hero
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={startStudy} className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Estudar</button>
          <div className="h-6 w-[1px] bg-gray-200"></div>
          <button onClick={() => startQuiz('normal')} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase">Jogar</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mt-28 w-full max-w-5xl px-4 flex flex-col items-center justify-center flex-1 pb-20">
        
        {gameState === 'home' && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 w-full">
            <div className="inline-block mb-6 px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
              Aprenda os Blocos de Construção do Chinês
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-none tracking-tighter">
              Domine os <br />
              <span className="text-indigo-600">Radicais.</span>
            </h1>
            
            {/* Seen Progress Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                <span>Progresso Total</span>
                <span>{seenRadicals.length} / {RADICALS.length} Radicais</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${(seenRadicals.length / RADICALS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Slider Section */}
            <div className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-xl mb-12 max-w-xl mx-auto flex flex-col items-center">
              <div className="flex justify-between w-full mb-4">
                <span className="text-sm font-black text-gray-700 uppercase tracking-widest">Quantidade de Questões</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-lg font-black">{quizLength}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="20" 
                step="1"
                value={quizLength}
                onChange={(e) => setQuizLength(parseInt(e.target.value))}
                className="w-full h-3 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between w-full mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                <span>5 Questões</span>
                <span>20 Questões</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
              <button 
                onClick={startStudy}
                className="group p-8 bg-white border-2 border-indigo-50 rounded-3xl text-left hover:border-indigo-500 hover:shadow-2xl transition-all"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Deck de Estudo</h3>
                <p className="text-sm text-gray-400 font-medium">Explore os radicais com histórias criadas por IA.</p>
              </button>

              <button 
                onClick={() => startQuiz('normal')}
                className="group p-8 bg-white border-2 border-indigo-50 rounded-3xl text-left hover:border-indigo-500 hover:shadow-2xl transition-all"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Modo Casual</h3>
                <p className="text-sm text-gray-400 font-medium">Múltipla escolha para praticar o básico.</p>
              </button>

              <button 
                onClick={() => startQuiz('hard')}
                className="group p-8 bg-indigo-50 border-2 border-indigo-100 rounded-3xl text-left hover:border-indigo-500 hover:shadow-2xl transition-all"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⌨️</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Modo Escrita</h3>
                <p className="text-sm text-gray-400 font-medium">Digite o significado sem opções.</p>
              </button>

              <button 
                onClick={() => startQuiz('hard', true)}
                className="group p-8 bg-gradient-to-br from-indigo-600 to-purple-700 border-2 border-indigo-600 rounded-3xl text-left hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
                <h3 className="text-xl font-black text-white mb-2">Prosseguir</h3>
                <p className="text-sm text-indigo-100 font-medium">Aprenda e teste apenas novos radicais.</p>
              </button>
            </div>
          </div>
        )}

        {gameState === 'study' && (
          <div className="w-full flex flex-col items-center">
            <div className="mb-6 flex items-center gap-4">
               <div className="text-gray-400 font-black text-xs uppercase tracking-widest">
                Radical {studyIndex + 1} de {RADICALS.length}
              </div>
            </div>
            <RadicalCard radical={RADICALS[studyIndex]} />
            <div className="mt-12 flex gap-4 w-full max-w-md">
              <button 
                onClick={() => setStudyIndex(prev => Math.max(0, prev - 1))}
                disabled={studyIndex === 0}
                className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-50 disabled:opacity-30 transition-all uppercase text-sm"
              >
                Anterior
              </button>
              <button 
                onClick={nextStudy}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase text-sm"
              >
                {studyIndex === RADICALS.length - 1 ? 'Concluir Estudo' : 'Próximo Radical'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'quiz' && (
          <QuizGame 
            mode={quizMode} 
            quizLength={quizLength} 
            customRadicals={activeRadicals}
            onFinish={finishQuiz} 
          />
        )}

        {gameState === 'result' && lastResult && (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="text-9xl mb-8">🎖️</div>
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Resultados do Treino</h2>
            <p className="text-xl text-gray-400 mb-12 font-medium">Você dominou {lastResult.score} de {lastResult.total} radicais no modo <span className="text-indigo-600 font-bold uppercase">{quizMode}</span>.</p>
            
            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-indigo-50 mb-12 max-w-sm mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <div className="text-7xl font-black text-indigo-600 mb-2">
                {Math.round((lastResult.score / lastResult.total) * 100)}%
              </div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Taxa de Sucesso</div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setGameState('home')}
                className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase text-sm"
              >
                Menu Inicial
              </button>
              <button 
                onClick={() => startQuiz(quizMode)}
                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all uppercase text-sm"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-12 flex flex-col items-center border-t border-gray-50 mt-auto">
        <div className="text-gray-300 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Powered by Gemini 3 Flash</div>
        <div className="text-gray-400 font-medium text-xs">© 2024 Hanzi Hero • A melhor forma de aprender radicais</div>
      </footer>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #4f46e5;
          cursor: pointer;
          border-radius: 50%;
          border: 4px solid #fff;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </div>
  );
};

export default App;
