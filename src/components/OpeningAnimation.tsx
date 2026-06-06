"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "@/components/Turtle";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Interfaces ─────────────────────────────────────────────────────────── */
interface OpeningAnimationProps {
  contestId?: string;
  onComplete: () => void;
}

/* ─── Shared UI Components ─────────────────────────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative glass rounded-kid shadow-kid text-center flex flex-col items-center gap-5 w-full max-w-2xl mx-auto p-8 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function FrameTitle({ children, color = "text-white" }: { children: React.ReactNode; color?: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }}
      className={`text-3xl md:text-4xl font-bold ${color} leading-relaxed`}
    >
      {children}
    </motion.h2>
  );
}

function FrameSub({ children, color = "text-white/80" }: { children: React.ReactNode; color?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.4 }}
      className={`${color} text-lg md:text-xl leading-relaxed max-w-md`}
    >
      {children}
    </motion.p>
  );
}

/* ─── Contest 1 Frames (Recycling) ───────────────────────────────────────── */

const C1_TOTAL_FRAMES = 6;
const C1_FRAME_DURATION = 6000;

function C1_Frame0({ isAr }: { isAr: boolean }) {
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

function C1_Frame1({ isAr }: { isAr: boolean }) {
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

function C1_Frame2({ isAr }: { isAr: boolean }) {
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

function C1_Frame3({ isAr }: { isAr: boolean }) {
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

function C1_Frame4({ isAr }: { isAr: boolean }) {
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

function C1_Frame5({ isAr }: { isAr: boolean }) {
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

/* ─── Contest 2 Frames (Composting) ──────────────────────────────────────── */

const C2_TOTAL_FRAMES = 5;
const C2_FRAME_DURATION = 6000;

function C2_Frame0({ isAr }: { isAr: boolean }) {
  return (
    <Card className="bg-green-800/20 border-green-600/30">
      <div className="flex items-center justify-center gap-6 mt-2">
        <motion.span className="text-8xl select-none" animate={{ y: [0, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>🍌</motion.span>
        <motion.span className="text-7xl select-none" animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2, repeat: Infinity }}>🥦</motion.span>
        <motion.span className="text-8xl select-none" animate={{ y: [0, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}>🍎</motion.span>
      </div>
      <FrameTitle>{isAr ? 'بعد الأكل... ماذا نفعل بالبقايا؟' : 'Après le repas... que faire des restes ?'}</FrameTitle>
      <FrameSub>{isAr ? 'قشور الفاكهة والخضروات تبدو عديمة الفائدة... لكن هل هي كذلك فعلاً؟' : 'Les épluchures et restes végétaux semblent inutiles... mais le sont-ils vraiment ?'}</FrameSub>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring" }} className="glass border border-white/30 rounded-bubble px-5 py-2">
        <span className="text-white/90 text-lg font-semibold">{isAr ? 'الرمي؟ أم التحويل إلى شيء مفيد؟ 🤔' : 'Les jeter ? Ou les transformer en quelque chose d\'utile ? 🤔'}</span>
      </motion.div>
    </Card>
  );
}

function C2_Frame1({ isAr }: { isAr: boolean }) {
  return (
    <Card className="bg-amber-800/20 border-amber-600/30">
      <FrameTitle>{isAr ? 'صندوق التسميد... الحل السحري!' : 'Le composteur... la solution magique !'}</FrameTitle>
      <div className="flex items-center justify-center gap-8 py-4">
        <div className="flex flex-col items-center gap-2">
          {['🍌', '🥦', '☕', '🍂'].map((e, i) => (
            <motion.span key={i} className="text-3xl" animate={{ x: isAr ? [0, 30, 0] : [0, -30, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>{e}</motion.span>
          ))}
        </div>
        <motion.span className="text-5xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>➡️</motion.span>
        <motion.div className="flex flex-col items-center gap-2 bg-amber-800/30 border-2 border-amber-600/50 rounded-kid p-4" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-6xl">🗑️</span>
          <span className="text-white font-bold text-sm">{isAr ? 'صندوق التسميد' : 'Composteur'}</span>
        </motion.div>
      </div>
      <FrameSub>{isAr ? 'نضع بقايا الطعام والنباتات في صندوق خاص... ونترك الطبيعة تعمل!' : 'On place les restes alimentaires et végétaux dans un bac spécial... et on laisse la nature faire le travail !'}</FrameSub>
    </Card>
  );
}

function C2_Frame2({ isAr }: { isAr: boolean }) {
  return (
    <Card className="bg-brown-800/20">
      <FrameTitle>{isAr ? 'الديدان والميكروبات تعمل!' : 'Les vers et microbes au travail !'}</FrameTitle>
      <div className="relative w-full h-36 flex items-center justify-center overflow-hidden">
        <motion.div className="absolute w-40 h-40 rounded-full bg-amber-700/30 border-2 border-amber-600/40" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }} />
        {['🪱', '🦠', '🪱', '🦠', '🪱'].map((e, i) => (
          <motion.span key={i} className="absolute text-2xl" style={{ left: `${15 + i * 17}%` }}
            animate={{ y: [-8, 8, -8], rotate: [0, 20, -20, 0] }} transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}>{e}</motion.span>
        ))}
      </div>
      <FrameSub>{isAr ? 'الديدان والبكتيريا تُحلّل المواد العضوية وتحوّلها إلى سماد غني.' : 'Les vers et bactéries décomposent les matières organiques en compost riche.'}</FrameSub>
      <div className="flex justify-center gap-6">
        {[{ e: '⏳', l: isAr ? 'بضعة أسابيع' : 'Quelques semaines' }, { e: '💧', l: isAr ? 'رطوبة' : 'Humidité' }, { e: '🔄', l: isAr ? 'تقليب' : 'Mélange' }].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.span className="text-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}>{s.e}</motion.span>
            <span className="text-white/80 text-xs font-bold">{s.l}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function C2_Frame3({ isAr }: { isAr: boolean }) {
  return (
    <Card className="bg-green-700/20 border-green-500/30">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[{ e: '🌱', l: '10%' }, { e: '✨', l: '35%' }, { e: '🌿', l: '60%' }, { e: '💚', l: '85%' }].map((c, i) => (
          <motion.span key={i} className="absolute text-2xl" style={{ left: c.l, top: 0 }} animate={{ y: [0, 500], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}>{c.e}</motion.span>
        ))}
      </div>
      <motion.span className="text-8xl relative z-10" animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🌱</motion.span>
      <FrameTitle>{isAr ? 'وُلد السماد الطبيعي!' : 'Le compost naturel est né !'}</FrameTitle>
      <FrameSub>{isAr ? 'النفايات العضوية تحوّلت إلى سماد غني يُغذّي التربة ويساعد النباتات على النمو!' : 'Les déchets organiques sont devenus un compost riche qui nourrit le sol et aide les plantes à pousser !'}</FrameSub>
      <div className="relative z-10"><Turtle mood="celebrating" size="sm" showBubble={false} /></div>
    </Card>
  );
}

function C2_Frame4({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <FrameTitle>{isAr ? 'التسميد يُنقذ الكوكب!' : 'Le compostage sauve la planète !'}</FrameTitle>
      <div className="grid grid-cols-2 gap-3 w-full">
        {[
          { e: '🏭', before: isAr ? 'مكبّ مليء' : 'Décharge pleine', e2: '🌱', after: isAr ? 'سماد مفيد' : 'Compost utile' },
          { e: '💨', before: isAr ? 'غاز ميثان' : 'Méthane', e2: '🌍', after: isAr ? 'هواء نظيف' : 'Air propre' },
        ].map((item, i) => (
          <div key={i} className="bg-white/10 rounded-kid p-3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl opacity-60">{item.e}</span>
              <motion.span className="text-xl text-white" animate={{ x: isAr ? [-5, 5, -5] : [5, -5, 5] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
              <span className="text-3xl">{item.e2}</span>
            </div>
            <span className="text-white/70 text-xs font-bold text-center">{item.before} → {item.after}</span>
          </div>
        ))}
      </div>
      <FrameSub>{isAr ? 'بالتسميد، نقلّل النفايات ونُغذّي الأرض — الجميع يربح! 🌍' : 'En compostant, on réduit les déchets et on nourrit la terre — tout le monde gagne ! 🌍'}</FrameSub>
    </Card>
  );
}

/* ─── Contest 3 Frames (Environment/Climate) ─────────────────────────────── */

const C3_TOTAL_FRAMES = 4;
const C3_TIMINGS = [10000, 15000, 15000, 5000];

function C3_Frame0({ isAr }: { isAr: boolean }) {
  return (
    <Card className="bg-sky-400/20 border-sky-300/30">
      <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
        <motion.span className="absolute top-2 right-10 text-6xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>☀️</motion.span>
        <motion.span className="absolute bottom-2 left-10 text-5xl" animate={{ x: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }}>🌳</motion.span>
        <motion.span className="absolute bottom-5 right-20 text-4xl" animate={{ x: [10, -10, 10] }} transition={{ duration: 6, repeat: Infinity }}>🐦</motion.span>
        <div className="flex gap-8">
          <motion.span className="text-7xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🧒</motion.span>
          <motion.span className="text-7xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>👧</motion.span>
        </div>
        <motion.div className="absolute bottom-0 w-full h-4 bg-blue-400/40 rounded-full" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
      </div>
      <FrameTitle>{isAr ? 'عالم مبهج ومتوازن' : 'Un monde joyeux et équilibré'}</FrameTitle>
      <FrameSub>{isAr ? 'سماء زرقاء، أشجار خضراء، وأطفال يضحكون في بيئة نظيفة.' : 'Ciel bleu, arbres verts et enfants riant dans un environnement propre.'}</FrameSub>
    </Card>
  );
}

function C3_Frame1({ isAr }: { isAr: boolean }) {
  return (
    <Card className="bg-orange-600/20 border-orange-500/30">
      <div className="relative w-full h-40 flex items-center justify-center">
        <motion.span className="absolute top-0 text-8xl" animate={{ scale: [1, 1.3, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }} transition={{ duration: 2, repeat: Infinity }}>☀️</motion.span>
        <motion.span className="absolute bottom-2 left-10 text-5xl grayscale opacity-60">🥀</motion.span>
        <motion.div className="absolute bottom-5 right-10 flex flex-col items-center">
          <span className="text-5xl">🚗</span>
          <motion.span className="text-3xl" animate={{ x: [0, 20], opacity: [0, 0.8, 0], scale: [0.5, 1.5] }} transition={{ duration: 1, repeat: Infinity }}>💨</motion.span>
        </motion.div>
        <motion.span className="text-7xl" animate={{ y: [0, 2, 0] }}>🥵</motion.span>
      </div>
      <FrameTitle color="text-orange-100">{isAr ? 'الأرض بدأت تسخن!' : 'La Terre commence à chauffer !'}</FrameTitle>
      <FrameSub color="text-orange-100/80">{isAr ? 'الدخان والحرارة يجعلان كوكبنا حزيناً ومتعباً.' : 'La fumée et la chaleur rendent notre planète triste et fatiguée.'}</FrameSub>
    </Card>
  );
}

function C3_Frame2({ isAr }: { isAr: boolean }) {
  return (
    <Card className="bg-green-500/20 border-green-400/30">
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col items-center gap-2 bg-white/10 p-3 rounded-kid">
          <motion.span className="text-4xl" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🌱</motion.span>
          <span className="text-xs font-bold text-white">{isAr ? 'زراعة الأشجار' : 'Planter'}</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 p-3 rounded-kid">
          <motion.span className="text-4xl" animate={{ x: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity }}>🚲</motion.span>
          <span className="text-xs font-bold text-white">{isAr ? 'ركوب الدراجة' : 'Vélo'}</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 p-3 rounded-kid">
          <motion.span className="text-4xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🚿</motion.span>
          <span className="text-xs font-bold text-white">{isAr ? 'توفير الماء' : 'Économiser l\'eau'}</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 p-3 rounded-kid">
          <motion.span className="text-4xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>♻️</motion.span>
          <span className="text-xs font-bold text-white">{isAr ? 'فرز النفايات' : 'Trier'}</span>
        </div>
      </div>
      <FrameTitle>{isAr ? 'أفعالنا البسيطة تُغير الكثير' : 'Nos petits gestes changent tout'}</FrameTitle>
      <FrameSub>{isAr ? 'كل شجرة نزرعها وكل قطرة ماء نوفرها تُساعد الكوكب.' : 'Chaque arbre planté et chaque goutte d\'eau économisée aide la planète.'}</FrameSub>
    </Card>
  );
}

function C3_Frame3({ isAr }: { isAr: boolean }) {
  return (
    <Card>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, type: "spring" }}
        className="flex flex-col items-center gap-4"
      >
        <span className="text-9xl">🌍</span>
        <motion.span className="text-5xl absolute" animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>✨</motion.span>
      </motion.div>
      <FrameTitle>{isAr ? 'كوكبنا سعيد ومشرق' : 'Notre planète est heureuse'}</FrameTitle>
      <FrameSub>{isAr ? 'بفضلكم، الأرض تتنفس من جديد وتعود خضراء.' : 'Grâce à vous, la Terre respire à nouveau et redevient verte.'}</FrameSub>
      <div className="mt-2"><Turtle mood="happy" size="sm" showBubble={false} /></div>
    </Card>
  );
}

/* ─── Shared Components ─────────────────────────────────────────────────── */

function FinalMessage({ isAr }: { isAr: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-center px-4">
      <Turtle mood="celebrating" message={isAr ? 'معاً نحمي كوكبنا! 🌟' : 'Ensemble, protégeons notre planète ! 🌟'} size="xl" showBubble={true} />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/70 text-base font-semibold">
        {isAr ? 'جارٍ الانتقال...' : 'Transition en cours...'}
      </motion.p>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

const FINAL_DELAY = 3000;

export default function OpeningAnimation({ onComplete, contestId }: OpeningAnimationProps) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const isComposting = contestId === '69e51153482488070228f2cd';
  const isClimateChange = contestId === '69e51153482488070228f2ce';

  const totalFrames = isClimateChange ? C3_TOTAL_FRAMES : isComposting ? C2_TOTAL_FRAMES : C1_TOTAL_FRAMES;

  useEffect(() => {
    if (showFinalMessage) {
      const t = setTimeout(onComplete, FINAL_DELAY);
      return () => clearTimeout(t);
    }

    const duration = isClimateChange
      ? C3_TIMINGS[currentFrame]
      : C2_FRAME_DURATION; // C1 and C2 share same duration

    if (currentFrame >= totalFrames - 1) {
      const t = setTimeout(() => setShowFinalMessage(true), duration);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrentFrame((p) => p + 1), duration);
    return () => clearTimeout(t);
  }, [currentFrame, showFinalMessage, onComplete, isClimateChange, isComposting, totalFrames]);

  const handleSkip = () => {
    setCurrentFrame(totalFrames - 1);
    setShowFinalMessage(true);
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="fixed inset-0 z-50 bg-ocean-gradient flex flex-col overflow-hidden font-cairo">
      {!showFinalMessage && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isClimateChange ? 10 : 0 }}
          onClick={handleSkip}
          className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} z-50 glass border border-white/30 rounded-kid text-white/90 font-bold text-sm px-4 py-2 hover:bg-white/25 active:scale-95 transition-all flex items-center gap-2`}
        >
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
              {isClimateChange ? (
                <>
                  {currentFrame === 0 && <C3_Frame0 isAr={isAr} />}
                  {currentFrame === 1 && <C3_Frame1 isAr={isAr} />}
                  {currentFrame === 2 && <C3_Frame2 isAr={isAr} />}
                  {currentFrame === 3 && <C3_Frame3 isAr={isAr} />}
                </>
              ) : isComposting ? (
                <>
                  {currentFrame === 0 && <C2_Frame0 isAr={isAr} />}
                  {currentFrame === 1 && <C2_Frame1 isAr={isAr} />}
                  {currentFrame === 2 && <C2_Frame2 isAr={isAr} />}
                  {currentFrame === 3 && <C2_Frame3 isAr={isAr} />}
                  {currentFrame === 4 && <C2_Frame4 isAr={isAr} />}
                </>
              ) : (
                <>
                  {currentFrame === 0 && <C1_Frame0 isAr={isAr} />}
                  {currentFrame === 1 && <C1_Frame1 isAr={isAr} />}
                  {currentFrame === 2 && <C1_Frame2 isAr={isAr} />}
                  {currentFrame === 3 && <C1_Frame3 isAr={isAr} />}
                  {currentFrame === 4 && <C1_Frame4 isAr={isAr} />}
                  {currentFrame === 5 && <C1_Frame5 isAr={isAr} />}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showFinalMessage && (
        <div className="flex justify-center items-center gap-3 pb-8 pt-3">
          {Array.from({ length: totalFrames }).map((_, i) => (
            <motion.div key={i} animate={{ width: i === currentFrame ? "2rem" : "0.75rem", opacity: i <= currentFrame ? 1 : 0.3 }} className={`h-3 rounded-full ${i === currentFrame ? "bg-success" : i < currentFrame ? "bg-white/65" : "bg-white/25"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
