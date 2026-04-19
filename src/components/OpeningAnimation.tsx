"use client";

// ════════════════════════════════════════════════════════════════════════
// OpeningAnimation — رحلة الزجاجة
// Animation d'ouverture en 6 frames séquentielles (~40 secondes totales)
// Utilise Framer Motion (AnimatePresence + slide) + Turtle mascotte
// ════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "@/components/Turtle";

// ── Props ────────────────────────────────────────────────────────────────
interface OpeningAnimationProps {
  onComplete: () => void;
}

// ── Constantes de timing ─────────────────────────────────────────────────
const FRAME_DURATION = 6000; // ms par frame
const FINAL_DELAY = 3000; // ms après le message final avant onComplete
const TOTAL_FRAMES = 6;

// ── Variants Framer Motion — slide RTL (entrée ← gauche, sortie → droite)
const slideVariants = {
  enter: { x: "-100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};
const slideTrans = { type: "tween", duration: 0.5, ease: "easeInOut" } as const;

// ════════════════════════════════════════════════════════════════════════
// Composants d'UI réutilisables (card + typographie)
// ════════════════════════════════════════════════════════════════════════

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "relative glass rounded-kid shadow-kid text-center " +
        "flex flex-col items-center gap-5 " +
        "w-full max-w-2xl mx-auto " +
        "p-8 overflow-hidden"
      }
    >
      {children}
    </div>
  );
}

function FrameTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
      className="text-3xl md:text-4xl font-bold text-white leading-relaxed"
    >
      {children}
    </motion.h2>
  );
}

function FrameSub({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.75, duration: 0.4 }}
      className="text-white/80 text-lg md:text-xl leading-relaxed max-w-md"
    >
      {children}
    </motion.p>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Frame 1 — 🧒 طفل ينهي مشروبه
// ════════════════════════════════════════════════════════════════════════

function Frame0() {
  return (
    <Card>
      <div className="flex items-center justify-center gap-6 mt-2">
        {/* Enfant animé */}
        <motion.span
          className="text-8xl md:text-9xl select-none"
          animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🧒
        </motion.span>

        {/* Boisson animée */}
        <motion.span
          className="text-7xl md:text-8xl select-none"
          animate={{ rotate: [-14, 2, -14], y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🥤
        </motion.span>
      </div>

      <FrameTitle>طفل ينهي مشروبه</FrameTitle>
      <FrameSub>انتهى من مشروبه... والآن ماذا يفعل بالزجاجة الفارغة؟</FrameSub>

      {/* Bulle question */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="glass border border-white/30 rounded-bubble px-5 py-2"
      >
        <span className="text-white/90 text-lg font-semibold">
          هل يضعها في سلة المهملات أم في سلة الفرز؟ 🤔
        </span>
      </motion.div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Frame 2 — 🗑️ يتردد بين سلتَي المهملات
// ════════════════════════════════════════════════════════════════════════

function Frame1() {
  return (
    <Card>
      <FrameTitle>يتردد بين سلتَي المهملات</FrameTitle>

      {/* Scène des deux poubelles */}
      <div className="flex items-end justify-center gap-4 md:gap-10 w-full py-3">
        {/* Poubelle recyclage (côté droit en RTL = start) */}
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-6xl select-none">♻️</span>
          <span className="bg-green-500/30 text-white/90 text-xs font-bold px-3 py-1 rounded-full border border-green-400/40">
            إعادة تدوير
          </span>
        </motion.div>

        {/* Bouteille oscillante + flèches */}
        <div className="flex flex-col items-center gap-3">
          <motion.span
            className="text-5xl select-none"
            animate={{ x: [-32, 32, -32] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            🍶
          </motion.span>
          <div className="flex items-center gap-3 text-2xl font-black text-white">
            <motion.span
              animate={{ opacity: [1, 0.1, 1], x: [0, -5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ←
            </motion.span>
            <motion.span className="text-white/40 text-base">|</motion.span>
            <motion.span
              animate={{ opacity: [0.1, 1, 0.1], x: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </div>

        {/* Poubelle ordinaire (côté gauche en RTL = end) */}
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <span className="text-6xl select-none">🗑️</span>
          <span className="bg-red-500/30 text-white/90 text-xs font-bold px-3 py-1 rounded-full border border-red-400/40">
            نفايات عادية
          </span>
        </motion.div>
      </div>

      <FrameSub>أيّ سلة هي الصواب؟ ماذا تعتقد؟ 🤷</FrameSub>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Frame 3 — ✅ يختار السلة الصحيحة!  (confetti + tortue)
// ════════════════════════════════════════════════════════════════════════

// Positions fixes des confettis (pas de Math.random → pas de problème d'hydratation)
const CONFETTI_DATA = [
  { emoji: "🎊", left: "7%", delay: 0, dur: 2.4 },
  { emoji: "♻️", left: "17%", delay: 0.35, dur: 2.7 },
  { emoji: "💚", left: "29%", delay: 0.1, dur: 2.5 },
  { emoji: "🌿", left: "42%", delay: 0.55, dur: 2.3 },
  { emoji: "⭐", left: "55%", delay: 0.2, dur: 2.6 },
  { emoji: "🎉", left: "68%", delay: 0.45, dur: 2.4 },
  { emoji: "🌱", left: "81%", delay: 0.65, dur: 2.8 },
  { emoji: "✨", left: "91%", delay: 0.15, dur: 2.5 },
];

function Frame2() {
  return (
    <Card>
      {/* Pluie de confettis */}
      {CONFETTI_DATA.map((c, i) => (
        <motion.span
          key={i}
          className="absolute text-xl md:text-2xl pointer-events-none select-none z-0"
          style={{ left: c.left, top: 0 }}
          animate={{
            y: [0, 550],
            opacity: [0, 1, 1, 0],
            rotate: i % 2 === 0 ? [0, 280, 540] : [0, -280, -540],
          }}
          transition={{
            duration: c.dur,
            repeat: Infinity,
            delay: c.delay,
            ease: "linear",
          }}
        >
          {c.emoji}
        </motion.span>
      ))}

      {/* ✅ géant */}
      <motion.span
        className="text-8xl select-none relative z-10"
        animate={{ scale: [1, 1.28, 1], rotate: [0, 14, -14, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        ✅
      </motion.span>

      {/* ♻️ brillant */}
      <motion.span
        className="text-6xl select-none relative z-10"
        animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        ♻️
      </motion.span>

      <FrameTitle>يختار السلة الصحيحة!</FrameTitle>
      <FrameSub>اختار سلة إعادة التدوير الخضراء! 🌟</FrameSub>

      {/* Tortue qui applaudit */}
      <div className="relative z-10">
        <Turtle mood="celebrating" size="sm" showBubble={false} />
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Frame 4 — 🏭 الزجاجة تصل إلى مركز الفرز  (camion animé)
// ════════════════════════════════════════════════════════════════════════

function Frame3() {
  return (
    <Card>
      <FrameTitle>الزجاجة تصل إلى مركز الفرز</FrameTitle>

      {/* Scène de transport */}
      <div className="relative w-full h-32 overflow-hidden">
        {/* Route */}
        <div className="absolute bottom-0 w-full h-1 bg-white/20 rounded-full" />

        {/* Pointillés de route animés */}
        <div className="absolute bottom-1.5 w-full flex gap-4 px-2 overflow-hidden">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className="h-0.5 flex-1 bg-white/30 rounded-full"
              animate={{ x: [0, -50] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.09,
              }}
            />
          ))}
        </div>

        {/* Usine à gauche (destination RTL) */}
        <div className="absolute bottom-2 left-2">
          <motion.span
            className="text-5xl select-none"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🏭
          </motion.span>
        </div>

        {/* Camion qui traverse de droite à gauche (sens RTL = avancer) */}
        <motion.span
          className="absolute bottom-2 text-5xl select-none"
          animate={{ left: ["105%", "-18%"] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.4,
          }}
        >
          🚛
        </motion.span>

        {/* Maison à droite (origine) */}
        <div className="absolute bottom-2 right-2">
          <motion.span
            className="text-4xl select-none opacity-60"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🏠
          </motion.span>
        </div>
      </div>

      <FrameSub>رحلة طويلة من البيت إلى مركز الفرز... ثم ماذا؟ 🌟</FrameSub>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Frame 5 — 🔄 تُغسل وتُفرز وتُحوَّل  (rotation + étapes)
// ════════════════════════════════════════════════════════════════════════

const PROCESS_STEPS = [
  { emoji: "💧", label: "تُغسل" },
  { emoji: "🔍", label: "تُفرز" },
  { emoji: "⚙️", label: "تُحوَّل" },
];

function Frame4() {
  return (
    <Card>
      <FrameTitle>تُغسل وتُفرز وتُحوَّل</FrameTitle>

      {/* ♻️ tournant */}
      <motion.span
        className="text-8xl md:text-9xl select-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      >
        ♻️
      </motion.span>

      {/* Étapes du processus */}
      <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
        {PROCESS_STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.25, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.span
              className="text-4xl select-none"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.55 }}
            >
              {step.emoji}
            </motion.span>
            <span className="text-white/85 text-base md:text-lg font-bold">
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>

      <FrameSub>عملية التحويل السحرية تبدأ الآن! ✨</FrameSub>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Frame 6 — ✨ وُلد شيء جديد!  (transformation + étincelles)
// ════════════════════════════════════════════════════════════════════════

// Positions fixes des étincelles
const SPARKLE_POS = [
  { top: "12%", left: "8%", delay: 0 },
  { top: "18%", left: "86%", delay: 0.3 },
  { top: "58%", left: "4%", delay: 0.15 },
  { top: "65%", left: "88%", delay: 0.45 },
  { top: "38%", left: "48%", delay: 0.6 },
  { top: "8%", left: "52%", delay: 0.25 },
];

const NEW_PRODUCTS = ["🧴", "👕", "🪣"];

function Frame5() {
  return (
    <Card>
      {/* Étincelles de fond */}
      {SPARKLE_POS.map((pos, i) => (
        <motion.span
          key={i}
          className="absolute text-xl pointer-events-none select-none z-0"
          style={{ top: pos.top, left: pos.left }}
          animate={{
            scale: [0, 1.6, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 1.8, repeat: Infinity, delay: pos.delay }}
        >
          ✨
        </motion.span>
      ))}

      {/* Titre spring */}
      <motion.h2
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 12,
          delay: 0.55,
        }}
        className="text-3xl md:text-4xl font-bold text-white leading-relaxed relative z-10"
      >
        وُلد شيء جديد!
      </motion.h2>

      {/* Animation de transformation */}
      <div className="flex items-center justify-center gap-4 relative z-10">
        {/* Vieille bouteille qui disparaît */}
        <motion.span
          className="text-6xl select-none"
          animate={{ opacity: [1, 1, 0.2, 0], scale: [1, 1, 0.7, 0.4] }}
          transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
        >
          🍶
        </motion.span>

        {/* Symbole de transformation */}
        <motion.span
          className="text-3xl text-white select-none"
          animate={{ scale: [0.5, 1.6, 0.5], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 1 }}
        >
          ✨
        </motion.span>

        {/* Nouveaux produits qui apparaissent */}
        <div className="flex gap-2 items-center">
          {NEW_PRODUCTS.map((prod, i) => (
            <motion.span
              key={i}
              className="select-none"
              style={{ fontSize: i === 0 ? "3.5rem" : "2.5rem" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 14,
                delay: 1.6 + i * 0.4,
              }}
            >
              {prod}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.5 }}
        className="text-white/90 text-xl md:text-2xl font-bold relative z-10"
      >
        من زجاجة قديمة إلى منتجات جديدة رائعة! 🌟
      </motion.p>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Message final — tortue célébrant avec bubble
// ════════════════════════════════════════════════════════════════════════

function FinalMessage() {
  return (
    <motion.div
      key="final"
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
      className="flex flex-col items-center gap-4 text-center px-4"
    >
      <Turtle
        mood="celebrating"
        message="النفاية يمكن أن تصبح كنزاً! 🌟"
        size="xl"
        showBubble={true}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 text-base font-semibold"
      >
        جارٍ الانتقال...
      </motion.p>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Utilitaire — rendu du frame selon l'index
// ════════════════════════════════════════════════════════════════════════

function renderFrame(idx: number): React.ReactNode {
  switch (idx) {
    case 0:
      return <Frame0 />;
    case 1:
      return <Frame1 />;
    case 2:
      return <Frame2 />;
    case 3:
      return <Frame3 />;
    case 4:
      return <Frame4 />;
    case 5:
      return <Frame5 />;
    default:
      return null;
  }
}

// ════════════════════════════════════════════════════════════════════════
// Composant principal — OpeningAnimation
// ════════════════════════════════════════════════════════════════════════

export default function OpeningAnimation({
  onComplete,
}: OpeningAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // ── Timer d'avancement automatique ───────────────────────────────────
  useEffect(() => {
    // Phase finale : attendre FINAL_DELAY puis déclencher onComplete
    if (showFinalMessage) {
      const t = setTimeout(onComplete, FINAL_DELAY);
      return () => clearTimeout(t);
    }

    // Dernier frame : attendre FRAME_DURATION puis passer au message final
    if (currentFrame >= TOTAL_FRAMES - 1) {
      const t = setTimeout(() => setShowFinalMessage(true), FRAME_DURATION);
      return () => clearTimeout(t);
    }

    // Frames intermédiaires : avancer toutes les FRAME_DURATION ms
    const t = setTimeout(
      () => setCurrentFrame((prev) => prev + 1),
      FRAME_DURATION,
    );
    return () => clearTimeout(t);
  }, [currentFrame, showFinalMessage, onComplete]);

  // ── Skip → sauter directement au frame 6 ─────────────────────────────
  const handleSkip = () => {
    setCurrentFrame(TOTAL_FRAMES - 1);
  };

  // ── Rendu ─────────────────────────────────────────────────────────────
  return (
    <div
      dir="rtl"
      className={
        "fixed inset-0 z-50 bg-ocean-gradient " +
        "flex flex-col overflow-hidden font-cairo"
      }
    >
      {/* ────── Bouton Skip (en haut à droite) ────── */}
      <AnimatePresence>
        {!showFinalMessage && (
          <motion.button
            key="skip-btn"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            onClick={handleSkip}
            className={
              "absolute top-4 right-4 z-50 " +
              "glass border border-white/30 rounded-kid " +
              "text-white/90 font-bold text-sm " +
              "px-4 py-2 " +
              "hover:bg-white/25 active:scale-95 " +
              "transition-all duration-200 " +
              "flex items-center gap-2"
            }
          >
            <span>تخطي</span>
            <span>←</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ────── Indicateur numéro de frame (en haut à gauche) ────── */}
      <AnimatePresence>
        {!showFinalMessage && (
          <motion.div
            key="frame-num"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              "absolute top-4 left-4 z-50 " +
              "glass border border-white/20 rounded-kid " +
              "text-white/55 text-sm font-bold " +
              "px-3 py-2"
            }
          >
            {currentFrame + 1}&nbsp;/&nbsp;{TOTAL_FRAMES}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────── Zone principale (frame ou message final) ────── */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {showFinalMessage ? (
            <FinalMessage key="final-msg" />
          ) : (
            <motion.div
              key={currentFrame}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTrans}
              className="w-full flex justify-center"
            >
              {renderFrame(currentFrame)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────── Barre de progression — dots en bas ────── */}
      <AnimatePresence>
        {!showFinalMessage && (
          <motion.div
            key="progress-dots"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="flex justify-center items-center gap-3 pb-8 pt-3"
          >
            {Array.from({ length: TOTAL_FRAMES }, (_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === currentFrame ? "2rem" : "0.75rem",
                  opacity: i <= currentFrame ? 1 : 0.3,
                }}
                transition={{ duration: 0.35 }}
                className={
                  "h-3 rounded-full " +
                  (i === currentFrame
                    ? "bg-success"
                    : i < currentFrame
                      ? "bg-white/65"
                      : "bg-white/25")
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
