// MatchingChallenge — "ماذا يصبح هذا الشيء؟" — 20 نقطة
// Interaction par clic : sélection gauche → appariement droite, codage couleur par paire
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";
import { useLanguage } from "@/context/LanguageContext";

interface ChallengeResult {
  score: number;
  errors: number;
}

interface MatchingChallengeProps {
  onComplete: (result: ChallengeResult) => void;
}

const LEFT_DATA = [
  { id: "L1", ar: "أوراق قديمة", fr: "Vieux papiers", emoji: "📄" },
  { id: "L2", ar: "زجاجة زجاج", fr: "Bouteille en verre", emoji: "🫙" },
  { id: "L3", ar: "علبة معدنية", fr: "Boîte de conserve", emoji: "🥫" },
  { id: "L4", ar: "زجاجة بلاستيك", fr: "Bouteille plastique", emoji: "🧴" },
] as const;

const RIGHT_DATA = [
  { id: "R3", ar: "علبة معدنية جديدة", fr: "Nouvelle boîte", emoji: "✨🥫" },
  { id: "R1", ar: "كراسة جديدة", fr: "Nouveau cahier", emoji: "✨📓" },
  { id: "R4", ar: "منتج بلاستيكي جديد", fr: "Nouveau produit plastique", emoji: "✨🧴" },
  { id: "R2", ar: "زجاجة جديدة", fr: "Nouvelle bouteille", emoji: "✨🫙" },
] as const;

type LeftId = (typeof LEFT_DATA)[number]["id"];
type RightId = (typeof RIGHT_DATA)[number]["id"];

const CORRECT_PAIRS: Record<LeftId, RightId> = { L1: "R1", L2: "R2", L3: "R3", L4: "R4" };

const PAIR_COLORS = [
  "bg-blue-100 border-blue-400", "bg-green-100 border-green-400", "bg-orange-100 border-orange-400", "bg-pink-100 border-pink-400",
] as const;

export default function MatchingChallenge({
  onComplete,
}: MatchingChallengeProps) {
  const { t, locale } = useLanguage();
  const [selectedLeft, setSelectedLeft] = useState<LeftId | null>(null);
  const [pairs, setPairs] = useState<Partial<Record<LeftId, RightId>>>({});
  const [verified, setVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);

  const LEFT_ITEMS = useMemo(() => LEFT_DATA.map(i => ({ id: i.id, label: locale === 'ar' ? i.ar : i.fr, emoji: i.emoji })), [locale]);
  const RIGHT_ITEMS = useMemo(() => RIGHT_DATA.map(i => ({ id: i.id, label: locale === 'ar' ? i.ar : i.fr, emoji: i.emoji })), [locale]);

  const pairCount = Object.keys(pairs).length;
  const allPaired = pairCount === LEFT_ITEMS.length;

  const getLeftIndex = (leftId: LeftId): number => LEFT_ITEMS.findIndex((i) => i.id === leftId);
  const getLeftForRight = (rightId: RightId): LeftId | null =>
    (Object.entries(pairs) as [LeftId, RightId][]).find(([, rId]) => rId === rightId)?.[0] ?? null;

  const handleLeftClick = (leftId: LeftId) => {
    if (verified) return;
    if (selectedLeft === leftId) { setSelectedLeft(null); return; }
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
      if (existingLeft) {
        setPairs((prev) => {
          const next = { ...prev };
          delete next[existingLeft];
          return next;
        });
      }
      return;
    }
    setPairs((prev) => {
      const next = { ...prev };
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
      if (pairs[item.id as LeftId] === CORRECT_PAIRS[item.id as LeftId]) correct++;
      else err++;
    });
    setScore(correct * 5);
    setErrors(err);
    setVerified(true);
  };

  const getLeftClass = (leftId: LeftId): string => {
    if (verified) return pairs[leftId] === CORRECT_PAIRS[leftId] ? "border-2 border-success bg-success/10" : "border-2 border-red-400 bg-red-50";
    if (selectedLeft === leftId) return "border-2 border-primary bg-primary-50 ring-2 ring-primary ring-offset-2 scale-105";
    if (pairs[leftId]) { const idx = getLeftIndex(leftId); return `border-2 ${PAIR_COLORS[idx]}`; }
    return "border-2 border-gray-200 bg-white hover:border-primary hover:bg-primary-50";
  };

  const getRightClass = (rightId: RightId): string => {
    if (verified) {
      const leftId = getLeftForRight(rightId);
      if (!leftId) return "border-2 border-gray-200 bg-gray-50 opacity-40";
      return pairs[leftId] === CORRECT_PAIRS[leftId] ? "border-2 border-success bg-success/10" : "border-2 border-red-400 bg-red-50";
    }
    const leftId = getLeftForRight(rightId);
    if (leftId) { const idx = getLeftIndex(leftId); return `border-2 ${PAIR_COLORS[idx]}`; }
    return `border-2 border-gray-200 bg-white ${selectedLeft ? "hover:border-primary hover:bg-primary-50 cursor-pointer" : "cursor-default"}`;
  };

  const turtleMood = verified ? (score >= 16 ? "happy" : "thinking") : "idle";
  const turtleMessage = verified
    ? score >= 16 ? t('dd_excellent').replace('{score}', score.toString()) : t('dd_good').replace('{score}', score.toString())
    : selectedLeft ? t('mc_select_msg') : t('mc_start_msg');

  const selectedLeftData = LEFT_ITEMS.find((i) => i.id === selectedLeft);

  return (
    <div className="w-full max-w-3xl mx-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl md:text-2xl font-black text-primary-800">{t('mc_title')}</h2>
        {!verified ? (
          <span className="text-sm font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full">{pairCount}/4 ✓</span>
        ) : (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-bold text-white bg-primary px-4 py-1.5 rounded-full text-lg">{score}/20 ⭐</motion.span>
        )}
      </div>

      <div className="flex justify-center mb-5">
        <Turtle mood={turtleMood} message={turtleMessage} size="sm" />
      </div>

      <AnimatePresence>
        {selectedLeft && !verified && (
          <motion.div key="selected-indicator" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 mb-4 bg-primary-50 border-2 border-primary rounded-kid px-4 py-2"
          >
            <span className="text-2xl">{selectedLeftData?.emoji}</span>
            <span className="font-bold text-primary text-base">{selectedLeftData?.label}</span>
            <span className="text-primary-600 text-sm">— {isAr ? 'اختر ما تصبح عليه 👈' : 'Choisis ce qu\'elle devient 👈'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-kid shadow-kid p-4 sm:p-5 mb-5">
        {!verified && (
          <p className="text-xs text-center text-gray-400 mb-4 font-medium">
            {selectedLeft
              ? t('mc_instruction_select').replace('{item}', `${selectedLeftData?.emoji} ${selectedLeftData?.label}`)
              : t('mc_instruction_start')}
          </p>
        )}

        <div className="flex gap-3 sm:gap-5">
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <h3 className="font-bold text-center text-sm text-gray-500 pb-1 border-b border-gray-100">{t('mc_original')}</h3>
            {LEFT_ITEMS.map((item) => {
              const isPaired = !!pairs[item.id as LeftId];
              const idx = getLeftIndex(item.id as LeftId);
              return (
                <motion.button key={item.id} onClick={() => handleLeftClick(item.id as LeftId)} whileHover={!verified ? { scale: 1.03 } : {}} whileTap={!verified ? { scale: 0.97 } : {}}
                  className={`p-3 rounded-kid transition-all duration-200 w-full flex items-center gap-2 ${locale === 'ar' ? 'text-right' : 'text-left'} select-none ${getLeftClass(item.id as LeftId)}`}
                >
                  <span className="text-2xl flex-shrink-0 leading-none">{item.emoji}</span>
                  <span className={`font-semibold text-sm flex-1 ${locale === 'ar' ? 'text-right' : 'text-left'} leading-tight`}>{item.label}</span>
                  {!verified && isPaired && (
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 border ${PAIR_COLORS[idx].split(" ")[0]}`} />
                  )}
                  {verified && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg flex-shrink-0 leading-none">{pairs[item.id as LeftId] === CORRECT_PAIRS[item.id as LeftId] ? "✅" : "❌"}</motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-around pt-9 pb-1 gap-1 flex-shrink-0">
            {LEFT_ITEMS.map((item) => {
              const isPaired = !!pairs[item.id as LeftId];
              const isCorrect = verified && pairs[item.id as LeftId] === CORRECT_PAIRS[item.id as LeftId];
              const isWrong = verified && isPaired && !isCorrect;
              return (
                <motion.div key={item.id} animate={{ opacity: isPaired ? 1 : 0.2, scaleX: isPaired ? 1 : 0.5 }} transition={{ duration: 0.3 }}
                  className={`h-0.5 w-6 sm:w-8 rounded-full transition-colors duration-300 ${isCorrect ? "bg-success" : isWrong ? "bg-red-400" : isPaired ? "bg-primary-300" : "bg-gray-200"}`}
                />
              );
            })}
          </div>

          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <h3 className="font-bold text-center text-sm text-gray-500 pb-1 border-b border-gray-100">{t('mc_becomes')}</h3>
            {RIGHT_ITEMS.map((item) => {
              const pairedLeftId = getLeftForRight(item.id as RightId);
              const idx = pairedLeftId ? getLeftIndex(pairedLeftId) : -1;
              return (
                <motion.button key={item.id} onClick={() => handleRightClick(item.id as RightId)} whileHover={!verified ? { scale: 1.03 } : {}} whileTap={!verified ? { scale: 0.97 } : {}}
                  className={`p-3 rounded-kid transition-all duration-200 w-full flex items-center gap-2 ${locale === 'ar' ? 'text-right' : 'text-left'} select-none ${getRightClass(item.id as RightId)}`}
                >
                  <span className="text-xl flex-shrink-0 leading-none">{item.emoji}</span>
                  <span className={`font-semibold text-sm flex-1 ${locale === 'ar' ? 'text-right' : 'text-left'} leading-tight`}>{item.label}</span>
                  {!verified && pairedLeftId && idx >= 0 && (
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${PAIR_COLORS[idx].split(" ")[0]}`} />
                  )}
                  {verified && pairedLeftId && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg flex-shrink-0 leading-none">{pairs[pairedLeftId] === CORRECT_PAIRS[pairedLeftId] ? "✅" : "❌"}</motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {!verified && pairCount > 0 && (
          <p className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-gray-100">
            {pairCount} {t('mc_pairs_count')}
            {allPaired && t('mc_ready')}
          </p>
        )}

        {!verified && pairCount > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {LEFT_ITEMS.map((item) => {
              if (!pairs[item.id as LeftId]) return null;
              const idx = getLeftIndex(item.id as LeftId);
              const pairedRight = RIGHT_ITEMS.find((r) => r.id === pairs[item.id as LeftId]);
              return (
                <span key={item.id} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PAIR_COLORS[idx]}`}>{item.emoji} ↔ {pairedRight?.emoji}</span>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {!verified && allPaired && (
          <motion.div key="verify-btn" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="flex justify-center mb-4">
            <button onClick={handleVerify} className="btn-primary px-8">{t('ch_verify')}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verified && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className={`rounded-kid p-5 text-center border-2 ${score >= 16 ? "bg-success/10 border-success" : "bg-orange-50 border-orange-300"}`}>
              <p className="text-4xl mb-1">{score >= 16 ? "🎉" : "💪"}</p>
              <p className="font-black text-xl text-gray-800 mb-1">{score >= 16 ? t('ch_excellent') : t('ch_good')}</p>
              <p className="text-gray-500 text-sm">{LEFT_ITEMS.length - errors} {t('dd_correct_answers')} {LEFT_ITEMS.length}</p>
            </div>
            {errors > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-kid p-4">
                <p className={`font-bold text-red-700 mb-3 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>{t('mc_correction')}</p>
                <div className="space-y-2">
                  {LEFT_DATA.filter(item => pairs[item.id] !== CORRECT_PAIRS[item.id]).map((item) => {
                    const correctRight = RIGHT_DATA.find(r => r.id === CORRECT_PAIRS[item.id]);
                    const itemLabel = locale === 'ar' ? item.ar : item.fr;
                    const rightLabel = locale === 'ar' ? correctRight?.ar : correctRight?.fr;
                    return (
                      <div key={item.id} className={`flex items-center gap-2 text-sm text-red-600 ${locale === 'ar' ? 'justify-end text-right' : 'justify-start text-left'} flex-wrap`}>
                        {locale === 'ar' ? (
                          <>
                            <span className="font-semibold">{rightLabel}</span> <span className="text-base">{correctRight?.emoji}</span>
                            <span className="text-gray-400 text-xs">←</span>
                            <span className="font-semibold">{itemLabel}</span> <span className="text-base">{item.emoji}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-base">{item.emoji}</span> <span className="font-semibold">{itemLabel}</span>
                            <span className="text-gray-400 text-xs">→</span>
                            <span className="text-base">{correctRight?.emoji}</span> <span className="font-semibold">{rightLabel}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <button onClick={() => onComplete({ score, errors })} className="btn-primary px-10">{t('ch_finish')}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
