// PAGE 5 — Zone Quiz (contenu d'une zone)
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Turtle from '@/components/Turtle';
import QuizCard from '@/components/QuizCard';

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  tip: string;
}

interface ZoneData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function ZonePage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const zoneId = params.id as string;
  const [zone, setZone] = useState<ZoneData | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    async function fetchZone() {
      try {
        const res = await fetch(`/api/zones/${zoneId}`);
        if (res.ok) setZone(await res.json());
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
    if (status === 'authenticated' && zoneId) fetchZone();
  }, [status, zoneId]);

  // Données fallback — Zone 1 du Concours 1
  const fallbackZone: ZoneData = {
    id: zoneId,
    title: '🏝️ تصنيف النفايات',
    description: 'تعلّم كيفية فرز النفايات وتصنيفها بشكل صحيح',
    questions: [
      {
        id: 'q1', text: 'أي من هذه المواد يمكن إعادة تدويرها؟',
        options: ['قشور الفاكهة', 'الزجاجات البلاستيكية', 'الطعام المتبقي', 'أوراق الشجر'],
        answer: 1, tip: 'الزجاجات البلاستيكية يمكن إعادة تدويرها وتحويلها إلى منتجات جديدة!'
      },
      {
        id: 'q2', text: 'ما هو لون حاوية النفايات البلاستيكية عادة؟',
        options: ['أخضر', 'أحمر', 'أصفر', 'أزرق'],
        answer: 2, tip: 'في كثير من الدول، اللون الأصفر مخصص للبلاستيك والمعادن!'
      },
      {
        id: 'q3', text: 'كم سنة تحتاج الزجاجة البلاستيكية لتتحلل في الطبيعة؟',
        options: ['10 سنوات', '50 سنة', '100 سنة', '450 سنة'],
        answer: 3, tip: 'الزجاجة البلاستيكية تحتاج حوالي 450 سنة لتتحلل! لذلك إعادة التدوير مهمة جدا.'
      },
      {
        id: 'q4', text: 'أي من هذه النفايات تعتبر عضوية؟',
        options: ['علبة معدنية', 'كيس بلاستيكي', 'قشرة موز', 'زجاجة'],
        answer: 2, tip: 'النفايات العضوية هي بقايا الطعام والنباتات التي يمكن تحويلها إلى سماد!'
      },
    ],
  };

  const displayZone = zone || fallbackZone;
  const questions = displayZone.questions;

  const saveProgress = useCallback(async (earnedXP: number) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId, xpEarned: earnedXP }),
      });
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    }
  }, [zoneId]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setCompleted(true);
      const earnedXP = score * 25;
      saveProgress(earnedXP);
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <Turtle mood="thinking" size="lg" message="جاري تحميل الأسئلة... ⏳" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-success-50/30">
      {/* En-tête */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-[60px] z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()}
            className="text-primary hover:text-primary-700 flex items-center gap-2 font-semibold transition-colors">
            <span>→</span> العودة
          </button>
          <div className="flex items-center">
            <Image src="/images/ecoscience-text-logo.png" alt="InNOScEnce" width={100} height={100} className="object-contain" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!completed ? (
            <div key="quiz">
              {/* Intro de la zone */}
              {currentQ === 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8">
                  <h1 className="text-3xl font-black text-primary-800 mb-3">{displayZone.title}</h1>
                  <p className="text-gray-500 text-lg">{displayZone.description}</p>
                </motion.div>
              )}

              {/* Question courante */}
              <QuizCard
                key={currentQ}
                question={questions[currentQ].text}
                options={questions[currentQ].options}
                correctAnswer={questions[currentQ].answer}
                tip={questions[currentQ].tip}
                questionNumber={currentQ + 1}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
                onNext={handleNext}
              />
            </div>
          ) : (
            /* Écran de fin */
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12">
              <Turtle mood="celebrating" size="xl"
                message={score === questions.length ? 'ممتاز! نتيجة مثالية! 🏆' : 'أحسنت! تعلمت أشياء جديدة! 🌟'} />

              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-4xl font-black text-primary-800 mt-8 mb-4">
                🎉 أحسنت!
              </motion.h2>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="bg-white rounded-kid shadow-kid p-6 max-w-sm mx-auto mb-8">
                <p className="text-2xl font-bold text-primary mb-2">النتيجة</p>
                <p className="text-5xl font-black text-success mb-2">{score}/{questions.length}</p>
                <p className="text-gray-500">+ {score * 25} نقطة ⭐</p>
              </motion.div>

              {/* Confetti émojis */}
              {[...Array(12)].map((_, i) => (
                <motion.span key={i} className="absolute text-2xl pointer-events-none"
                  style={{ left: `${10 + Math.random() * 80}%`, top: `${Math.random() * 30}%` }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [0, 200 + Math.random() * 200], x: (Math.random() - 0.5) * 100, rotate: Math.random() * 360 }}
                  transition={{ duration: 2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}>
                  {['🎉', '⭐', '🌟', '🎊', '🐢', '♻️'][i % 6]}
                </motion.span>
              ))}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                className="flex gap-4 justify-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => router.back()}
                  className="btn-primary">
                  العودة للخريطة 🗺️
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
