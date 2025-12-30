
export interface Radical {
  character: string;
  variant?: string; // How it appears in compounds
  pinyin: string;
  meaning: string;
  difficulty: number;
  examples: string[];
}

export type GameState = 'home' | 'study' | 'quiz' | 'result';
export type QuizMode = 'normal' | 'hard'; // normal: choices, hard: typing

export interface QuizQuestion {
  radical: Radical;
  options: string[];
  correctAnswer: string;
}
