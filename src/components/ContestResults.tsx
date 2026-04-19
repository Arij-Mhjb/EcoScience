// ContestResults — Résultats finaux du concours EcoScience
// Ring SVG animé · Tortue morale · 12 confetti · Auto-save · Grille scores
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "@/components/Turtle";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ContestResultsProps {
  totalScore: number; // sur 100
  timeSpent: number; // secondes
  totalErrors: number;
  contestId: string;
}

type TurtleMood =
  | "idle"
  | "happy"
  | "sad"
  | "thinking"
  | "waving"
  | "celebrating";

/* ─── Helpers ────────────────────────────────────────────────────────────── */


function getTurtleConfig(score: number): { mood: TurtleMood; message: string } {
  if (score >= 90)
    return { mood: "celebrating", message: "أنت بطل البيئة! 🏆🐢" };
  if (score >= 70)
    return { mood: "happy", message: "عمل رائع! استمر في حماية الكوكب! ⭐🐢" };
  if (score >= 50)
    return { mood: "waving", message: "مجهود جيد! أنت صديق للبيئة! 💚🐢" };
  return { mood: "happy", message: "مغامرة ممتعة! شكراً لمساعدتك في حماية بيئتنا! 🌊🐢" };
}

function getRingColor(score: number): string {
  if (score >= 90) return "#fbbf24"; // sand — or
  if (score >= 70) return "#7ed957"; // success — vert
  if (score >= 50) return "#0ea5e9"; // ocean — bleu
  return "#fb7185"; // coral — rouge
}

function getScoreTailwind(score: number): string {
  if (score >= 90) return "text-sand";
  if (score >= 70) return "text-success";
  if (score >= 50) return "text-ocean-light";
  return "text-coral";
}

/* ─── Confetti ───────────────────────────────────────────────────────────── */

const CONFETTI_EMOJIS = [
  "🎉",
  "⭐",
  "🌟",
  "🎊",
  "✨",
  "🏆",
  "🌱",
  "♻️",
  "🐢",
  "💚",
  "🌊",
  "🎯",
] as const;

function ConfettiLayer() {
  return (
    <>
      {CONFETTI_EMOJIS.map((emoji, i) => {
        const leftPct = (i / CONFETTI_EMOJIS.length) * 100;
        const xDrift = i % 2 === 0 ? 55 : -55;
        const duration = 3.2 + (i % 4) * 0.8;
        const delay = (i * 0.38) % 2.6;
        const rot = i % 2 === 0 ? 360 : -360;

        return (
          <motion.span
            key={i}
            aria-hidden="true"
            className="fixed text-2xl pointer-events-none select-none z-50"
            style={{ left: `${leftPct}%`, top: "-5%" }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, xDrift],
              rotate: [0, rot],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear",
              times: [0, 0.08, 0.88, 1],
            }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </>
  );
}


/* ─── ScoreRing ──────────────────────────────────────────────────────────── */

interface ScoreRingProps {
  ringColor: string;
  textColor: string;
}

function ScoreRing({ ringColor, textColor }: ScoreRingProps) {
  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 439.8
  const dashOffset = 0; // 100% filled

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.3 }}
      className="relative flex items-center justify-center"
      style={{ width: 176, height: 176 }}
    >
      <svg
        width="176"
        height="176"
        viewBox="0 0 176 176"
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Piste de fond */}
        <circle
          cx="88"
          cy="88"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="14"
        />
        {/* Halo coloré (faible opacité) */}
        <circle
          cx="88"
          cy="88"
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth="14"
          opacity="0.18"
        />
        {/* Arc de progression animé */}
        <motion.circle
          cx="88"
          cy="88"
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE}`}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.6, delay: 0.55, ease: "easeOut" }}
        />
      </svg>

      {/* Texte centré */}
      <div className="relative z-10 flex flex-col items-center justify-center leading-none mt-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={`text-5xl font-black tabular-nums drop-shadow-lg ${textColor}`}
        >
          100%
        </motion.span>
        <span className="text-white/70 text-sm font-semibold mt-1">مكتمل</span>
      </div>
    </motion.div>
  );
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function ContestResults({
  totalScore,
  timeSpent,
  totalErrors,
  contestId,
}: ContestResultsProps) {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const { mood, message } = getTurtleConfig(totalScore);
  const ringColor = getRingColor(totalScore);
  const scoreTailwind = getScoreTailwind(totalScore);

  /* ── Auto-save au montage ── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/contest-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contestId,
            score: totalScore,
            timeSpent,
            errors: totalErrors,
            quizAnswers: [],
            challengeAnswers: [],
          }),
        });
        if (!cancelled) {
          if (res.ok) {
            setSaved(true);
          } else {
            setSaveError(true);
          }
        }
      } catch {
        if (!cancelled) setSaveError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Rendu ── */
  return (
    <div className="min-h-screen bg-ocean-gradient relative overflow-hidden flex flex-col items-center py-10 px-4">
      {/* Confetti */}
      <ConfettiLayer />

      {/* Carte principale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.1 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center gap-6"
      >
        {/* ── Titre ── */}
        <motion.h1
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-black text-white drop-shadow-lg text-center"
        >
          🎉 لقد أكملت المغامرة بنجاح!
        </motion.h1>

        {/* ── Ring score ── */}
        <ScoreRing
          ringColor={ringColor}
          textColor={scoreTailwind}
        />

        {/* ── Tortue mascotte ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Turtle mood={mood} message={message} size="md" />
        </motion.div>





        {/* ── Statut de sauvegarde ── */}
        <AnimatePresence>
          {(saved || saveError) && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-xs text-center pb-6 ${
                saveError ? "text-coral/80" : "text-white/50"
              }`}
            >
              {saved
                ? "✅ تم حفظ نتائجك بنجاح"
                : "⚠️ تعذّر حفظ النتائج — تحقق من اتصالك"}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
