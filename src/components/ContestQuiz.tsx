"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Interfaces ─────────────────────────────────────────────────────────── */

interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  correct: boolean;
  points: number;
}

interface QuizResult {
  score: number;
  errors: number;
  timeSpent: number;
  answers: QuizAnswer[];
}

interface ContestQuizProps {
  timeSpent: number;
  initialAnswers?: QuizAnswer[];
  onComplete: (result: QuizResult) => void;
  onProgress?: (answers: QuizAnswer[], currentScore: number, currentErrors: number) => void;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

export const QUESTIONS_AR = [
  {
    text: "إعادة التدوير تعني :",
    options: ["إخفاء النفاية", "تحويل النفاية لصنع شيء جديد", "رمي الأشياء في الطبيعة"],
    answer: 1,
    points: 3,
    tip: "إعادة التدوير تمنح المواد فائدة جديدة بدلاً من التخلي عنها",
  },
  {
    text: "أيّ من هذه الأشياء يذهب مع الورق/الكرتون؟",
    options: ["كراسة منتهية", "زجاجة زجاج", "علبة معدنية"],
    answer: 0,
    points: 3,
    tip: "الكراسة نفاية من نوع ورق/كرتون",
  },
  {
    text: "قبل رمي لعبة لا تزال في حالة جيدة، أفضل فكرة هي :",
    options: ["كسرها", "التبرع بها", "تركها في الخارج"],
    answer: 1,
    points: 3,
    tip: "الأشياء التي لا تزال صالحة يمكن أن تحصل على حياة ثانية عبر التبرع",
  },
  {
    text: "فرز النفايات يهدف أساساً إلى :",
    options: ["خلط النفايات", "المساعدة في إعادة التدوير والاستخدام", "ملء الشوارع"],
    answer: 1,
    points: 3,
    tip: "الفرز يساعد على التقليل وإعادة الاستخدام والوقاية",
  },
  {
    text: "صح أم خطأ : كل أنواع البلاستيك تُعاد تدويرها بنفس الطريقة.",
    options: ["صح", "خطأ"],
    answer: 1,
    points: 3,
    tip: "البلاستيك أنواع مختلفة ولا تُعاد تدويرها جميعاً معاً",
  },
  {
    text: "أيّ فعل ينتج أقل نفايات؟",
    options: ["استخدام قارورة ماء معاد استخدامها", "شراء زجاجة تُرمى كل يوم", "استخدام أكواب للاستخدام مرة واحدة"],
    answer: 0,
    points: 3,
    tip: "إعادة الاستخدام تقلل النفايات من المصدر",
  },
  {
    text: "قميص قديم لا يزال نظيفاً يمكن :",
    options: ["التبرع به", "رميه في الشارع", "إخفاؤه في الخزانة للأبد"],
    answer: 0,
    points: 3,
    tip: "التبرع أو البيع يمنح الملابس حياة ثانية",
  },
  {
    text: "إذا لم تجد سلة مهملات قريبة، ماذا تفعل بنفايتك الصغيرة؟",
    options: ["أرميها على الأرض", "أحتفظ بها حتى أجد سلة", "أضعها في زاوية الحائط"],
    answer: 1,
    points: 3,
    tip: "نفاية صغيرة مرمية في الخارج تبقى ملوِّثة",
  },
  {
    text: "الشيء المكسور أحياناً يمكن :",
    options: ["إصلاحه", "ألا يفيد أبداً", "أن يتحول وحده"],
    answer: 0,
    points: 3,
    tip: "كثير من الأشياء خارج الاستخدام يمكن إصلاحها",
  },
  {
    text: "لماذا لا يجب رمي النفايات في الطبيعة؟",
    options: ["لأنها تلوّث وتؤذي الحيوانات", "لأنها تختفي في دقيقة", "لأنها تنقي الهواء"],
    answer: 0,
    points: 3,
    tip: "النفايات المتروكة تلوّث البيئة وتضر بالكائنات الحية",
  },
  {
    text: "أيّ مادة يمكن إعادة تدويرها عدة مرات دون أن تفقد طبيعتها؟",
    options: ["الزجاج", "الخبز", "رمل الشاطئ"],
    answer: 0,
    points: 3,
    tip: "الزجاج مادة كلاسيكية لإعادة التدوير",
  },
  {
    text: "أفضل تصرف مع شيء لا تستخدمه بعد الآن هو أولاً :",
    options: ["البحث عن إعادة استخدامه أو التبرع به أو إصلاحه", "رميه فوراً", "تركه في الفناء"],
    answer: 0,
    points: 3,
    tip: "الحياة الثانية والإصلاح وإعادة الاستخدام تسبق الرمي",
  },
  {
    text: "أفضل حقيبة للتسوق عدة مرات هي :",
    options: ["حقيبة قماشية", "حقيبة تُرمى فوراً", "غلاف ورقي مبلل"],
    answer: 0,
    points: 4,
    tip: "الحقيبة المعاد استخدامها تساعد على تقليل النفايات",
  },
  {
    text: "البطارية المستعملة يجب وضعها في :",
    options: ["صندوق جمع خاص", "الشارع", "أصيص الزهور"],
    answer: 0,
    points: 4,
    tip: "البطاريات نفايات خاصة لا تُخلط مع النفايات العادية",
  },
  {
    text: "أيّ وجبة خفيفة تنتج أقل نفايات؟",
    options: ["قارورة + علبة وجبة معاد استخدامها", "ثلاثة أغلفة فردية للاستخدام مرة واحدة", "مشروب بقشة وكوب للاستخدام مرة واحدة"],
    answer: 0,
    points: 4,
    tip: "نقلل النفايات أكثر عند إعادة استخدام الأوعية",
  },
  {
    text: "برطمان زجاجي فارغ يمكن استخدامه لـ :",
    options: ["تخزين الأقلام أو الأزرار", "رميه في الطبيعة", "كسره عمداً"],
    answer: 0,
    points: 4,
    tip: "قبل إعادة التدوير، يمكن إعادة الاستخدام",
  },
  {
    text: "رمز الأسهم الثلاثة الدائرية يعني غالباً :",
    options: ["تحذير، شيء خطير", "فرز / إعادة التدوير ممكنة", "شيء ممنوع في المدرسة"],
    answer: 1,
    points: 4,
    tip: "هذا الرمز يساعد الأطفال على التعرف على الفرز وإعادة التدوير",
  },
  {
    text: "بعد نشاط يدوي بالورق، التصرف الصحيح هو :",
    options: ["جمع قطع الورق وفرزها", "تركها على الأرض", "وضعها خارجاً في الفناء"],
    answer: 0,
    points: 4,
    tip: "الفرز يبدأ بالتصرف الصحيح في الفصل",
  },
];

export const QUESTIONS_FR = [
  {
    text: "Le recyclage signifie :",
    options: ["Cacher le déchet", "Transformer le déchet pour fabriquer du neuf", "Jeter dans la nature"],
    answer: 1,
    points: 3,
    tip: "Le recyclage donne une nouvelle vie aux objets au lieu de les jeter !",
  },
  {
    text: "Lequel de ces objets va avec le papier/carton ?",
    options: ["Un vieux cahier", "Une bouteille en verre", "Une boîte de conserve"],
    answer: 0,
    points: 3,
    tip: "Le cahier est un déchet de type papier ou carton.",
  },
  {
    text: "Avant de jeter un jouet encore en bon état, il vaut mieux :",
    options: ["Le casser", "Le donner", "Le laisser dehors"],
    answer: 1,
    points: 3,
    tip: "Les objets encore utilisables peuvent servir à d'autres enfants !",
  },
  {
    text: "Trier ses déchets sert principalement à :",
    options: ["Tout mélanger", "Aider au recyclage et à la réutilisation", "Remplir les rues"],
    answer: 1,
    points: 3,
    tip: "Le tri permet de protéger notre environnement.",
  },
  {
    text: "Vrai ou Faux : Tous les plastiques se recyclent de la même façon.",
    options: ["Vrai", "Faux"],
    answer: 1,
    points: 3,
    tip: "Il existe plusieurs types de plastiques différents.",
  },
  {
    text: "Quelle action produit le moins de déchets ?",
    options: ["Utiliser une gourde réutilisable", "Acheter une bouteille jetable", "Utiliser des gobelets jetables"],
    answer: 0,
    points: 3,
    tip: "Réutiliser réduit les déchets à la source.",
  },
  {
    text: "Un vieux t-shirt encore propre peut être :",
    options: ["Donné", "Jeté dans la rue", "Caché pour toujours"],
    answer: 0,
    points: 3,
    tip: "Donner ou vendre offre une seconde vie aux vêtements.",
  },
  {
    text: "Si tu ne trouves pas de poubelle, que fais-tu de ton petit déchet ?",
    options: ["Je le jette par terre", "Je le garde jusqu'à trouver une poubelle", "Je le cache dans un coin"],
    answer: 1,
    points: 3,
    tip: "Un déchet par terre pollue la nature.",
  },
  {
    text: "Un objet cassé peut parfois être :",
    options: ["Réparé", "Inutile pour toujours", "Transformé tout seul"],
    answer: 0,
    points: 3,
    tip: "Beaucoup d'objets peuvent être réparés au lieu d'être jetés.",
  },
  {
    text: "Pourquoi ne faut-il pas jeter de déchets dans la nature ?",
    options: ["Car ils polluent et blessent les animaux", "Car ils disparaissent vite", "Car ils nettoient l'air"],
    answer: 0,
    points: 3,
    tip: "Les déchets sont dangereux pour les animaux et les plantes.",
  },
  {
    text: "Quel matériau peut être recyclé à l'infini sans s'abîmer ?",
    options: ["Le verre", "Le pain", "Le sable"],
    answer: 0,
    points: 3,
    tip: "Le verre est le champion du recyclage !",
  },
  {
    text: "Le meilleur réflexe avec un objet dont on n'a plus besoin est :",
    options: ["Le donner ou le réparer", "Le jeter tout de suite", "Le laisser traîner"],
    answer: 0,
    points: 3,
    tip: "Réutiliser est meilleur que jeter.",
  },
  {
    text: "Le meilleur sac pour faire les courses plusieurs fois est :",
    options: ["Un sac en tissu", "Un sac jetable", "Une feuille de papier"],
    answer: 0,
    points: 4,
    tip: "Le sac réutilisable protège la planète.",
  },
  {
    text: "Une pile usagée doit être mise dans :",
    options: ["Un bac de collecte spécial", "La rue", "Un pot de fleurs"],
    answer: 0,
    points: 4,
    tip: "Les piles contiennent des produits dangereux.",
  },
  {
    text: "Quel goûter produit le moins de déchets ?",
    options: ["Une gourde + une boîte réutilisable", "Trois emballages jetables", "Une boisson avec paille jetable"],
    answer: 0,
    points: 4,
    tip: "Les boîtes réutilisables sont plus écologiques.",
  },
  {
    text: "Un bocal en verre vide peut servir à :",
    options: ["Ranger des crayons ou boutons", "Le jeter dans la forêt", "Le casser"],
    answer: 0,
    points: 4,
    tip: "On peut s'amuser à détourner les objets !",
  },
  {
    text: "Le symbole des trois flèches en cercle signifie :",
    options: ["Danger", "Tri / Recyclage possible", "Interdit"],
    answer: 1,
    points: 4,
    tip: "Ce logo aide à reconnaître les produits recyclables.",
  },
  {
    text: "Après un bricolage, la bonne action est de :",
    options: ["Ramasser et trier les papiers", "Tout laisser par terre", "Les jeter dehors"],
    answer: 0,
    points: 4,
    tip: "Le tri commence dès la fin de l'activité.",
  },
];

export const QUESTIONS = QUESTIONS_AR;

const LABELS = ["A", "B", "C"];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Sequence Component ─────────────────────────────────────────────────── */

function SequenceView({
  type,
  showSkip,
  onSkip,
}: {
  type: number;
  showSkip: boolean;
  onSkip: () => void;
}) {
  const { t, locale } = useLanguage();
  
  const renderContent = () => {
    const isAr = locale === 'ar';
    switch (type) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <motion.div animate={{ rotate: [-10, 10, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-8xl mb-6">🐢</motion.div>
            <h2 className="text-2xl font-black text-primary-800 text-center">{isAr ? 'أنت رائع! استمر ✨' : 'Tu es génial ! Continue ✨'}</h2>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-6 bg-primary-50 p-6 rounded-full shadow-kid">💡</motion.div>
            <h2 className="text-2xl font-black text-amber-500 mb-2">{t('did_you_know')}</h2>
            <p className="text-xl font-bold text-primary-800 text-center leading-relaxed px-4">{isAr ? 'الزجاج يمكن إعادة تدويره إلى الأبد!' : 'Le verre peut être recyclé à l\'infini !'}</p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center">
            <motion.div animate={{ x: [0, 60, 90], y: [0, -30, 0], rotate: [0, 180, 360], opacity: [1, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-12">🥤</motion.div>
            <h2 className="text-xl font-bold text-success-700 text-center mt-8">{isAr ? 'كل نفاية في مكانها الصحيح!' : 'Chaque déchet à sa place !'}</h2>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center w-full max-w-sm px-6">
            <h2 className="text-2xl font-black text-primary-800 mb-8 text-center">{isAr ? 'نقاطك ترتفع! ⭐' : 'Tes points montent ! ⭐'}</h2>
            <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden relative shadow-inner">
              <motion.div initial={{ width: "30%" }} animate={{ width: "80%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-success-400 to-success-600" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="sequence" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="bg-white rounded-kid shadow-kid p-8 md:p-12 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {renderContent()}
      <AnimatePresence>
        {showSkip && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={onSkip}
            className={`absolute bottom-6 ${locale === 'ar' ? 'left-6' : 'right-6'} text-gray-400 hover:text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-sm`}
          >
            {isAr ? 'تخطي ⏩' : 'Passer ⏩'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ContestQuiz({
  timeSpent,
  initialAnswers = [],
  onComplete,
  onProgress,
}: ContestQuizProps) {
  const { t, locale } = useLanguage();
  const QUESTIONS_LIST = useMemo(() => locale === 'ar' ? QUESTIONS_AR : QUESTIONS_FR, [locale]);
  
  const [currentQ, setCurrentQ] = useState(initialAnswers.length);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showTurtle, setShowTurtle] = useState(false);
  
  const [score, setScore] = useState(() => initialAnswers.reduce((a, b) => a + b.points, 0));
  const [errors, setErrors] = useState(() => initialAnswers.reduce((a, b) => a + (b.correct ? 0 : 1), 0));
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialAnswers);

  const [sequenceActive, setSequenceActive] = useState(false);
  const [sequenceType, setSequenceType] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const q = QUESTIONS_LIST[currentQ];
  const total = QUESTIONS_LIST.length;
  const isLastQ = currentQ === total - 1;
  const isBonus = q?.points === 4;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);

    const correct = idx === q.answer;
    const pts = correct ? q.points : 0;

    setScore((prev) => prev + pts);
    if (!correct) setErrors((prev) => prev + 1);

    setAnswers((prev) => {
      const newAnswers = [
        ...prev,
        { questionIndex: currentQ, selectedAnswer: idx, correct, points: pts },
      ];
      if (onProgress) {
        onProgress(newAnswers, score + pts, errors + (correct ? 0 : 1));
      }
      return newAnswers;
    });

    setShowTurtle(true);
    setShowNext(true);
  };

  const skipSequence = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
    setSequenceActive(false);
    setCurrentQ((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
    setShowNext(false);
    setShowTurtle(false);
  }, []);

  const handleNext = () => {
    if (isLastQ) {
      onComplete({ score, errors, timeSpent, answers });
      return;
    }
    
    if ((currentQ + 1) % 3 === 0) {
      setSequenceType(Math.floor(Math.random() * 4));
      setSequenceActive(true);
      setShowSkip(false);
      skipTimeoutRef.current = setTimeout(() => setShowSkip(true), 2000);
      timeoutRef.current = setTimeout(skipSequence, 4000);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
      setShowNext(false);
      setShowTurtle(false);
    }
  };

  const optionClass = (idx: number): string => {
    if (!answered) return "bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary-50 text-gray-700 cursor-pointer";
    if (idx === selected) return "bg-primary-50 border-2 border-primary text-primary-700 cursor-default";
    return "bg-gray-50 border-2 border-gray-200 text-gray-400 cursor-default";
  };

  if (!q) return null;

  return (
    <div className="py-6 px-4 w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-kid shadow-kid p-4 mb-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-kid"
            >
              <span>⏱️</span> <span className="font-mono tabular-nums" dir="ltr">{formatTime(timeSpent)}</span>
            </motion.div>
            <div className="bg-primary-50 text-primary-700 border border-primary-100 px-4 py-1.5 rounded-full text-sm font-bold">
              {t('quiz_question')} {currentQ + 1} {t('quiz_of')} {total}
            </div>
          </div>
          <div className="flex gap-0.5">
            {QUESTIONS_LIST.map((_, i) => (
              <motion.div key={i} className={`h-2 flex-1 rounded-full ${i < currentQ ? 'bg-primary-300' : i === currentQ ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sequenceActive ? (
            <SequenceView key="sequence" type={sequenceType} showSkip={showSkip} onSkip={skipSequence} />
          ) : (
            <motion.div key={currentQ} initial={{ opacity: 0, x: locale === 'ar' ? 60 : -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: locale === 'ar' ? -60 : 60 }} transition={{ duration: 0.3 }}>
              <div className="bg-white rounded-kid shadow-kid p-6 md:p-8">
                <div className="flex justify-start mb-4">
                  <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isBonus ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-primary-50 text-primary-700 border border-primary-200'}`}>
                    ⭐ {q.points} {t('quiz_score')} {isBonus && <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full mr-1">Bonus</span>}
                  </motion.span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-800 mb-6 text-center">{q.text}</h2>
                <div className="grid gap-3 mb-4">
                  {q.options.map((opt, i) => (
                    <motion.button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={`w-full p-4 rounded-kid font-semibold ${locale === 'ar' ? 'text-right' : 'text-left'} flex items-center gap-3 ${optionClass(i)}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${!answered ? 'bg-primary-100 text-primary' : i === selected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {LABELS[i]}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </motion.button>
                  ))}
                </div>
                {answered && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex justify-center mb-6">
                      <Turtle mood="happy" message={`${locale === 'ar' ? 'شكراً! هل تعلم أن...' : 'Merci ! Le savais-tu...'} 🐢 ${q.tip}`} size="md" />
                    </div>
                    <button onClick={handleNext} className="w-full btn-primary py-3 text-lg">
                      {isLastQ ? t('quiz_finish') : t('quiz_next')} {locale === 'ar' ? '➡️' : '➡️'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
