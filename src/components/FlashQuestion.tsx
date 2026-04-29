"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "@/components/Turtle";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Interfaces ─────────────────────────────────────────────────────────── */
interface FlashQuestionProps {
  contestId?: string;
  onComplete: () => void;
}

/* ─── Timing ───────────────────────────────────────────────────────────── */
const FEEDBACK_DELAY = 2500;

export default function FlashQuestion({ onComplete, contestId }: FlashQuestionProps) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  
  const [selected, setSelected] = useState<number | null>(null);

  const isClimateChange = contestId === '69e51153482488070228f2ce';

  const QUESTION = isClimateChange
    ? (isAr ? "ما الذي يُساعد الكوكب؟" : "Qu'est-ce qui aide la planète ?")
    : (isAr ? "حصلت الزجاجة على حياة جديدة لأنها :" : "La bouteille a eu une nouvelle vie parce qu'elle :");

  const OPTIONS = isClimateChange
    ? (isAr 
        ? ["زراعة الأشجار ✅", "رمي النفايات", "تبذير الماء"]
        : ["Planter des arbres ✅", "Jeter des déchets", "Gaspiller l'eau"])
    : (isAr 
        ? ["فُرزت بشكل صحيح ✅", "أُخفيت", "دُفنت في الفناء"]
        : ["A été triée correctement ✅", "A été cachée", "A été enterrée"]);
    
  const CORRECT_INDEX = 0;
  const LABELS = isAr ? ["أ", "ب", "ج"] : ["A", "B", "C"];

  const answered = selected !== null;
  const isCorrect = selected === CORRECT_INDEX;

  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(onComplete, FEEDBACK_DELAY);
    return () => clearTimeout(t);
  }, [answered, onComplete]);

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  const turtleMood = !answered ? "thinking" : isCorrect ? "happy" : "sad";

  const turtleMessage = isAr
    ? (!answered 
        ? (isClimateChange ? "سؤال سريع... كيف نحمي الأرض؟ 🤔" : "فكّر جيداً... ماذا حدث للزجاجة؟ 🤔")
        : (isClimateChange ? "💡 هل تعلم؟ زراعة الأشجار تساعد الكوكب على التنفس!" : "💡 هل تعلم؟ فرز النفايات يساعد في إعادة تدويرها!"))
    : (!answered 
        ? (isClimateChange ? "Question rapide... Comment protéger la Terre ? 🤔" : "Réfléchis bien... Qu'est-il arrivé à la bouteille ? 🤔")
        : (isClimateChange ? "💡 Le savais-tu ? Planter des arbres aide la planète à respirer !" : "💡 Le savais-tu ? Trier les déchets aide au recyclage !"));

  const getOptionClass = (i: number): string => {
    const base = `w-full p-4 rounded-kid font-semibold text-lg transition-all duration-300 flex items-center gap-3 border-2 outline-none ${isAr ? 'text-right' : 'text-left'} `;
    if (!answered) return base + " bg-white/15 border-white/25 text-white hover:bg-white/28 hover:border-white/55 cursor-pointer";
    if (i === CORRECT_INDEX) return base + " bg-green-100 border-green-500 text-green-800 cursor-default";
    if (i === selected) return base + " bg-red-100 border-red-500 text-red-800 cursor-default";
    return base + " bg-white/8 border-white/15 text-white/38 cursor-default";
  };

  const getLabelClass = (i: number): string => {
    const base = "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors duration-300 ";
    if (!answered) return base + " bg-white/25 text-white";
    if (i === CORRECT_INDEX) return base + " bg-green-500 text-white";
    if (i === selected) return base + " bg-red-500 text-white";
    return base + " bg-white/15 text-white/38";
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="fixed inset-0 z-50 bg-ocean-gradient flex items-center justify-center px-4 font-cairo">
      <motion.div initial={{ opacity: 0, y: 32, scale: 0.93 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-xl glass rounded-kid shadow-kid p-6 md:p-8 flex flex-col gap-5">
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={turtleMood} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.3 }}>
              <Turtle mood={turtleMood} message={turtleMessage} size="md" showBubble />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/50 text-sm font-bold">{isAr ? 'سؤال سريع ⚡' : 'Question Flash ⚡'}</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed">
          {QUESTION}
        </motion.h2>

        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt, i) => (
            <motion.button key={i} whileHover={!answered ? { scale: 1.02 } : {}} whileTap={!answered ? { scale: 0.97 } : {}} onClick={() => handleSelect(i)} disabled={answered} className={getOptionClass(i)}>
              <span className={getLabelClass(i)}>{LABELS[i]}</span>
              <span className="flex-1 leading-snug">{opt}</span>
              <AnimatePresence>
                {answered && i === CORRECT_INDEX && (
                  <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} className="text-xl">✅</motion.span>
                )}
                {answered && i === selected && i !== CORRECT_INDEX && (
                  <motion.span initial={{ scale: 0, rotate: 30 }} animate={{ scale: 1, rotate: 0 }} className="text-xl">❌</motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-kid p-4 flex items-center justify-center gap-3 font-bold text-lg text-white border ${isCorrect ? "bg-green-500/25 border-green-400/50" : "bg-red-500/25 border-red-400/50"}`}>
              <span className="text-2xl">{isCorrect ? "🎉" : "💪"}</span>
              <span>
                {isCorrect
                  ? (isAr ? "إجابة رائعة! أحسنت! 🌟" : "Superbe réponse ! Bravo ! 🌟")
                  : (isAr ? `لا بأس، الجواب الصحيح هو: ${OPTIONS[CORRECT_INDEX]}` : `Pas grave, la bonne réponse était : ${OPTIONS[CORRECT_INDEX]}`)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {answered && (
          <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
            <motion.div className={`h-full ${isCorrect ? "bg-success" : "bg-red-400"}`} initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: FEEDBACK_DELAY / 1000, ease: "linear" }} />
          </div>
        )}

        <p className="text-white/38 text-xs text-center leading-relaxed">
          {isAr ? 'هذا السؤال لا يُحتسب في النتيجة النهائية' : 'Cette question ne compte pas pour le score final'}
        </p>
      </motion.div>
    </div>
  );
}

