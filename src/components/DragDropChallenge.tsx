// DragDropChallenge — "أضع كل شيء في مكانه الصحيح" — 20 نقطة
// Interaction par clic : sélection d'objet → placement dans une zone
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";
import { useLanguage } from "@/context/LanguageContext";

interface ChallengeResult {
  score: number;
  errors: number;
}

interface DragDropChallengeProps {
  onComplete: (result: ChallengeResult) => void;
}

const ITEMS_DATA = [
  { id: "newspaper", ar: "جريدة", fr: "Journal", emoji: "📰" },
  { id: "cardboard", ar: "كرتون", fr: "Carton", emoji: "📦" },
  { id: "glass_jar", ar: "برطمان زجاجي", fr: "Bocal en verre", emoji: "🫙" },
  { id: "metal_can", ar: "علبة معدنية", fr: "Boîte de conserve", emoji: "🥫" },
  { id: "plastic_bottle", ar: "زجاجة بلاستيك", fr: "Bouteille plastique", emoji: "🧴" },
  { id: "shirt", ar: "قميص سليم", fr: "T-shirt propre", emoji: "👕" },
  { id: "toy", ar: "لعبة سليمة", fr: "Jouet en bon état", emoji: "🧸" },
  { id: "battery", ar: "بطارية", fr: "Pile", emoji: "🔋" },
] as const;

const ZONES_DATA = [
  { id: "paper", ar: "ورق / كرتون", fr: "Papier / Carton", emoji: "📄", color: "bg-yellow-100 border-yellow-400" },
  { id: "glass", ar: "زجاج", fr: "Verre", emoji: "🫙", color: "bg-blue-100 border-blue-400" },
  { id: "plastic_metal", ar: "بلاستيك / معدن", fr: "Plastique / Métal", emoji: "🧴", color: "bg-orange-100 border-orange-400" },
  { id: "donate", ar: "للتبرع / إعادة الاستخدام", fr: "Don / Réutilisation", emoji: "🎁", color: "bg-pink-100 border-pink-400" },
  { id: "special", ar: "جمع خاص", fr: "Collecte spéciale", emoji: "🔋", color: "bg-red-100 border-red-400" },
] as const;

type ItemId = (typeof ITEMS_DATA)[number]["id"];
type ZoneId = (typeof ZONES_DATA)[number]["id"];

const CORRECT_ANSWERS: Record<ItemId, ZoneId> = {
  newspaper: "paper", cardboard: "paper", glass_jar: "glass", metal_can: "plastic_metal", plastic_bottle: "plastic_metal", shirt: "donate", toy: "donate", battery: "special",
};

type ItemState = "idle" | "selected" | "placed" | "correct" | "incorrect";

const STATE_CLASSES: Record<ItemState, string> = {
  idle: "border-2 border-gray-200 bg-white hover:border-primary hover:bg-primary-50 cursor-pointer",
  selected: "border-2 border-primary bg-primary-50 ring-2 ring-primary ring-offset-2 scale-105 cursor-pointer",
  placed: "border-2 border-gray-300 bg-white opacity-60 cursor-pointer",
  correct: "border-2 border-success bg-success/10 cursor-default",
  incorrect: "border-2 border-red-400 bg-red-50 cursor-default",
};

export default function DragDropChallenge({
  onComplete,
}: DragDropChallengeProps) {
  const { t, locale } = useLanguage();
  const isAr = locale === 'ar';
  const [selectedItem, setSelectedItem] = useState<ItemId | null>(null);
  const [placements, setPlacements] = useState<Partial<Record<ItemId, ZoneId>>>({});
  const [verified, setVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);

  const ITEMS = useMemo(() => ITEMS_DATA.map(i => ({ id: i.id, label: locale === 'ar' ? i.ar : i.fr, emoji: i.emoji })), [locale]);
  const ZONES = useMemo(() => ZONES_DATA.map(z => ({ id: z.id, label: locale === 'ar' ? z.ar : z.fr, emoji: z.emoji, color: z.color })), [locale]);

  const placedCount = Object.keys(placements).length;
  const allPlaced = placedCount === ITEMS.length;

  const handleItemClick = (itemId: ItemId) => {
    if (verified) return;
    setSelectedItem((prev) => (prev === itemId ? null : itemId));
  };

  const handleZoneClick = (zoneId: ZoneId) => {
    if (verified || !selectedItem) return;
    setPlacements((prev) => ({ ...prev, [selectedItem]: zoneId }));
    setSelectedItem(null);
  };

  const handleVerify = () => {
    let correctCount = 0;
    let errorCount = 0;
    ITEMS_DATA.forEach((item) => {
      if (placements[item.id] === CORRECT_ANSWERS[item.id]) correctCount++;
      else errorCount++;
    });
    const finalScore = correctCount * 2.5;
    setScore(finalScore);
    setErrors(errorCount);
    setVerified(true);
  };

  const getItemState = (itemId: ItemId): ItemState => {
    if (verified) return placements[itemId] === CORRECT_ANSWERS[itemId] ? "correct" : "incorrect";
    if (selectedItem === itemId) return "selected";
    if (placements[itemId]) return "placed";
    return "idle";
  };

  const getZoneItems = (zoneId: ZoneId) => ITEMS.filter((item) => placements[item.id] === zoneId);
  const selectedItemData = ITEMS.find((i) => i.id === selectedItem);

  const turtleMood = verified ? (score >= 16 ? "happy" : "thinking") : "idle";
  const turtleMessage = verified
    ? score >= 16
      ? t('dd_excellent').replace('{score}', score.toString())
      : t('dd_good').replace('{score}', score.toString())
    : selectedItem
      ? t('dd_choose_place').replace('{item}', `${selectedItemData?.emoji} ${selectedItemData?.label}`)
      : t('dd_start_msg');

  return (
    <div className="w-full max-w-3xl mx-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl md:text-2xl font-black text-primary-800">{t('dd_title')}</h2>
        {!verified ? (
          <span className="text-sm font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full">{placedCount}/8 ✓</span>
        ) : (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-bold text-white bg-primary px-4 py-1.5 rounded-full text-lg">{score}/20 ⭐</motion.span>
        )}
      </div>

      <div className="flex justify-center mb-5">
        <Turtle mood={turtleMood} message={turtleMessage} size="sm" />
      </div>

      <AnimatePresence>
        {selectedItem && !verified && (
          <motion.div key="selected-indicator" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 mb-4 bg-primary-50 border-2 border-primary rounded-kid px-4 py-2"
          >
            <span className="text-2xl">{selectedItemData?.emoji}</span>
            <span className="font-bold text-primary text-base">{selectedItemData?.label}</span>
            <span className="text-primary-600 text-sm">— {isAr ? 'اختر مكانه أدناه ⬇️' : 'Choisis sa place ci-dessous ⬇️'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-kid shadow-kid p-4 mb-5">
        <p className="text-xs font-semibold text-gray-400 text-center mb-3 tracking-wide uppercase">{t('dd_items_label')}</p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {ITEMS.map((item) => {
            const state = getItemState(item.id as ItemId);
            const placedZone = placements[item.id as ItemId] ? ZONES.find((z) => z.id === placements[item.id as ItemId]) : null;
            return (
              <motion.button key={item.id} onClick={() => handleItemClick(item.id as ItemId)} whileHover={!verified && state !== "selected" ? { scale: 1.06 } : {}} whileTap={!verified ? { scale: 0.94 } : {}}
                className={`relative p-2 sm:p-3 rounded-kid transition-all duration-200 flex flex-col items-center gap-1 select-none ${STATE_CLASSES[state]}`}
              >
                <span className="text-2xl sm:text-3xl leading-none">{item.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center leading-tight">{item.label}</span>
                {state === "placed" && placedZone && (
                  <span className="text-[9px] text-gray-400 font-medium text-center leading-tight">{placedZone.emoji} {placedZone.label}</span>
                )}
                {verified && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-base leading-none">{state === "correct" ? "✅" : "❌"}</motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
        {ZONES.map((zone) => {
          const placedItems = getZoneItems(zone.id as ZoneId);
          const isDropTarget = !!selectedItem && !verified;
          return (
            <motion.div key={zone.id} onClick={() => handleZoneClick(zone.id as ZoneId)} whileHover={isDropTarget ? { scale: 1.04, y: -2 } : {}} whileTap={isDropTarget ? { scale: 0.97 } : {}}
              className={`flex-1 min-w-[130px] border-2 rounded-kid p-3 min-h-[100px] transition-all duration-200 ${zone.color} ${isDropTarget ? "cursor-pointer shadow-kid ring-2 ring-primary/30" : "cursor-default"}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xl">{zone.emoji}</span>
                <span className="font-bold text-xs text-gray-700 leading-tight">{zone.label}</span>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[28px] items-center">
                {placedItems.length === 0 ? (
                  <span className="text-[10px] text-gray-400 italic">{t('dd_empty')}</span>
                ) : (
                  placedItems.map((item) => (
                    <motion.span key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg leading-none" title={item.label}>{item.emoji}</motion.span>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {!verified && allPlaced && (
          <motion.div key="verify-btn" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="flex justify-center mb-4">
            <button onClick={handleVerify} className="btn-primary px-8">{t('dd_verify')}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verified && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className={`rounded-kid p-5 text-center border-2 ${score >= 16 ? "bg-success/10 border-success" : "bg-orange-50 border-orange-300"}`}>
              <p className="text-4xl mb-1">{score >= 16 ? "🎉" : "💪"}</p>
              <p className="font-black text-xl text-gray-800 mb-1">{score >= 16 ? t('dd_excellent').split('!')[0] + '!' : t('dd_good').split('!')[0] + '!'}</p>
              <p className="text-gray-500 text-sm">{ITEMS.length - errors} {t('dd_correct_answers')} {ITEMS.length}</p>
            </div>
            {errors > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-kid p-4">
                <p className={`font-bold text-red-700 mb-3 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>{t('dd_correction')}</p>
                <div className="space-y-2">
                  {ITEMS_DATA.filter(item => placements[item.id] !== CORRECT_ANSWERS[item.id]).map((item) => {
                    const correctZone = ZONES_DATA.find(z => z.id === CORRECT_ANSWERS[item.id]);
                    const itemLabel = locale === 'ar' ? item.ar : item.fr;
                    const zoneLabel = locale === 'ar' ? correctZone?.ar : correctZone?.fr;
                    return (
                      <div key={item.id} className={`flex items-center gap-2 text-sm text-red-600 ${locale === 'ar' ? 'text-right justify-end' : 'text-left justify-start'}`}>
                        {locale === 'ar' ? (
                          <>
                            <span className="font-semibold">{zoneLabel}</span> <span className="text-base">{correctZone?.emoji}</span>
                            <span className="text-gray-400 text-xs">{t('dd_belongs_to')}</span>
                            <span className="font-semibold">{itemLabel}</span> <span className="text-base">{item.emoji}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-base">{item.emoji}</span> <span className="font-semibold">{itemLabel}</span>
                            <span className="text-gray-400 text-xs">{t('dd_belongs_to')}</span>
                            <span className="text-base">{correctZone?.emoji}</span> <span className="font-semibold">{zoneLabel}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <button onClick={() => onComplete({ score, errors })} className="btn-primary px-10">{t('quiz_next')} ➡️</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
