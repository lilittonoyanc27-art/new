/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Volume2, 
  Lightbulb,
  Trophy
} from 'lucide-react';

// --- Types ---

interface Word {
  id: string;
  text: string;
  isSelected: boolean;
}

interface Lesson {
  id: number;
  type: 'sentence' | 'theory' | 'matching';
  question: string;
  translation: string;
  correctAnswer?: string[];
  options?: string[];
  theoryText?: string;
  grammarRule?: string;
}

// --- Data ---

const LESSONS: Lesson[] = [
  {
    id: 1,
    type: 'theory',
    question: 'Դերանուններ (Pronombres)',
    translation: 'Իսպաներենում դերանունները շատ կարևոր են:',
    theoryText: 'Yo - Ես\nTú - Դու\nÉl - Նա (արական)\nElla - Նա (իգական)\nNosotros - Մենք',
    grammarRule: 'Իսպաներենում հաճախ դերանունը կարելի է բաց թողնել, քանի որ բայը փոխվում է ըստ դեմքի:'
  },
  {
    id: 2,
    type: 'sentence',
    question: 'Ես եմ',
    translation: 'Yo soy',
    correctAnswer: ['Yo', 'soy'],
    options: ['Yo', 'soy', 'eres', 'él', 'tú']
  },
  {
    id: 3,
    type: 'sentence',
    question: 'Դու ես',
    translation: 'Tú eres',
    correctAnswer: ['Tú', 'eres'],
    options: ['Tú', 'eres', 'soy', 'ella', 'nosotros']
  },
  {
    id: 4,
    type: 'sentence',
    question: 'Բարև',
    translation: 'Hola',
    correctAnswer: ['Hola'],
    options: ['Hola', 'Adiós', 'Gracias', 'Por', 'favor']
  },
  {
    id: 5,
    type: 'theory',
    question: 'Բայերի խոնարհում (Ser - Լինել)',
    translation: 'Ser բայը օգտագործվում է մշտական հատկանիշների համար:',
    theoryText: 'Yo soy (Ես եմ)\nTú eres (Դու ես)\nÉl/Ella es (Նա է)',
    grammarRule: 'Օրինակ՝ Yo soy armenio (Ես հայ եմ):'
  },
  {
    id: 6,
    type: 'sentence',
    question: 'Շնորհակալություն',
    translation: 'Gracias',
    correctAnswer: ['Gracias'],
    options: ['Gracias', 'Hola', 'De', 'nada', 'Por']
  },
  {
    id: 7,
    type: 'sentence',
    question: 'Խնդրում եմ',
    translation: 'Por favor',
    correctAnswer: ['Por', 'favor'],
    options: ['Por', 'favor', 'Gracias', 'Hola', 'Adiós']
  },
  {
    id: 8,
    type: 'sentence',
    question: 'Ես խոսում եմ իսպաներեն',
    translation: 'Yo hablo español',
    correctAnswer: ['Yo', 'hablo', 'español'],
    options: ['Yo', 'hablo', 'español', 'tú', 'hablas', 'armenio']
  },
  {
    id: 9,
    type: 'sentence',
    question: 'Դու խոսում ես հայերեն',
    translation: 'Tú hablas armenio',
    correctAnswer: ['Tú', 'hablas', 'armenio'],
    options: ['Tú', 'hablas', 'armenio', 'yo', 'hablo', 'español']
  },
  {
    id: 10,
    type: 'sentence',
    question: 'Ես հաց եմ ուտում',
    translation: 'Yo como pan',
    correctAnswer: ['Yo', 'como', 'pan'],
    options: ['Yo', 'como', 'pan', 'bebo', 'agua', 'ella']
  },
  {
    id: 11,
    type: 'sentence',
    question: 'Նա ջուր է խմում',
    translation: 'Ella bebe agua',
    correctAnswer: ['Ella', 'bebe', 'agua'],
    options: ['Ella', 'bebe', 'agua', 'como', 'pan', 'yo']
  },
  {
    id: 12,
    type: 'sentence',
    question: 'Կատուն սև է',
    translation: 'El gato es negro',
    correctAnswer: ['El', 'gato', 'es', 'negro'],
    options: ['El', 'gato', 'es', 'negro', 'blanco', 'perro', 'la']
  },
  {
    id: 13,
    type: 'sentence',
    question: 'Տունը մեծ է',
    translation: 'La casa es grande',
    correctAnswer: ['La', 'casa', 'es', 'grande'],
    options: ['La', 'casa', 'es', 'grande', 'pequeña', 'el', 'perro']
  },
  {
    id: 14,
    type: 'sentence',
    question: 'Ես ունեմ գիրք',
    translation: 'Yo tengo un libro',
    correctAnswer: ['Yo', 'tengo', 'un', 'libro'],
    options: ['Yo', 'tengo', 'un', 'libro', 'perro', 'gato', 'tú']
  },
  {
    id: 15,
    type: 'sentence',
    question: 'Ինչպե՞ս ես',
    translation: '¿Cómo estás?',
    correctAnswer: ['¿Cómo', 'estás?'],
    options: ['¿Cómo', 'estás?', 'Hola', 'Bien', 'Gracias']
  },
  {
    id: 16,
    type: 'sentence',
    question: 'Շատ լավ',
    translation: 'Muy bien',
    correctAnswer: ['Muy', 'bien'],
    options: ['Muy', 'bien', 'mal', 'gracias', 'hola']
  },
  {
    id: 17,
    type: 'sentence',
    question: 'Բարի լույս',
    translation: 'Buenos días',
    correctAnswer: ['Buenos', 'días'],
    options: ['Buenos', 'días', 'Buenas', 'noches', 'tardes']
  },
  {
    id: 18,
    type: 'sentence',
    question: 'Բարի գիշեր',
    translation: 'Buenas noches',
    correctAnswer: ['Buenas', 'noches'],
    options: ['Buenas', 'noches', 'Buenos', 'días', 'tardes']
  },
  {
    id: 19,
    type: 'sentence',
    question: 'Ես ապրում եմ Մադրիդում',
    translation: 'Yo vivo en Madrid',
    correctAnswer: ['Yo', 'vivo', 'en', 'Madrid'],
    options: ['Yo', 'vivo', 'en', 'Madrid', 'Barcelona', 'tú', 'vives']
  },
  {
    id: 20,
    type: 'sentence',
    question: 'Իմ անունն է...',
    translation: 'Mi nombre es...',
    correctAnswer: ['Mi', 'nombre', 'es'],
    options: ['Mi', 'nombre', 'es', 'yo', 'soy', 'tú', 'te']
  },
  {
    id: 21,
    type: 'sentence',
    question: 'Մեկ սուրճ, խնդրում եմ',
    translation: 'Un café, por favor',
    correctAnswer: ['Un', 'café', 'por', 'favor'],
    options: ['Un', 'café', 'por', 'favor', 'agua', 'té', 'dos']
  },
  {
    id: 22,
    type: 'sentence',
    question: 'Խնձորը կարմիր է',
    translation: 'La manzana es roja',
    correctAnswer: ['La', 'manzana', 'es', 'roja'],
    options: ['La', 'manzana', 'es', 'roja', 'verde', 'el', 'plátano']
  },
  {
    id: 23,
    type: 'sentence',
    question: 'Ես ջուր եմ ուզում',
    translation: 'Yo quiero agua',
    correctAnswer: ['Yo', 'quiero', 'agua'],
    options: ['Yo', 'quiero', 'agua', 'café', 'pan', 'tú', 'quieres']
  },
  {
    id: 24,
    type: 'sentence',
    question: 'Նա շատ է սովորում',
    translation: 'Él estudia mucho',
    correctAnswer: ['Él', 'estudia', 'mucho'],
    options: ['Él', 'estudia', 'mucho', 'poco', 'ella', 'yo', 'estudio']
  },
  {
    id: 25,
    type: 'sentence',
    question: 'Մենք ընկերներ ենք',
    translation: 'Nosotros somos amigos',
    correctAnswer: ['Nosotros', 'somos', 'amigos'],
    options: ['Nosotros', 'somos', 'amigos', 'yo', 'soy', 'tú', 'eres']
  },
  {
    id: 26,
    type: 'sentence',
    question: 'Արևը դեղին է',
    translation: 'El sol es amarillo',
    correctAnswer: ['El', 'sol', 'es', 'amarillo'],
    options: ['El', 'sol', 'es', 'amarillo', 'azul', 'la', 'luna']
  },
  {
    id: 27,
    type: 'sentence',
    question: 'Ծաղիկը գեղեցիկ է',
    translation: 'La flor es bonita',
    correctAnswer: ['La', 'flor', 'es', 'bonita'],
    options: ['La', 'flor', 'es', 'bonita', 'fea', 'el', 'árbol']
  },
  {
    id: 28,
    type: 'sentence',
    question: 'Ես հեռուստացույց եմ դիտում',
    translation: 'Yo veo la tele',
    correctAnswer: ['Yo', 'veo', 'la', 'tele'],
    options: ['Yo', 'veo', 'la', 'tele', 'radio', 'tú', 'ves']
  },
  {
    id: 29,
    type: 'sentence',
    question: 'Դու շուն ունես',
    translation: 'Tú tienes un perro',
    correctAnswer: ['Tú', 'tienes', 'un', 'perro'],
    options: ['Tú', 'tienes', 'un', 'perro', 'gato', 'yo', 'tengo']
  },
  {
    id: 30,
    type: 'sentence',
    question: 'Ցտեսություն',
    translation: 'Adiós',
    correctAnswer: ['Adiós'],
    options: ['Adiós', 'Hola', 'Gracias', 'Hasta', 'luego']
  },
  {
    id: 31,
    type: 'sentence',
    question: 'Ես ուսանող եմ',
    translation: 'Yo soy estudiante',
    correctAnswer: ['Yo', 'soy', 'estudiante'],
    options: ['Yo', 'soy', 'estudiante', 'profesor', 'tú', 'eres']
  },
  {
    id: 32,
    type: 'sentence',
    question: 'Նա գեղեցիկ է',
    translation: 'Ella es guapa',
    correctAnswer: ['Ella', 'es', 'guapa'],
    options: ['Ella', 'es', 'guapa', 'feo', 'él', 'soy']
  }
];

// --- Components ---

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [lives, setLives] = useState(5);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentLesson = LESSONS[currentStep];

  // Initialize available words when step changes
  useEffect(() => {
    if (currentLesson?.type === 'sentence' && currentLesson.options) {
      const shuffled = [...currentLesson.options]
        .sort(() => Math.random() - 0.5)
        .map((text, index) => ({
          id: `${currentStep}-${index}-${text}`,
          text,
          isSelected: false
        }));
      setAvailableWords(shuffled);
      setSelectedWords([]);
    }
  }, [currentStep, currentLesson]);

  const handleWordClick = (word: Word) => {
    if (word.isSelected) {
      // Deselect
      setSelectedWords(prev => prev.filter(w => w.id !== word.id));
      setAvailableWords(prev => prev.map(w => w.id === word.id ? { ...w, isSelected: false } : w));
    } else {
      // Select
      setSelectedWords(prev => [...prev, { ...word, isSelected: true }]);
      setAvailableWords(prev => prev.map(w => w.id === word.id ? { ...w, isSelected: true } : w));
    }
  };

  const checkAnswer = () => {
    if (currentLesson.type === 'theory') {
      nextStep();
      return;
    }

    const userSentence = selectedWords.map(w => w.text).join(' ');
    const correctSentence = currentLesson.correctAnswer?.join(' ');

    if (userSentence === correctSentence) {
      setShowFeedback('correct');
    } else {
      setShowFeedback('incorrect');
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  const nextStep = () => {
    setShowFeedback(null);
    if (currentStep < LESSONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const progress = ((currentStep + 1) / LESSONS.length) * 100;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#1a2a6c] bg-gradient-to-b from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] flex items-center justify-center p-6 font-sans text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 text-center max-w-md w-full shadow-2xl"
        >
          <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
          <h1 className="text-4xl font-bold mb-4">Շնորհավորում ենք!</h1>
          <p className="text-xl opacity-90 mb-8">Դուք ավարտեցիք A0 մակարդակի իսպաներենի դասընթացը:</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white text-[#b21f1f] rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg"
          >
            Սկսել նորից
          </button>
        </motion.div>
      </div>
    );
  }

  if (lives === 0) {
    return (
      <div className="min-h-screen bg-[#1a2a6c] flex items-center justify-center p-6 font-sans text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 text-center max-w-md w-full"
        >
          <XCircle className="w-24 h-24 mx-auto mb-6 text-red-400" />
          <h1 className="text-4xl font-bold mb-4">Խաղն ավարտվեց</h1>
          <p className="text-xl opacity-90 mb-8">Դուք սպառել եք ձեր բոլոր կյանքերը:</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white text-[#1a2a6c] rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all"
          >
            Փորձել նորից
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#0f172a_100%)] flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <header className="p-6 flex items-center gap-4 max-w-2xl mx-auto w-full">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6 opacity-60" />
        </button>
        
        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.5)]"
          />
        </div>

        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <span className="font-bold text-lg">{lives}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-4 max-w-2xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="w-full flex flex-col items-center"
          >
            {/* Icon / Avatar Area */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
                {currentLesson.type === 'theory' ? (
                  <Lightbulb className="w-12 h-12 text-white" />
                ) : (
                  <Volume2 className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black font-bold text-xs px-2 py-1 rounded-full shadow-lg">
                {currentStep + 1}
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl font-bold text-center mb-2 text-blue-100">
              {currentLesson.type === 'theory' ? 'Գրամատիկա' : 'Հավաքեք նախադասությունը'}
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl w-full text-center mb-12 shadow-xl">
              <p className="text-xl font-medium mb-1">{currentLesson.question}</p>
              {currentLesson.type === 'theory' && (
                <p className="text-blue-300 italic text-sm">{currentLesson.translation}</p>
              )}
            </div>

            {/* Theory Content */}
            {currentLesson.type === 'theory' ? (
              <div className="w-full space-y-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <pre className="font-sans whitespace-pre-wrap text-lg leading-relaxed text-blue-50">
                    {currentLesson.theoryText}
                  </pre>
                </div>
                <div className="flex gap-4 items-start bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                  <Lightbulb className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {currentLesson.grammarRule}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Result Area */}
                <div className="w-full min-h-[120px] border-b-2 border-white/10 flex flex-wrap content-start gap-2 mb-12 py-4">
                  {selectedWords.map((word, idx) => (
                    <motion.button
                      layoutId={word.id}
                      key={word.id}
                      onClick={() => handleWordClick(word)}
                      className="bg-white text-[#0f172a] px-4 py-2.5 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-50 transition-colors"
                    >
                      {word.text}
                    </motion.button>
                  ))}
                </div>

                {/* Word Bank */}
                <div className="flex flex-wrap justify-center gap-3 w-full">
                  {availableWords.map((word) => (
                    <div key={word.id} className="relative">
                      {/* Placeholder */}
                      <div className="bg-white/5 border border-dashed border-white/20 px-4 py-2.5 rounded-xl text-transparent font-bold text-lg select-none">
                        {word.text}
                      </div>
                      
                      {/* Actual Word Button */}
                      {!word.isSelected && (
                        <motion.button
                          layoutId={word.id}
                          onClick={() => handleWordClick(word)}
                          className="absolute inset-0 bg-white text-[#0f172a] px-4 py-2.5 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-50 transition-all active:scale-95"
                        >
                          {word.text}
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Action Button */}
      <footer className="p-6 max-w-2xl mx-auto w-full">
        <button 
          onClick={checkAnswer}
          disabled={currentLesson.type === 'sentence' && selectedWords.length === 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl uppercase tracking-wider
            ${(currentLesson.type === 'sentence' && selectedWords.length === 0) 
              ? 'bg-white/10 text-white/30 cursor-not-allowed' 
              : 'bg-[#38bdf8] text-white hover:bg-[#0ea5e9] active:scale-[0.98]'
            }`}
        >
          {currentLesson.type === 'theory' ? 'Հասկացա' : 'Ստուգել'}
        </button>
      </footer>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className={`fixed bottom-0 left-0 right-0 p-8 pb-12 z-50 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]
              ${showFeedback === 'correct' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}
          >
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl">
                  {showFeedback === 'correct' ? (
                    <CheckCircle2 className="w-8 h-8 text-[#22c55e]" />
                  ) : (
                    <XCircle className="w-8 h-8 text-[#ef4444]" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {showFeedback === 'correct' ? 'Ճիշտ է!' : 'Սխալ է'}
                  </h3>
                  <p className="text-white/90 font-medium">
                    {showFeedback === 'correct' 
                      ? 'Գերազանց աշխատանք:' 
                      : `Ճիշտ տարբերակը՝ ${currentLesson.translation}`}
                  </p>
                </div>
              </div>
              <button 
                onClick={nextStep}
                className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-lg"
              >
                Շարունակել
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
