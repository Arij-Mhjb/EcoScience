"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";

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

/* ─── Data ───────────────────────────────────────────────────────────────── */

const QUESTIONS = [
  {
    text: "إعادة التدوير تعني :",
    options: [
      "إخفاء النفاية",
      "تحويل النفاية لصنع شيء جديد",
      "رمي الأشياء في الطبيعة",
    ],
    answer: 1,
    points: 3,
    tip: "إعادة التدوير تمنح المواد فائدة جديدة بدلاً من التخلي عنها",
  },
  {
    text: "أيّ من هذه الأشياء يذهب مع الورق/الكرتون؟",
    options: ["كراسة منتهية", "زجاجة زجاج", "علبة معدنية"],
    answer: 0,
    points: 3,
    tip: "الكراسة نفاية من نوع ورق/كرتون",
  },
  {
    text: "قبل رمي لعبة لا تزال في حالة جيدة، أفضل فكرة هي :",
    options: ["كسرها", "التبرع بها", "تركها في الخارج"],
    answer: 1,
    points: 3,
    tip: "الأشياء التي لا تزال صالحة يمكن أن تحصل على حياة ثانية عبر التبرع",
  },
  {
    text: "فرز النفايات يهدف أساساً إلى :",
    options: [
      "خلط النفايات",
      "المساعدة في إعادة التدوير والاستخدام",
      "ملء الشوارع",
    ],
    answer: 1,
    points: 3,
    tip: "الفرز يساعد على التقليل وإعادة الاستخدام والوقاية",
  },
  {
    text: "صح أم خطأ : كل أنواع البلاستيك تُعاد تدويرها بنفس الطريقة.",
    options: ["صح", "خطأ"],
    answer: 1,
    points: 3,
    tip: "البلاستيك أنواع مختلفة ولا تُعاد تدويرها جميعاً معاً",
  },
  {
    text: "أيّ فعل ينتج أقل نفايات؟",
    options: [
      "استخدام قارورة ماء معاد استخدامها",
      "شراء زجاجة تُرمى كل يوم",
      "استخدام أكواب للاستخدام مرة واحدة",
    ],
    answer: 0,
    points: 3,
    tip: "إعادة الاستخدام تقلل النفايات من المصدر",
  },
  {
    text: "قميص قديم لا يزال نظيفاً يمكن :",
    options: ["التبرع به", "رميه في الشارع", "إخفاؤه في الخزانة للأبد"],
    answer: 0,
    points: 3,
    tip: "التبرع أو البيع يمنح الملابس حياة ثانية",
  },
  {
    text: "إذا لم تجد سلة مهملات قريبة، ماذا تفعل بنفايتك الصغيرة؟",
    options: [
      "أرميها على الأرض",
      "أحتفظ بها حتى أجد سلة",
      "أضعها في زاوية الحائط",
    ],
    answer: 1,
    points: 3,
    tip: "نفاية صغيرة مرمية في الخارج تبقى ملوِّثة",
  },
  {
    text: "الشيء المكسور أحياناً يمكن :",
    options: ["إصلاحه", "ألا يفيد أبداً", "أن يتحول وحده"],
    answer: 0,
    points: 3,
    tip: "كثير من الأشياء خارج الاستخدام يمكن إصلاحها",
  },
  {
    text: "لماذا لا يجب رمي النفايات في الطبيعة؟",
    options: [
      "لأنها تلوّث وتؤذي الحيوانات",
      "لأنها تختفي في دقيقة",
      "لأنها تنقي الهواء",
    ],
    answer: 0,
    points: 3,
    tip: "النفايات المتروكة تلوّث البيئة وتضر بالكائنات الحية",
  },
  {
    text: "أيّ مادة يمكن إعادة تدويرها عدة مرات دون أن تفقد طبيعتها؟",
    options: ["الزجاج", "الخبز", "رمل الشاطئ"],
    answer: 0,
    points: 3,
    tip: "الزجاج مادة كلاسيكية لإعادة التدوير",
  },
  {
    text: "أفضل تصرف مع شيء لا تستخدمه بعد الآن هو أولاً :",
    options: [
      "البحث عن إعادة استخدامه أو التبرع به أو إصلاحه",
      "رميه فوراً",
      "تركه في الفناء",
    ],
    answer: 0,
    points: 3,
    tip: "الحياة الثانية والإصلاح وإعادة الاستخدام تسبق الرمي",
  },
  {
    text: "أفضل حقيبة للتسوق عدة مرات هي :",
    options: ["حقيبة قماشية", "حقيبة تُرمى فوراً", "غلاف ورقي مبلل"],
    answer: 0,
    points: 4,
    tip: "الحقيبة المعاد استخدامها تساعد على تقليل النفايات",
  },
  {
    text: "البطارية المستعملة يجب وضعها في :",
    options: ["صندوق جمع خاص", "الشارع", "أصيص الزهور"],
    answer: 0,
    points: 4,
    tip: "البطاريات نفايات خاصة لا تُخلط مع النفايات العادية",
  },
  {
    text: "أيّ وجبة خفيفة تنتج أقل نفايات؟",
    options: [
      "قارورة + علبة وجبة معاد استخدامها",
      "ثلاثة أغلفة فردية للاستخدام مرة واحدة",
      "مشروب بقشة وكوب للاستخدام مرة واحدة",
    ],
    answer: 0,
    points: 4,
    tip: "نقلل النفايات أكثر عند إعادة استخدام الأوعية",
  },
  {
    text: "برطمان زجاجي فارغ يمكن استخدامه لـ :",
    options: ["تخزين الأقلام أو الأزرار", "رميه في الطبيعة", "كسره عمداً"],
    answer: 0,
    points: 4,
    tip: "قبل إعادة التدوير، يمكن إعادة الاستخدام",
  },
  {
    text: "رمز الأسهم الثلاثة الدائرية يعني غالباً :",
    options: [
      "تحذير، شيء خطير",
      "فرز / إعادة التدوير ممكنة",
      "شيء ممنوع في المدرسة",
    ],
    answer: 1,
    points: 4,
    tip: "هذا الرمز يساعد الأطفال على التعرف على الفرز وإعادة التدوير",
  },
  {
    text: "بعد نشاط يدوي بالورق، التصرف الصحيح هو :",
    options: [
      "جمع قطع الورق وفرزها",
      "تركها على الأرض",
      "وضعها خارجاً في الفناء",
    ],
    answer: 0,
    points: 4,
    tip: "الفرز يبدأ بالتصرف الصحيح في الفصل",
  },
];

const LABELS = ["أ", "ب", "ج"];

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
  const renderContent = () => {
    switch (type) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: [-10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🐢
            </motion.div>
            <h2 className="text-2xl font-black text-primary-800 text-center">أنت رائع! استمر ✨</h2>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6 bg-primary-50 p-6 rounded-full shadow-kid"
            >
              💡
            </motion.div>
            <h2 className="text-2xl font-black text-amber-500 mb-2">هل تعلم؟</h2>
            <p className="text-xl font-bold text-primary-800 text-center leading-relaxed px-4">
              الزجاج يمكن إعادة تدويره إلى الأبد!
            </p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ x: [0, 60, 90], y: [0, -30, 0], rotate: [0, 180, 360], opacity: [1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-12"
            >
              🥤
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
              className="text-6xl absolute"
              style={{ right: "calc(50% - 130px)" }}
            >
              ♻️
            </motion.div>
            <h2 className="text-xl font-bold text-success-700 text-center mt-8">
              كل نفاية في مكانها الصحيح!
            </h2>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center w-full max-w-sm px-6">
            <h2 className="text-2xl font-black text-primary-800 mb-8 text-center">
              نقاطك ترتفع! ⭐
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: "30%" }}
                animate={{ width: "80%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-success-400 to-success-600"
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-4xl text-amber-400"
            >
              ✨ 🌟 ✨
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="sequence"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white rounded-kid shadow-kid p-8 md:p-12 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {renderContent()}

      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={onSkip}
            className="absolute bottom-6 left-6 text-gray-400 hover:text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-sm"
          >
            تخطي ⏩
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

  const q = QUESTIONS[currentQ];
  const total = QUESTIONS.length;
  const isLastQ = currentQ === total - 1;
  const isBonus = q.points === 4;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);

    const correct = idx === q.answer;
    const pts = correct ? q.points : 0;

    setScore((prev) => prev + pts);
    if (!correct) setErrors((prev) => prev + 1);

    setAnswers((prev) => {
      const newAnswers = [
        ...prev,
        { questionIndex: currentQ, selectedAnswer: idx, correct, points: pts },
      ];
      if (onProgress) {
        onProgress(newAnswers, score + pts, errors + (correct ? 0 : 1));
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
    if (!answered) {
      return "bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary-50 text-gray-700 cursor-pointer";
    }
    if (idx === selected) {
      return "bg-primary-50 border-2 border-primary text-primary-700 cursor-default";
    }
    return "bg-gray-50 border-2 border-gray-200 text-gray-400 cursor-default";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-success-50/30 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ── Header: timer + progress + score ── */}
        <div className="bg-white rounded-kid shadow-kid p-4 mb-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Timer */}
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-kid shrink-0"
            >
              <span>⏱️</span>
              <span className="font-mono tabular-nums" dir="ltr">
                {formatTime(timeSpent)}
              </span>
            </motion.div>

            {/* Question counter */}
            <div className="bg-primary-50 text-primary-700 border border-primary-100 px-4 py-1.5 rounded-full text-sm font-bold text-center">
              السؤال {currentQ + 1} من {total}
            </div>
          </div>

          {/* Progress bar segments */}
          <div className="flex gap-0.5">
            {QUESTIONS.map((_, i) => {
              let bg = "bg-gray-200";
              if (i < currentQ) {
                bg = "bg-primary-300"; // Neutral color for completed
              } else if (i === currentQ) {
                bg = "bg-primary";
              }
              return (
                <motion.div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors duration-300 ${bg}`}
                  animate={{ opacity: i === currentQ ? [0.6, 1, 0.6] : 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: i === currentQ ? Infinity : 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ── Question card or Sequence ── */}
        <AnimatePresence mode="wait">
          {sequenceActive ? (
            <SequenceView
              key="sequence"
              type={sequenceType}
              showSkip={showSkip}
              onSkip={skipSequence}
            />
          ) : (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="bg-white rounded-kid shadow-kid p-6 md:p-8">
              {/* Points badge */}
              <div className="flex justify-start mb-4">
                <motion.span
                  key={`pts-${currentQ}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                    isBonus
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : "bg-primary-50 text-primary-700 border border-primary-200"
                  }`}
                >
                  ⭐ {q.points} نقاط
                  {isBonus && (
                    <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full mr-1">
                      مكافأة
                    </span>
                  )}
                </motion.span>
              </div>

              {/* Question text */}
              <h2 className="text-xl md:text-2xl font-bold text-primary-800 mb-6 leading-relaxed text-center">
                {q.text}
              </h2>

              {/* Options */}
              <div className="grid gap-3 mb-4">
                {q.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`w-full p-4 rounded-kid font-semibold text-right transition-all duration-200 flex items-center gap-3 ${optionClass(i)}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors duration-200 ${
                        !answered
                          ? "bg-primary-100 text-primary"
                          : i === selected
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {LABELS[i]}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </motion.button>
                ))}
              </div>

              {/* Feedback after answer */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Turtle reaction with tip */}
                    <AnimatePresence>
                      {showTurtle && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 18,
                          }}
                          className="flex justify-center mb-6"
                        >
                          <Turtle
                            mood="happy"
                            message={`شكراً على إجابتك! هل تعلم أن... 🐢 ${q.tip}`}
                            size="md"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Next button */}
                    <AnimatePresence>
                      {showNext && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleNext}
                            className="w-full btn-primary text-center py-3 text-lg"
                          >
                            {isLastQ ? "التالي ➡️" : "التالي ➡️"}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
