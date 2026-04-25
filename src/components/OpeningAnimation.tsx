"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "@/components/Turtle";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Interfaces ─────────────────────────────────────────────────────────── */
interface OpeningAnimationProps {
  onComplete: () => void;
}

/* ─── Timing ───────────────────────────────────────────────────────────── */
const FRAME_DURATION = 6000;
const FINAL_DELAY = 3000;
const TOTAL_FRAMES = 6;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
};

/* ─── Shared UI Components ─────────────────────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative glass rounded-kid shadow-kid text-center flex flex-col items-center gap-5 w-full max-w-2xl mx-auto p-8 overflow-hidden">
      {children}
    </div>
  );
}

function FrameTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }}
      className="text-3xl md:text-4xl font-bold text-white leading-relaxed"
    >
      {children}
    </motion.h2>
  );
}

function FrameSub({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.4 }}
      className="text-white/80 text-lg md:text-xl leading-relaxed max-w-md"
    >
      {children}
    </motion.p>
  );
}

/* ─── Frames ───────────────────────────────────────────────────────────── */

function Frame0({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-center gap-6 mt-2">
        <motion.span className="text-8xl md:text-9xl select-none" animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>🧒</motion.span>
        <motion.span className="text-7xl md:text-8xl select-none" animate={{ rotate: [-14, 2, -14], y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>🥤</motion.span>
      </div>
      <FrameTitle>{isAr ? 'طفل ينهي مشروبه' : 'Un enfant finit sa boisson'}</FrameTitle>
      <FrameSub>{isAr ? 'انتهى من مشروبه... والآن ماذا يفعل بالزجاجة الفارغة؟' : 'Il a fini sa boisson... et maintenant, que fait-il de sa bouteille vide ?'}</FrameSub>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring" }} className="glass border border-white/30 rounded-bubble px-5 py-2">
        <span className="text-white/90 text-lg font-semibold">{isAr ? 'هل يضعها في سلة المهملات أم في سلة الفرز؟ 🤔' : 'La met-il à la poubelle ou dans le bac de tri ? 🤔'}</span>
      </motion.div>
    </Card>
  );
}

function Frame1({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <FrameTitle>{isAr ? 'يتردد بين سلتَي المهملات' : 'Il hésite entre les deux poubelles'}</FrameTitle>
      <div className="flex items-end justify-center gap-4 md:gap-10 w-full py-3">
        <motion.div className="flex flex-col items-center gap-2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-6xl">♻️</span>
          <span className="bg-green-500/30 text-white/90 text-xs font-bold px-3 py-1 rounded-full border border-green-400/40">{isAr ? 'إعادة تدوير' : 'Recyclage'}</span>
        </motion.div>
        <div className="flex flex-col items-center gap-3">
          <motion.span className="text-5xl" animate={{ x: isAr ? [-32, 32, -32] : [32, -32, 32] }} transition={{ duration: 1.8, repeat: Infinity }}>🍶</motion.span>
          <div className="flex items-center gap-3 text-2xl font-black text-white">
            <motion.span animate={{ opacity: [1, 0.1, 1], x: [0, -5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>←</motion.span>
            <motion.span className="text-white/40 text-base">|</motion.span>
            <motion.span animate={{ opacity: [0.1, 1, 0.1], x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>→</motion.span>
          </div>
        </div>
        <motion.div className="flex flex-col items-center gap-2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
          <span className="text-6xl">🗑️</span>
          <span className="bg-red-500/30 text-white/90 text-xs font-bold px-3 py-1 rounded-full border border-red-400/40">{isAr ? 'نفايات عادية' : 'Déchets ordinaires'}</span>
        </motion.div>
      </div>
      <FrameSub>{isAr ? 'أيّ سلة هي الصواب؟ ماذا تعتقد؟ 🤷' : 'Quelle poubelle est la bonne ? Qu\'en penses-tu ? 🤷'}</FrameSub>
    </Card>
  );
}

function Frame2({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[{e:"🎊",l:"7%"},{e:"♻️",l:"29%"},{e:"💚",l:"55%"},{e:"⭐",l:"81%"}].map((c,i)=>(
          <motion.span key={i} className="absolute text-2xl" style={{ left: c.l, top: 0 }} animate={{ y: [0, 500], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: i*0.4 }}>{c.e}</motion.span>
        ))}
      </div>
      <motion.span className="text-8xl select-none relative z-10" animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>✅</motion.span>
      <FrameTitle>{isAr ? 'يختار السلة الصحيحة!' : 'Il choisit la bonne poubelle !'}</FrameTitle>
      <FrameSub>{isAr ? 'اختار سلة إعادة التدوير الخضراء! 🌟' : 'Il a choisi le bac de recyclage vert ! 🌟'}</FrameSub>
      <div className="relative z-10"><Turtle mood="celebrating" size="sm" showBubble={false} /></div>
    </Card>
  );
}

function Frame3({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <FrameTitle>{isAr ? 'الزجاجة تصل إلى مركز الفرز' : 'La bouteille arrive au centre de tri'}</FrameTitle>
      <div className="relative w-full h-32 overflow-hidden">
        <div className="absolute bottom-0 w-full h-1 bg-white/20 rounded-full" />
        <div className="absolute bottom-2 left-2"><motion.span className="text-5xl" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>🏭</motion.span></div>
        <motion.span className="absolute bottom-2 text-5xl" animate={{ left: isAr ? ["105%", "-18%"] : ["-18%", "105%"] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}>🚛</motion.span>
        <div className="absolute bottom-2 right-2"><motion.span className="text-4xl opacity-60">🏠</motion.span></div>
      </div>
      <FrameSub>{isAr ? 'رحلة طويلة من البيت إلى مركز الفرز... ثم ماذا؟ 🌟' : 'Un long voyage de la maison au centre de tri... et après ? 🌟'}</FrameSub>
    </Card>
  );
}

function Frame4({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <FrameTitle>{isAr ? 'تُغسل وتُفرز وتُحوَّل' : 'Lavée, triée et transformée'}</FrameTitle>
      <motion.span className="text-8xl md:text-9xl" animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}>♻️</motion.span>
      <div className="flex justify-center gap-6 md:gap-12">
        {[{e:"💧",l:isAr?"تُغسل":"Lavée"},{e:"🔍",l:isAr?"تُفرز":"Triée"},{e:"⚙️",l:isAr?"تُحوَّل":"Transformée"}].map((s,i)=>(
          <div key={i} className="flex flex-col items-center gap-2">
            <motion.span className="text-4xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: i*0.4 }}>{s.e}</motion.span>
            <span className="text-white/85 text-base md:text-lg font-bold">{s.l}</span>
          </div>
        ))}
      </div>
      <FrameSub>{isAr ? 'عملية التحويل السحرية تبدأ الآن! ✨' : 'Le processus de transformation magique commence ! ✨'}</FrameSub>
    </Card>
  );
}

function Frame5({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <FrameTitle>{isAr ? 'وُلد شيء جديد!' : 'Quelque chose de neuf est né !'}</FrameTitle>
      <div className="flex items-center justify-center gap-4">
        <motion.span className="text-6xl" animate={{ opacity: [1, 0], scale: [1, 0.5] }} transition={{ duration: 2, delay: 0.5 }}>🍶</motion.span>
        <motion.span className="text-3xl text-white" animate={{ scale: [0.5, 1.5, 0.5], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>✨</motion.span>
        <div className="flex gap-2 items-center">
          {["🧴", "👕", "🪣"].map((prod, i) => (
            <motion.span key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 1.6 + i * 0.4 }}>{prod}</motion.span>
          ))}
        </div>
      </div>
      <FrameSub>{isAr ? 'من زجاجة قديمة إلى منتجات جديدة رائعة! 🌟' : 'D\'une vieille bouteille à de superbes nouveaux produits ! 🌟'}</FrameSub>
    </Card>
  );
}

function FinalMessage({ isAr }: { isAr: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-center px-4">
      <Turtle mood="celebrating" message={isAr ? 'النفاية يمكن أن تصبح كنزاً! 🌟' : 'Un déchet peut devenir un trésor ! 🌟'} size="xl" showBubble={true} />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/70 text-base font-semibold">
        {isAr ? 'جارٍ الانتقال...' : 'Transition en cours...'}
      </motion.p>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    if (showFinalMessage) {
      const t = setTimeout(onComplete, FINAL_DELAY);
      return () => clearTimeout(t);
    }
    if (currentFrame >= TOTAL_FRAMES - 1) {
      const t = setTimeout(() => setShowFinalMessage(true), FRAME_DURATION);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrentFrame((p) => p + 1), FRAME_DURATION);
    return () => clearTimeout(t);
  }, [currentFrame, showFinalMessage, onComplete]);

  const handleSkip = () => setCurrentFrame(TOTAL_FRAMES - 1);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="fixed inset-0 z-50 bg-ocean-gradient flex flex-col overflow-hidden font-cairo">
      {!showFinalMessage && (
        <motion.button onClick={handleSkip} className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} z-50 glass border border-white/30 rounded-kid text-white/90 font-bold text-sm px-4 py-2 hover:bg-white/25 active:scale-95 transition-all flex items-center gap-2`}>
          <span>{isAr ? 'تخطي' : 'Passer'}</span>
          <span>{isAr ? '←' : '→'}</span>
        </motion.button>
      )}

      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={isAr ? 1 : -1}>
          {showFinalMessage ? (
            <FinalMessage key="final" isAr={isAr} />
          ) : (
            <motion.div key={currentFrame} variants={slideVariants} custom={isAr ? 1 : -1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="w-full flex justify-center">
              {(() => {
                switch(currentFrame) {
                  case 0: return <Frame0 isAr={isAr} />;
                  case 1: return <Frame1 isAr={isAr} />;
                  case 2: return <Frame2 isAr={isAr} />;
                  case 3: return <Frame3 isAr={isAr} />;
                  case 4: return <Frame4 isAr={isAr} />;
                  case 5: return <Frame5 isAr={isAr} />;
                  default: return null;
                }
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showFinalMessage && (
        <div className="flex justify-center items-center gap-3 pb-8 pt-3">
          {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
            <motion.div key={i} animate={{ width: i === currentFrame ? "2rem" : "0.75rem", opacity: i <= currentFrame ? 1 : 0.3 }} className={`h-3 rounded-full ${i === currentFrame ? "bg-success" : i < currentFrame ? "bg-white/65" : "bg-white/25"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
