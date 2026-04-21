"use client";

// ════════════════════════════════════════════════════════════════════════
// FlashQuestion — سؤال سريع ما بعد الأنيميشن
// Question flash non-comptabilisée dans le score.
// Tortue réactive selon la réponse + auto-complete après 2.5 s.
// ════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "@/components/Turtle";

// ── Props ────────────────────────────────────────────────────────────────
interface FlashQuestionProps {
  onComplete: () => void;
}

// ── Contenu de la question ───────────────────────────────────────────────
const QUESTION = "حصلت الزجاجة على حياة جديدة لأنها :";

const OPTIONS = [
  "فُرزت بشكل صحيح ✅",
  "أُخفيت",
  "دُفنت في الفناء",
];

const CORRECT_INDEX = 0;
const LABELS = ["أ", "ب", "ج"];

// ── Timing ───────────────────────────────────────────────────────────────
const FEEDBACK_DELAY = 2500; // ms avant onComplete

// ════════════════════════════════════════════════════════════════════════
// Composant principal
// ════════════════════════════════════════════════════════════════════════

export default function FlashQuestion({ onComplete }: FlashQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  // Dérivés d'état
  const answered = selected !== null;
  const isCorrect = selected === CORRECT_INDEX;

  // ── Auto-complete 2.5 s après la réponse ────────────────────────────
  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(onComplete, FEEDBACK_DELAY);
    return () => clearTimeout(t);
  }, [answered, onComplete]);

  // ── Sélection d'une option ───────────────────────────────────────────
  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  // ── Humeur et message de la tortue ──────────────────────────────────
  const turtleMood = !answered ? "thinking" : isCorrect ? "happy" : "sad";

  const turtleMessage = !answered
    ? "فكّر جيداً... ماذا حدث للزجاجة؟ 🤔"
    : isCorrect
      ? "ممتاز! هذا هو الجواب الصحيح 🎉"
      : "لا بأس! الجواب الصحيح هو أ 💪";

  // ── Styles dynamiques des options ───────────────────────────────────
  const getOptionClass = (i: number): string => {
    const base =
      "w-full p-4 rounded-kid text-right font-semibold text-lg " +
      "transition-all duration-300 flex items-center gap-3 " +
      "border-2 outline-none focus-visible:ring-2 focus-visible:ring-white/50";

    if (!answered) {
      return (
        base +
        " bg-white/15 border-white/25 text-white " +
        "hover:bg-white/28 hover:border-white/55 cursor-pointer"
      );
    }

    if (i === CORRECT_INDEX) {
      return base + " bg-green-100 border-green-500 text-green-800 cursor-default";
    }

    if (i === selected) {
      return base + " bg-red-100 border-red-500 text-red-800 cursor-default";
    }

    return base + " bg-white/8 border-white/15 text-white/38 cursor-default";
  };

  // ── Styles des pastilles de label ───────────────────────────────────
  const getLabelClass = (i: number): string => {
    const base =
      "w-9 h-9 rounded-full flex items-center justify-center " +
      "text-sm font-bold flex-shrink-0 transition-colors duration-300";

    if (!answered) return base + " bg-white/25 text-white";
    if (i === CORRECT_INDEX) return base + " bg-green-500 text-white";
    if (i === selected) return base + " bg-red-500 text-white";
    return base + " bg-white/15 text-white/38";
  };

  // ────────────────────────────────────────────────────────────────────
  return (
    <div
      dir="rtl"
      className={
        "fixed inset-0 z-50 bg-ocean-gradient " +
        "flex items-center justify-center px-4 font-cairo"
      }
    >
      {/* ── Carte centrale ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={
          "w-full max-w-xl glass rounded-kid shadow-kid " +
          "p-6 md:p-8 flex flex-col gap-5"
        }
      >
        {/* ── Tortue réactive ── */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={turtleMood}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
            >
              <Turtle
                mood={turtleMood}
                message={turtleMessage}
                size="md"
                showBubble
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Séparateur décoratif ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/50 text-sm font-bold">سؤال سريع ⚡</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* ── Texte de la question ── */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className={
            "text-xl md:text-2xl font-bold text-white " +
            "text-center leading-relaxed"
          }
        >
          {QUESTION}
        </motion.h2>

        {/* ── Options ── */}
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
              whileHover={!answered ? { scale: 1.02 } : {}}
              whileTap={!answered ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={getOptionClass(i)}
            >
              {/* Pastille label */}
              <span className={getLabelClass(i)}>{LABELS[i]}</span>

              {/* Texte de l'option */}
              <span className="flex-1 text-right leading-snug">{opt}</span>

              {/* Icône de résultat */}
              <AnimatePresence>
                {answered && i === CORRECT_INDEX && (
                  <motion.span
                    key="ok"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-xl flex-shrink-0"
                  >
                    ✅
                  </motion.span>
                )}
                {answered && i === selected && i !== CORRECT_INDEX && (
                  <motion.span
                    key="ko"
                    initial={{ scale: 0, rotate: 30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-xl flex-shrink-0"
                  >
                    ❌
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* ── Bandeau de feedback ── */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className={
                "rounded-kid p-4 flex items-center justify-center gap-3 " +
                "font-bold text-lg text-white border " +
                (isCorrect
                  ? "bg-green-500/25 border-green-400/50"
                  : "bg-red-500/25 border-red-400/50")
              }
            >
              <span className="text-2xl">{isCorrect ? "🎉" : "💪"}</span>
              <span>
                {isCorrect
                  ? "إجابة رائعة! أحسنت! 🌟"
                  : "لا بأس، الجواب الصحيح هو: فُرزت بشكل صحيح ✅"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Barre de progression du délai (visible après réponse) ── */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-1 bg-white/15 rounded-full overflow-hidden"
            >
              <motion.div
                className={
                  "h-full rounded-full " +
                  (isCorrect ? "bg-success" : "bg-red-400")
                }
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: FEEDBACK_DELAY / 1000, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Note : question hors score ── */}
        <p className="text-white/38 text-xs text-center leading-relaxed">
          هذا السؤال لا يُحتسب في النتيجة النهائية
        </p>
      </motion.div>
    </div>
  );
}
