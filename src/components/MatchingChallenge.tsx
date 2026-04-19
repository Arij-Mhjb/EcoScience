// MatchingChallenge — "ماذا يصبح هذا الشيء؟" — 20 نقطة
// Interaction par clic : sélection gauche → appariement droite, codage couleur par paire
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";

interface ChallengeResult {
  score: number;
  errors: number;
}

interface MatchingChallengeProps {
  onComplete: (result: ChallengeResult) => void;
}

const LEFT_ITEMS = [
  { id: "L1", label: "أوراق قديمة", emoji: "📄" },
  { id: "L2", label: "زجاجة زجاج", emoji: "🫙" },
  { id: "L3", label: "علبة معدنية", emoji: "🥫" },
  { id: "L4", label: "زجاجة بلاستيك", emoji: "🧴" },
] as const;

const RIGHT_ITEMS = [
  { id: "R3", label: "علبة معدنية جديدة", emoji: "✨🥫" },
  { id: "R1", label: "كراسة جديدة", emoji: "✨📓" },
  { id: "R4", label: "منتج بلاستيكي جديد", emoji: "✨🧴" },
  { id: "R2", label: "زجاجة جديدة", emoji: "✨🫙" },
] as const;

type LeftId = (typeof LEFT_ITEMS)[number]["id"];
type RightId = (typeof RIGHT_ITEMS)[number]["id"];

const CORRECT_PAIRS: Record<LeftId, RightId> = {
  L1: "R1",
  L2: "R2",
  L3: "R3",
  L4: "R4",
};

// Couleurs associées à chaque left item (index 0-3)
const PAIR_COLORS = [
  "bg-blue-100 border-blue-400",
  "bg-green-100 border-green-400",
  "bg-orange-100 border-orange-400",
  "bg-pink-100 border-pink-400",
] as const;

export default function MatchingChallenge({
  onComplete,
}: MatchingChallengeProps) {
  const [selectedLeft, setSelectedLeft] = useState<LeftId | null>(null);
  // pairs : leftId → rightId
  const [pairs, setPairs] = useState<Partial<Record<LeftId, RightId>>>({});
  const [verified, setVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);

  const pairCount = Object.keys(pairs).length;
  const allPaired = pairCount === LEFT_ITEMS.length;

  /* ── Helpers ── */
  const getLeftIndex = (leftId: LeftId): number =>
    LEFT_ITEMS.findIndex((i) => i.id === leftId);

  // Retrouver quel leftId est apparié à ce rightId
  const getLeftForRight = (rightId: RightId): LeftId | null =>
    (Object.entries(pairs) as [LeftId, RightId][]).find(
      ([, rId]) => rId === rightId,
    )?.[0] ?? null;

  /* ── Handlers ── */
  const handleLeftClick = (leftId: LeftId) => {
    if (verified) return;

    // Désélectionner si déjà sélectionné
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
      return;
    }

    // Si cet item est déjà apparié → dissocier puis sélectionner pour ré-appariement
    if (pairs[leftId]) {
      setPairs((prev) => {
        const next = { ...prev };
        delete next[leftId];
        return next;
      });
    }

    setSelectedLeft(leftId);
  };

  const handleRightClick = (rightId: RightId) => {
    if (verified) return;

    const existingLeft = getLeftForRight(rightId);

    if (!selectedLeft) {
      // Pas de sélection active : clic sur un item déjà apparié → dissocier
      if (existingLeft) {
        setPairs((prev) => {
          const next = { ...prev };
          delete next[existingLeft];
          return next;
        });
      }
      return;
    }

    // Un left est sélectionné → créer la paire
    setPairs((prev) => {
      const next = { ...prev };
      // Libérer l'éventuelle ancienne association du right cible
      if (existingLeft) delete next[existingLeft];
      next[selectedLeft] = rightId;
      return next;
    });
    setSelectedLeft(null);
  };

  const handleVerify = () => {
    let correct = 0;
    let err = 0;
    LEFT_ITEMS.forEach((item) => {
      if (pairs[item.id] === CORRECT_PAIRS[item.id]) correct++;
      else err++;
    });
    setScore(correct * 5);
    setErrors(err);
    setVerified(true);
  };

  /* ── Classes dynamiques ── */
  const getLeftClass = (leftId: LeftId): string => {
    if (verified) {
      return pairs[leftId] === CORRECT_PAIRS[leftId]
        ? "border-2 border-success bg-success/10"
        : "border-2 border-red-400 bg-red-50";
    }
    if (selectedLeft === leftId) {
      return "border-2 border-primary bg-primary-50 ring-2 ring-primary ring-offset-2 scale-105";
    }
    if (pairs[leftId]) {
      const idx = getLeftIndex(leftId);
      return `border-2 ${PAIR_COLORS[idx]}`;
    }
    return "border-2 border-gray-200 bg-white hover:border-primary hover:bg-primary-50";
  };

  const getRightClass = (rightId: RightId): string => {
    if (verified) {
      const leftId = getLeftForRight(rightId);
      if (!leftId) return "border-2 border-gray-200 bg-gray-50 opacity-40";
      return pairs[leftId] === CORRECT_PAIRS[leftId]
        ? "border-2 border-success bg-success/10"
        : "border-2 border-red-400 bg-red-50";
    }
    const leftId = getLeftForRight(rightId);
    if (leftId) {
      const idx = getLeftIndex(leftId);
      return `border-2 ${PAIR_COLORS[idx]}`;
    }
    return `border-2 border-gray-200 bg-white ${
      selectedLeft
        ? "hover:border-primary hover:bg-primary-50 cursor-pointer"
        : "cursor-default"
    }`;
  };

  /* ── Tortue ── */
  const turtleMood = verified ? (score >= 16 ? "happy" : "thinking") : "idle";

  const turtleMessage = verified
    ? score >= 16
      ? `رائع! حصلت على ${score} نقطة! ♻️✨`
      : `أحسنت! حصلت على ${score} نقطة! كل مادة لها مستقبل 💪`
    : selectedLeft
      ? "الآن اختر ما تصبح عليه! ✨"
      : "اختر مادة من اليسار ثم طابقها بما تصبح! 🔄";

  const selectedLeftData = LEFT_ITEMS.find((i) => i.id === selectedLeft);

  /* ── Render ── */
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl md:text-2xl font-black text-primary-800">
          ماذا يصبح هذا الشيء؟
        </h2>
        {!verified ? (
          <span className="text-sm font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full">
            {pairCount}/4 ✓
          </span>
        ) : (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="font-bold text-white bg-primary px-4 py-1.5 rounded-full text-lg"
          >
            {score}/20 ⭐
          </motion.span>
        )}
      </div>

      {/* ── Tortue ── */}
      <div className="flex justify-center mb-5">
        <Turtle mood={turtleMood} message={turtleMessage} size="sm" />
      </div>

      {/* ── Indicateur de sélection active ── */}
      <AnimatePresence>
        {selectedLeft && !verified && (
          <motion.div
            key="selected-indicator"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4
                       bg-primary-50 border-2 border-primary rounded-kid px-4 py-2"
          >
            <span className="text-2xl">{selectedLeftData?.emoji}</span>
            <span className="font-bold text-primary text-base">
              {selectedLeftData?.label}
            </span>
            <span className="text-primary-600 text-sm">
              — اختر ما تصبح عليه 👈
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Zone d'appariement ── */}
      <div className="bg-white rounded-kid shadow-kid p-4 sm:p-5 mb-5">
        {/* Instruction contextuelle */}
        {!verified && (
          <p className="text-xs text-center text-gray-400 mb-4 font-medium">
            {selectedLeft
              ? `✅ اخترت: ${selectedLeftData?.emoji} — انقر على المنتج الجديد المقابل في اليمين`
              : "انقر على مادة من اليسار، ثم انقر على ما تصبح عليه من اليمين"}
          </p>
        )}

        <div className="flex gap-3 sm:gap-5">
          {/* ── Colonne gauche : matières originales ── */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <h3 className="font-bold text-center text-sm text-gray-500 pb-1 border-b border-gray-100">
              ♻️ المادة الأصلية
            </h3>

            {LEFT_ITEMS.map((item) => {
              const isPaired = !!pairs[item.id];
              const idx = getLeftIndex(item.id);

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleLeftClick(item.id)}
                  whileHover={!verified ? { scale: 1.03 } : {}}
                  whileTap={!verified ? { scale: 0.97 } : {}}
                  className={`p-3 rounded-kid transition-all duration-200 w-full
                              flex items-center gap-2 text-right select-none
                              ${getLeftClass(item.id)}`}
                >
                  <span className="text-2xl flex-shrink-0 leading-none">
                    {item.emoji}
                  </span>
                  <span className="font-semibold text-sm flex-1 text-right leading-tight">
                    {item.label}
                  </span>

                  {/* Pastille couleur de paire (hors vérification) */}
                  {!verified && isPaired && (
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 border ${PAIR_COLORS[
                        idx
                      ]
                        .replace("bg-", "bg-")
                        .split(" ")[0]
                        .replace("bg-", "bg-")}`}
                      style={{}}
                    />
                  )}

                  {/* Badge résultat */}
                  {verified && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        delay: 0.1,
                      }}
                      className="text-lg flex-shrink-0 leading-none"
                    >
                      {pairs[item.id] === CORRECT_PAIRS[item.id] ? "✅" : "❌"}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* ── Séparateur central avec indicateurs de paires ── */}
          <div className="flex flex-col items-center justify-around pt-9 pb-1 gap-1 flex-shrink-0">
            {LEFT_ITEMS.map((item) => {
              const isPaired = !!pairs[item.id];
              const isCorrect =
                verified && pairs[item.id] === CORRECT_PAIRS[item.id];
              const isWrong = verified && isPaired && !isCorrect;

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    opacity: isPaired ? 1 : 0.2,
                    scaleX: isPaired ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-0.5 w-6 sm:w-8 rounded-full transition-colors duration-300 ${
                    isCorrect
                      ? "bg-success"
                      : isWrong
                        ? "bg-red-400"
                        : isPaired
                          ? "bg-primary-300"
                          : "bg-gray-200"
                  }`}
                />
              );
            })}
          </div>

          {/* ── Colonne droite : produits recyclés (ordre mélangé) ── */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <h3 className="font-bold text-center text-sm text-gray-500 pb-1 border-b border-gray-100">
              ✨ تصبح
            </h3>

            {RIGHT_ITEMS.map((item) => {
              const pairedLeftId = getLeftForRight(item.id);
              const idx = pairedLeftId ? getLeftIndex(pairedLeftId) : -1;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleRightClick(item.id)}
                  whileHover={!verified ? { scale: 1.03 } : {}}
                  whileTap={!verified ? { scale: 0.97 } : {}}
                  className={`p-3 rounded-kid transition-all duration-200 w-full
                              flex items-center gap-2 text-right select-none
                              ${getRightClass(item.id)}`}
                >
                  <span className="text-xl flex-shrink-0 leading-none">
                    {item.emoji}
                  </span>
                  <span className="font-semibold text-sm flex-1 text-right leading-tight">
                    {item.label}
                  </span>

                  {/* Pastille couleur de paire (hors vérification) */}
                  {!verified && pairedLeftId && idx >= 0 && (
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${PAIR_COLORS[idx].split(" ")[0]}`}
                    />
                  )}

                  {/* Badge résultat */}
                  {verified && pairedLeftId && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        delay: 0.15,
                      }}
                      className="text-lg flex-shrink-0 leading-none"
                    >
                      {pairs[pairedLeftId] === CORRECT_PAIRS[pairedLeftId]
                        ? "✅"
                        : "❌"}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Compteur de paires */}
        {!verified && pairCount > 0 && (
          <p className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-gray-100">
            {pairCount} من 4 أزواج محددة
            {allPaired && " — جاهز للتحقق! ✅"}
          </p>
        )}

        {/* Légende couleurs */}
        {!verified && pairCount > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {LEFT_ITEMS.map((item) => {
              if (!pairs[item.id]) return null;
              const idx = getLeftIndex(item.id);
              const pairedRight = RIGHT_ITEMS.find(
                (r) => r.id === pairs[item.id],
              );
              return (
                <span
                  key={item.id}
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PAIR_COLORS[idx]}`}
                >
                  {item.emoji} ↔ {pairedRight?.emoji}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bouton Vérifier ── */}
      <AnimatePresence>
        {!verified && allPaired && (
          <motion.div
            key="verify-btn"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="flex justify-center mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerify}
              className="btn-primary"
            >
              التحقق ✅
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Résultats ── */}
      <AnimatePresence>
        {verified && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Bannière score */}
            <div
              className={`rounded-kid p-5 text-center border-2
                ${
                  score >= 16
                    ? "bg-success/10 border-success"
                    : "bg-orange-50 border-orange-300"
                }`}
            >
              <p className="text-4xl mb-1">{score >= 16 ? "🎉" : "💪"}</p>
              <p className="font-black text-xl text-gray-800 mb-1">
                {score >= 16
                  ? "ممتاز! أنت بطل إعادة التدوير!"
                  : "جيد! تعلّمنا معاً!"}
              </p>
              <p className="text-gray-500 text-sm">
                {LEFT_ITEMS.length - errors} أزواج صحيحة من {LEFT_ITEMS.length}
              </p>
            </div>

            {/* Corrections */}
            {errors > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-red-50 border border-red-200 rounded-kid p-4"
              >
                <p className="font-bold text-red-700 mb-3 text-right">
                  📌 الأزواج الصحيحة:
                </p>
                <div className="space-y-2">
                  {LEFT_ITEMS.filter(
                    (item) => pairs[item.id] !== CORRECT_PAIRS[item.id],
                  ).map((item) => {
                    const correctRight = RIGHT_ITEMS.find(
                      (r) => r.id === CORRECT_PAIRS[item.id],
                    );
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm text-red-600 justify-end flex-wrap"
                      >
                        <span className="font-semibold">
                          {correctRight?.label}
                        </span>
                        <span className="text-base">{correctRight?.emoji}</span>
                        <span className="text-gray-400 text-xs">←</span>
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-base">{item.emoji}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Bouton Terminer */}
            <div className="flex justify-center">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete({ score, errors })}
                className="btn-primary"
              >
                إنهاء التحدي 🏁
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
