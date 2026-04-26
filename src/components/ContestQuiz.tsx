"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";
import { useLanguage } from "@/context/LanguageContext";
import { QUESTIONS_AR, QUESTIONS_FR } from "@/data/questions";

/* ─── Interfaces ─────────────────────────────────────────────────────────── */

interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  correct: boolean;
  points: number;
}

interface QuizResult {
  score: number;
  errors: number;
  timeSpent: number;
  answers: QuizAnswer[];
}

interface ContestQuizProps {
  timeSpent: number;
  initialAnswers?: QuizAnswer[];
  onComplete: (result: QuizResult) => void;
  onProgress?: (answers: QuizAnswer[], currentScore: number, currentErrors: number) => void;
}

export const QUESTIONS = QUESTIONS_AR;

const LABELS = ["A", "B", "C"];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Sequence Component ─────────────────────────────────────────────────── */

function SequenceView({
  type,
  showSkip,
  onSkip,
}: {
  type: number;
  showSkip: boolean;
  onSkip: () => void;
}) {
  const { t, locale } = useLanguage();
  const isAr = locale === 'ar';
  
  const renderContent = () => {
    switch (type) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <motion.div animate={{ rotate: [-10, 10, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-8xl mb-6">🐢</motion.div>
            <h2 className="text-2xl font-black text-primary-800 text-center">{isAr ? 'أنت رائع! استمر ✨' : 'Tu es génial ! Continue ✨'}</h2>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-6 bg-primary-50 p-6 rounded-full shadow-kid">💡</motion.div>
            <h2 className="text-2xl font-black text-amber-500 mb-2">{t('did_you_know')}</h2>
            <p className="text-xl font-bold text-primary-800 text-center leading-relaxed px-4">{isAr ? 'الزجاج يمكن إعادة تدويره إلى الأبد!' : 'Le verre peut être recyclé à l\'infini !'}</p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center">
            <motion.div animate={{ x: [0, 60, 90], y: [0, -30, 0], rotate: [0, 180, 360], opacity: [1, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-12">🥤</motion.div>
            <h2 className="text-xl font-bold text-success-700 text-center mt-8">{isAr ? 'كل نفاية في مكانها الصحيح!' : 'Chaque déchet à sa place !'}</h2>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center w-full max-w-sm px-6">
            <h2 className="text-2xl font-black text-primary-800 mb-8 text-center">{isAr ? 'نقاطك ترتفع! ⭐' : 'Tes points montent ! ⭐'}</h2>
            <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden relative shadow-inner">
              <motion.div initial={{ width: "30%" }} animate={{ width: "80%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-success-400 to-success-600" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="sequence" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="bg-white rounded-kid shadow-kid p-8 md:p-12 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {renderContent()}
      <AnimatePresence>
        {showSkip && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={onSkip}
            className={`absolute bottom-6 ${locale === 'ar' ? 'left-6' : 'right-6'} text-gray-400 hover:text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-sm`}
          >
            {isAr ? 'تخطي ⏩' : 'Passer ⏩'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ContestQuiz({
  timeSpent,
  initialAnswers = [],
  onComplete,
  onProgress,
}: ContestQuizProps) {
  const { t, locale } = useLanguage();
  const isAr = locale === 'ar';
  const QUESTIONS_LIST = useMemo(() => isAr ? QUESTIONS_AR : QUESTIONS_FR, [isAr]);
  
  const [currentQ, setCurrentQ] = useState(initialAnswers.length);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showTurtle, setShowTurtle] = useState(false);
  
  const [score, setScore] = useState(() => initialAnswers.reduce((a, b) => a + b.points, 0));
  const [errors, setErrors] = useState(() => initialAnswers.reduce((a, b) => a + (b.correct ? 0 : 1), 0));
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialAnswers);

  const [sequenceActive, setSequenceActive] = useState(false);
  const [sequenceType, setSequenceType] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const q = QUESTIONS_LIST[currentQ];
  const total = QUESTIONS_LIST.length;
  const isLastQ = currentQ === total - 1;
  const isBonus = q?.points === 4;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);

    const correct = idx === q.answer;
    const pts = correct ? q.points : 0;

    const newScore = score + pts;
    const newErrors = errors + (correct ? 0 : 1);

    setScore(newScore);
    if (!correct) setErrors(newErrors);

    setAnswers((prev) => {
      const newAnswers = [
        ...prev,
        { questionIndex: currentQ, questionText: q.text, selectedAnswer: idx, correct, points: pts },
      ];
      if (onProgress) {
        onProgress(newAnswers, newScore, newErrors);
      }
      return newAnswers;
    });

    setShowTurtle(true);
    setShowNext(true);
  };

  const skipSequence = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
    setSequenceActive(false);
    setCurrentQ((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
    setShowNext(false);
    setShowTurtle(false);
  }, []);

  const handleNext = () => {
    if (isLastQ) {
      onComplete({ score, errors, timeSpent, answers });
      return;
    }
    
    if ((currentQ + 1) % 3 === 0) {
      setSequenceType(Math.floor(Math.random() * 4));
      setSequenceActive(true);
      setShowSkip(false);
      skipTimeoutRef.current = setTimeout(() => setShowSkip(true), 2000);
      timeoutRef.current = setTimeout(skipSequence, 4000);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
      setShowNext(false);
      setShowTurtle(false);
    }
  };

  const optionClass = (idx: number): string => {
    if (!answered) return "bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary-50 text-gray-700 cursor-pointer";
    if (idx === selected) return "bg-primary-50 border-2 border-primary text-primary-700 cursor-default";
    return "bg-gray-50 border-2 border-gray-200 text-gray-400 cursor-default";
  };

  if (!q) return null;

  return (
    <div className="py-6 px-4 w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-kid shadow-kid p-4 mb-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-kid"
            >
              <span>⏱️</span> <span className="font-mono tabular-nums" dir="ltr">{formatTime(timeSpent)}</span>
            </motion.div>
            <div className="bg-primary-50 text-primary-700 border border-primary-100 px-4 py-1.5 rounded-full text-sm font-bold">
              {t('quiz_question')} {currentQ + 1} {t('quiz_of')} {total}
            </div>
          </div>
          <div className="flex gap-0.5">
            {QUESTIONS_LIST.map((_, i) => (
              <motion.div key={i} className={`h-2 flex-1 rounded-full ${i < currentQ ? 'bg-primary-300' : i === currentQ ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sequenceActive ? (
            <SequenceView key="sequence" type={sequenceType} showSkip={showSkip} onSkip={skipSequence} />
          ) : (
            <motion.div key={currentQ} initial={{ opacity: 0, x: locale === 'ar' ? 60 : -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: locale === 'ar' ? -60 : 60 }} transition={{ duration: 0.3 }}>
              <div className="bg-white rounded-kid shadow-kid p-6 md:p-8">
                <div className="flex justify-start mb-4">
                  <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isBonus ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-primary-50 text-primary-700 border border-primary-200'}`}>
                    ⭐ {q.points} {t('quiz_score')} {isBonus && <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full mr-1">Bonus</span>}
                  </motion.span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-800 mb-6 text-center">{q.text}</h2>
                <div className="grid gap-3 mb-4">
                  {q.options.map((opt, i) => (
                    <motion.button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={`w-full p-4 rounded-kid font-semibold ${locale === 'ar' ? 'text-right' : 'text-left'} flex items-center gap-3 ${optionClass(i)}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${!answered ? 'bg-primary-100 text-primary' : i === selected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {LABELS[i]}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </motion.button>
                  ))}
                </div>
                {answered && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex justify-center mb-6">
                      <Turtle mood="happy" message={`${locale === 'ar' ? 'شكراً! هل تعلم أن...' : 'Merci ! Le savais-tu...'} 🐢 ${q.tip}`} size="md" />
                    </div>
                    <button onClick={handleNext} className="w-full btn-primary py-3 text-lg">
                      {isLastQ ? t('quiz_finish') : t('quiz_next')} {locale === 'ar' ? '➡️' : '➡️'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
