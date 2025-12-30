
import React, { useState } from 'react';
import { Radical } from '../types';
import { getMnemonicForRadical } from '../services/geminiService';

interface RadicalCardProps {
  radical: Radical;
}

const RadicalCard: React.FC<RadicalCardProps> = ({ radical }) => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetMnemonic = async () => {
    setLoading(true);
    const story = await getMnemonicForRadical(radical);
    setMnemonic(story);
    setLoading(false);
  };

  const hasVariant = radical.variant && radical.variant !== radical.character;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-xl w-full mx-auto border border-indigo-50 transition-all hover:shadow-2xl overflow-hidden">
      <div className="text-center">
        <div className="flex justify-center items-end gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase mb-1">Main</span>
            <div className="text-8xl hanzi-font text-indigo-600 animate-in fade-in zoom-in duration-500">
              {radical.character}
            </div>
          </div>
          
          {hasVariant && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-400 uppercase mb-1">In Compound</span>
              <div className="text-8xl hanzi-font text-purple-500 animate-in fade-in slide-in-from-left-4 duration-500">
                {radical.variant}
              </div>
            </div>
          )}
        </div>

        <div className="text-3xl font-bold text-gray-800 mb-1">{radical.pinyin}</div>
        <div className="text-xl text-indigo-500 font-semibold mb-8 uppercase tracking-widest">{radical.meaning}</div>
        
        <div className="mb-8">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Usage in Characters</h4>
          <div className="flex justify-center gap-4">
            {radical.examples.map((ex, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="bg-indigo-50 text-indigo-700 w-14 h-14 flex items-center justify-center rounded-2xl text-2xl hanzi-font font-bold shadow-sm border border-indigo-100">
                  {ex}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleGetMnemonic}
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Master Gemini is Thinking...
            </>
          ) : (
            'Unlock Detailed AI Mnemonic'
          )}
        </button>

        {mnemonic && (
          <div className="mt-8 p-6 bg-amber-50 rounded-2xl text-left border border-amber-200 animate-in fade-in slide-in-from-top-4 duration-500 shadow-inner">
            <h5 className="text-xs font-black text-amber-700 mb-2 uppercase flex items-center gap-2">
              <span className="text-lg">📜</span> The Mnemonic Legend
            </h5>
            <div className="text-amber-900 text-base leading-relaxed whitespace-pre-wrap font-medium">
              {mnemonic}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadicalCard;
