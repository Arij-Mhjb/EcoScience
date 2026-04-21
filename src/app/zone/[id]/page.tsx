// PAGE 5 — Zone Quiz (contenu d'une zone)
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Turtle from '@/components/Turtle';

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
  contestId: string;
  questions: Question[];
}

export default function ZonePage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const zoneId = params.id as string;
  const [zone, setZone] = useState<ZoneData | null>(null);
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
  }, [status, zoneId]);  // Données fallback basées sur les faits réels fournis par l'utilisateur
  const getFallback = (id: string): ZoneData => {
    const factsList = [
      {
        title: '🟢 تنظيم النفايات',
        description: 'فرز النفايات يساعد على إعادة تدويرها بسهولة ✨\nكل مادة لها سلة خاصة بها: بلاستيك، ورق، زجاج، معدن 🗑️\nالفرز الصحيح يقلل من التلوث ويحافظ على بيئتنا الجميلة 🌳'
      },
      {
        title: '🔵 المواد العجيبة',
        description: 'البلاستيك يمكن تحويله إلى ألعاب وملابس جديدة! 🧸\nالورق يمكن إعادة تصنيعه 7 مرات لإنقاذ الأشجار 🌲\nالزجاج والمعدن أبطال خارقون، يمكن إعادة استخدامهما للأبد! ♾️'
      },
      {
        title: '🌎 إنقاذ الكوكب',
        description: 'إعادة التدوير تقلل من جبال النفايات وتنقذ الحيوانات 🐢\nتقليل النفايات يحمي أصدقاءنا في البحر والطبيعة 🌊\nأنت بطل بيئي! كل فعل بسيط منك يساعد كوكبنا 🦸‍♂️'
      }
    ];
    // Sélection déterministe
    const index = (id.charCodeAt(id.length - 1) % factsList.length) || 0;
    return { id, contestId: '', questions: [], ...factsList[index] };
  };

  const displayZone = zone || getFallback(zoneId);

  const saveProgress = useCallback(async (earnedXP: number, contestId?: string) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId, xpEarned: earnedXP, contestId }),
      });
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    }
  }, [zoneId]);

  const handleComplete = () => {
    setCompleted(true);
    const earnedXP = 0;
    saveProgress(earnedXP, displayZone.contestId);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <Turtle mood="thinking" size="lg" message="جاري تحميل حقائق مذهلة... ⏳" />
      </main>
    );
  }

  const factIcons = ['💡', '🌟', '🌈', '🔥'];

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
            <motion.div key="lesson" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-8">
                <Turtle mood="happy" size="lg" message="هل أنت مستعد لتصبح بطلاً بيئياً؟ اقرأ هذه الحقائق! 🐢✨" />
              </div>
              
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 border border-primary-100 max-w-3xl mx-auto text-right" dir="rtl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 border-b border-primary-50 pb-6">
                  <motion.div 
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-gradient-to-r from-success to-success-400 text-white px-6 py-2 rounded-full text-xl font-black shadow-lg"
                  >
                    هل تعلم؟ 🤔
                  </motion.div>
                  <h1 className="text-4xl font-black text-primary-800">
                    {displayZone.title}
                  </h1>
                </div>
                
                <div className="space-y-6 mb-10 text-right">
                  {displayZone.description.split('\n').filter(l => l.trim()).map((line, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.2 }}
                      whileHover={{ scale: 1.02, x: -5 }}
                      className="flex items-start gap-5 bg-gradient-to-l from-white to-primary-50/30 p-6 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <p className="text-2xl text-gray-800 font-bold flex-1 leading-relaxed">
                        {line}
                      </p>
                      <span className="text-4xl mt-1 filter drop-shadow-sm">
                        {factIcons[i % factIcons.length]}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={handleComplete}
                    className="btn-primary text-2xl px-12 py-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 group"
                  >
                    <span className="group-hover:scale-110 transition-transform">أنا بطل بيئي! ✅</span>
                    <span className="text-3xl">🐢</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Écran de fin */
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12">
              <Turtle mood="celebrating" size="xl" message="أحسنت! لقد أكملت هذه المنطقة بنجاح! 🌟" />

              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-4xl font-black text-primary-800 mt-8 mb-4">
                🎉 رائع جداً!
              </motion.h2>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="bg-white rounded-3xl shadow-xl p-6 max-w-sm mx-auto mb-8 border border-primary-50">
                <p className="text-2xl font-bold text-primary mb-2">مهمة اكتملت!</p>
                <p className="text-gray-500 text-xl">لقد أتممت الدرس بنجاح وفتحت المنطقة التالية! 🗺️</p>
              </motion.div>

              {/* Confetti émojis */}
              {[...Array(12)].map((_, i) => (
                <motion.span key={i} className="absolute text-2xl pointer-events-none"
                  style={{ left: `${10 + Math.random() * 80}%`, top: `${Math.random() * 30}%` }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [0, 200 + Math.random() * 200], x: (Math.random() - 0.5) * 100, rotate: Math.random() * 360 }}
                  transition={{ duration: 2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}>
                  {['🎉', '⭐', '🌟', '🎊', '🐢', '📚'][i % 6]}
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
