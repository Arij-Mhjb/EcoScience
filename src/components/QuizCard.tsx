// Composant QuizCard — Carte de question interactive
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Turtle from './Turtle';

interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  tip: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export default function QuizCard({
  question, options, correctAnswer, tip,
  questionNumber, totalQuestions, onAnswer, onNext,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const correct = selected === correctAnswer;

  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    onAnswer(i === correctAnswer);
  };

  const handleNext = () => {
    setSelected(null);
    setAnswered(false);
    onNext();
  };

  const optClass = (i: number) => {
    if (!answered) return 'bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary-50 text-gray-700';
    if (i === correctAnswer) return 'bg-success/20 border-2 border-success text-success-800';
    if (i === selected) return 'bg-red-100 border-2 border-red-400 text-red-700';
    return 'bg-gray-100 border-2 border-gray-200 text-gray-400';
  };

  const labels = ['أ', 'ب', 'ج', 'د'];

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-primary bg-primary-50 px-4 py-2 rounded-full">
          السؤال {questionNumber} من {totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < questionNumber ? 'bg-primary' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-kid shadow-kid p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-primary-800 mb-8 leading-relaxed text-center">{question}</h2>

        <div className="grid gap-3 mb-6">
          {options.map((opt, i) => (
            <motion.button key={i} whileHover={!answered ? { scale: 1.02 } : {}} whileTap={!answered ? { scale: 0.98 } : {}}
              onClick={() => handleAnswer(i)} disabled={answered}
              className={`w-full p-4 rounded-kid text-right font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${optClass(i)}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${!answered ? 'bg-primary-100 text-primary' : i === correctAnswer ? 'bg-success text-white' : i === selected ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {labels[i]}
              </span>
              <span className="flex-1">{opt}</span>
              {answered && i === correctAnswer && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✅</motion.span>}
              {answered && i === selected && i !== correctAnswer && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>❌</motion.span>}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
              <div className={`p-4 rounded-kid mb-4 flex items-start gap-3 ${correct ? 'bg-success-50 border border-success-200' : 'bg-red-50 border border-red-200'}`}>
                <span className="text-3xl flex-shrink-0">{correct ? '🎉' : '💪'}</span>
                <div>
                  <p className={`font-bold text-lg mb-1 ${correct ? 'text-success-700' : 'text-red-600'}`}>
                    {correct ? 'إجابة صحيحة! أحسنت! 🌟' : 'حاول مرة أخرى! لا تستسلم 💪'}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">💡 <span className="font-semibold">هل تعلم؟</span> {tip}</p>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <Turtle mood={correct ? 'celebrating' : 'thinking'} message={correct ? 'رائع! أنت بطل! 🏆' : 'لا بأس! تعلمنا شيئا جديدا 📚'} size="sm" />
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} className="w-full btn-primary text-center">
                {questionNumber < totalQuestions ? 'السؤال التالي ➡️' : '🏁 إنهاء'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
