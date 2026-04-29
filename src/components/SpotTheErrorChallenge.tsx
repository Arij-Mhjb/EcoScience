"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

interface ChallengeResult {
  score: number;
  errors: number;
}

interface SpotTheErrorChallengeProps {
  onComplete: (result: ChallengeResult) => void;
}

interface ErrorHotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage
  height: number; // percentage
  ar: string;
  fr: string;
  tipAr: string;
  tipFr: string;
}

// Updated coordinates to match a typical AI generated school scene layout
const ERRORS_DATA: ErrorHotspot[] = [
  {
    id: "light",
    x: 78,
    y: 15,
    width: 15,
    height: 18,
    ar: "مصباح مضاء",
    fr: "Lumière allumée",
    tipAr: "أطفئ الضوء عند المغادرة لتوفير الطاقة",
    tipFr: "Éteins la lumière en partant pour économiser l'énergie",
  },
  {
    id: "smoke",
    x: 75,
    y: 88,
    width: 15,
    height: 12,
    ar: "سيارة مدخنة",
    fr: "Voiture polluante",
    tipAr: "أوقف المحرك عند الانتظار لتقليل التلوث",
    tipFr: "Arrête le moteur en attendant pour réduire la pollution",
  },
  {
    id: "tap",
    x: 64,
    y: 88,
    width: 8,
    height: 12,
    ar: "صنبور مفتوح",
    fr: "Robinet ouvert",
    tipAr: "الماء ثمين! لا تنسَ إغلاق الصنبور",
    tipFr: "L'eau est précieuse ! N'oublie pas de fermer le robinet",
  },
  {
    id: "branch",
    x: 18,
    y: 92,
    width: 12,
    height: 10,
    ar: "غصن مكسور",
    fr: "Branche cassée",
    tipAr: "الأشجار تحمينا، نحميها نحن أيضاً!",
    tipFr: "Les arbres nous protègent, protégeons-les aussi !",
  },
  {
    id: "trash",
    x: 48,
    y: 80,
    width: 15,
    height: 18,
    ar: "نفايات مبعثرة",
    fr: "Déchets par terre",
    tipAr: "النفايات في سلتها وليس بجانبها!",
    tipFr: "Les déchets vont dans la poubelle, pas à côté !",
  },
];

export default function SpotTheErrorChallenge({ onComplete }: SpotTheErrorChallengeProps) {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [lastTip, setLastTip] = useState<string | null>(null);
  const [hintActive, setHintActive] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shake, setShake] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(Date.now());

  const allFound = foundIds.length === ERRORS_DATA.length;

  useEffect(() => {
    if (allFound) return;
    const interval = setInterval(() => {
      if (Date.now() - lastClickTime > 30000) {
        const remaining = ERRORS_DATA.filter((e) => !foundIds.includes(e.id));
        if (remaining.length > 0) {
          const randomError = remaining[Math.floor(Math.random() * remaining.length)];
          setHintActive(randomError.id);
          setTimeout(() => setHintActive(null), 3000);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [foundIds, allFound, lastClickTime]);

  const handleSpotClick = (id: string, tip: string) => {
    if (foundIds.includes(id)) return;
    setFoundIds((prev) => [...prev, id]);
    setLastTip(tip);
    setLastClickTime(Date.now());
  };

  const handleMissClick = () => {
    if (allFound) return;
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const useHint = () => {
    if (hintsUsed >= 1 || allFound) return;
    const remaining = ERRORS_DATA.filter((e) => !foundIds.includes(e.id));
    if (remaining.length > 0) {
      setHintActive(remaining[0].id);
      setHintsUsed(1);
      setTimeout(() => setHintActive(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center" dir={isAr ? "rtl" : "ltr"}>
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl md:text-2xl font-black text-primary-800">
          {isAr ? "اكتشف الأخطاء الخمسة في ساحة المدرسة" : "Trouve les 5 erreurs dans la cour"}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={useHint}
            disabled={hintsUsed >= 1 || allFound}
            className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all ${
              hintsUsed >= 1 || allFound ? "bg-gray-200 text-gray-400" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
            }`}
          >
            {isAr ? "تلميح 💡" : "Indice 💡"}
          </button>
          <span className="text-lg font-bold text-primary bg-primary-50 px-4 py-1 rounded-full">
            {foundIds.length}/5 ✓
          </span>
        </div>
      </div>

      <div className="flex justify-center mb-5 w-full">
        <Turtle 
          mood={allFound ? "celebrating" : lastTip ? "happy" : "thinking"} 
          message={allFound ? (isAr ? "أحسنت! لقد اكتشفت كل الأخطاء وحميت المدرسة! 🎉" : "Bravo ! Tu as trouvé toutes les erreurs ! 🎉") : (lastTip || (isAr ? "انقر على الأخطاء البيئية الخمسة المختبئة في الصورة! 🤔" : "Clique sur les 5 erreurs cachées dans l'image ! 🤔"))} 
          size="sm" 
        />
      </div>

      <motion.div
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
        className="relative w-full aspect-[16/9] bg-white rounded-kid shadow-kid overflow-hidden cursor-crosshair border-4 border-white select-none"
        onClick={handleMissClick}
      >
        {/* Background Image with integrated errors */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/school_yard_errors_scene.png"
            alt="School Yard Scene"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Hotspots */}
        {ERRORS_DATA.map((error) => {
          const isFound = foundIds.includes(error.id);
          const isHinting = hintActive === error.id;
          
          return (
            <motion.div
              key={error.id}
              className="absolute z-10"
              style={{ 
                left: `${error.x}%`, 
                top: `${error.y}%`, 
                width: `${error.width}%`, 
                height: `${error.height}%`,
                transform: "translate(-50%, -50%)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSpotClick(error.id, isAr ? error.tipAr : error.tipFr);
              }}
            >
              {/* Target Area (invisible until found or hinting) */}
              <div className={`w-full h-full rounded-kid transition-all ${!isFound ? "hover:bg-white/10" : ""}`}>
                <AnimatePresence>
                  {(isFound || isHinting) && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`absolute inset-0 border-4 ${isHinting ? 'border-amber-400 animate-pulse' : 'border-red-500'} rounded-full`}
                    />
                  )}
                </AnimatePresence>
                
                {/* Visual indicator for "found" */}
                {isFound && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute -top-4 -right-4 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {allFound && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <button
            onClick={() => onComplete({ score: 20, errors: hintsUsed })}
            className="btn-primary px-12 py-3 text-xl shadow-xl"
          >
            {t("quiz_next")} ➡️
          </button>
        </motion.div>
      )}
    </div>
  );
}
