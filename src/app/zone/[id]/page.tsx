'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Turtle from '@/components/Turtle';
import { useLanguage } from '@/context/LanguageContext';

interface Question {
  id: string;
  text: string;
  textFr?: string;
  options: string[];
  optionsFr?: string[];
  answer: number;
  tip: string;
  tipFr?: string;
}

interface ZoneData {
  id: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  contestId: string;
  questions: Question[];
  images?: string[];
}

export default function ZonePage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useLanguage();
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
  }, [status, zoneId]);

  const getFallback = (id: string, realContestId?: string): ZoneData => {
    // Traductions système pour les zones par défaut (si non définies en BDD)
    const SYSTEM_ZONES: Record<string, { title: string; description: string }> = {
      '69e51151482488070228f2ba': { 
        title: locale === 'ar' ? 'تصنيف النفايات' : 'Tri des déchets', 
        description: locale === 'ar' 
          ? 'هذه سلحفاةٌ تأذّت بسبب الأكياس البلاستيكية التي رُميت في غير مكانها الصحيح، لذلك فإنّ تنظيم النفايات ورميها في الأماكن المخصّصة أمرٌ مهمّ جدًّا.'
          : 'Voici une tortue qui a été blessée par des sacs en plastique jetés au mauvais endroit. C\'est pourquoi le tri et l\'élimination des déchets dans les zones dédiées sont extrêmement importants.'
      },
      '69e51151482488070228f2bf': { 
        title: locale === 'ar' ? 'المواد' : 'Les Matériaux', 
        description: locale === 'ar'
          ? 'هل تعلم أنّ الكيس البلاستيكي قد يستغرق مئات السنين ليتحلّل في الطبيعة، وخلال ذلك يمكن أن يؤذي الحيوانات مثل السلاحف التي تظنّه طعامًا؟'
          : 'Savais-tu qu\'un sac plastique peut mettre des centaines d\'années à se décomposer dans la nature, et pendant ce temps, il peut blesser des animaux comme les tortues qui le confondent avec de la nourriture ?'
      },
      '69e51151482488070228f2c4': { 
        title: locale === 'ar' ? 'إنقاذ الكوكب' : 'Sauver la planète', 
        description: locale === 'ar'
          ? 'اكتشف كيف يمكن لتصرّفات بسيطة مثل رمي النفايات في مكانها الصحيح وإعادة التدوير أن تُسهم في حماية كوكبنا'
          : 'Découvre comment des gestes simples, comme jeter les déchets au bon endroit et recycler, peuvent contribuer à protéger notre planète.'
      },
    };

    if (SYSTEM_ZONES[id]) {
      return {
        id,
        contestId: realContestId || '69e51150482488070228f2b8',
        questions: [],
        title: SYSTEM_ZONES[id].title,
        description: SYSTEM_ZONES[id].description,
        images: id === '69e51151482488070228f2ba' ? ['/images/turtle-hurt-1.jpg', '/images/turtle-hurt-2.jpg'] 
               : id === '69e51151482488070228f2bf' ? ['/images/turtle-fact-material.png']
               : id === '69e51151482488070228f2c4' ? ['/images/saving-planet-1.png', '/images/saving-planet-2.png', '/images/saving-planet-3.png']
               : []
      };
    }

    const factsListAr = [
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

    const factsListFr = [
      {
        title: '🟢 Tri des déchets',
        description: 'Le tri aide au recyclage facile ✨\nChaque matériau a sa poubelle : plastique, papier, verre, métal 🗑️\nUn bon tri réduit la pollution et préserve la nature 🌳'
      },
      {
        title: '🔵 Matériaux Magiques',
        description: 'Le plastique peut devenir des jouets ou vêtements ! 🧸\nLe papier peut être recyclé 7 fois pour sauver les arbres 🌲\nLe verre et le métal sont éternels ! ♾️'
      },
      {
        title: '🌎 Sauver la Planète',
        description: 'Recycler sauve les animaux et réduit les déchets 🐢\nProtéger les océans et la nature est essentiel 🌊\nTu es un héros écolo ! Chaque geste compte 🦸‍♂️'
      }
    ];

    const factsList = locale === 'ar' ? factsListAr : factsListFr;
    const index = (id.charCodeAt(id.length - 1) % factsList.length) || 0;
    return { id, contestId: '', questions: [], ...factsList[index] };
  };

  const isSpecialZone = zoneId === '69e51151482488070228f2ba' || zoneId === '69e51151482488070228f2bf' || zoneId === '69e51151482488070228f2c4';
  
  // Appliquer les traductions système au besoin
  let displayZone = (isSpecialZone ? getFallback(zoneId, zone?.contestId) : zone) || getFallback(zoneId);
  
  if (!isAr && displayZone && !displayZone.titleFr) {
    const fallback = getFallback(displayZone.id, displayZone.contestId);
    displayZone = { ...displayZone, titleFr: fallback.title, descriptionFr: fallback.description };
  }

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
        <Turtle mood="thinking" size="lg" message={t('loading_facts')} />
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
            <span>{locale === 'ar' ? '→' : '←'}</span> {t('back')}
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
                <Turtle mood="happy" size="lg" message={t('ready_discover')} />
              </div>
              
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 border border-primary-100 max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 border-b border-primary-50 pb-6">
                    <motion.div 
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-gradient-to-r from-success to-success-400 text-white px-6 py-2 rounded-full text-xl font-black shadow-lg"
                    >
                      {t('did_you_know')}
                    </motion.div>
                    <h1 className="text-4xl font-black text-primary-800">
                      {(locale === 'fr' && displayZone.titleFr) ? displayZone.titleFr : displayZone.title}
                    </h1>
                  </div>

                  <div className="space-y-6 mb-10 text-right">
                    {((locale === 'fr' && displayZone.descriptionFr) ? displayZone.descriptionFr : displayZone.description).split('\n').filter(l => l.trim()).map((line, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.2 }}
                        whileHover={{ scale: 1.02, x: locale === 'ar' ? -5 : 5 }}
                        className={`flex items-start gap-5 p-6 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-all
                                  ${locale === 'ar' ? 'bg-gradient-to-l from-white to-primary-50/30' : 'bg-gradient-to-r from-white to-primary-50/30 flex-row-reverse text-left'}`}
                      >
                        <p className={`text-2xl text-gray-800 font-bold flex-1 leading-relaxed ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                          {line}
                        </p>
                        <span className="text-4xl mt-1 filter drop-shadow-sm">
                          {factIcons[i % factIcons.length]}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Images après la phrase */}
                  {displayZone.images && (
                    <div className="flex flex-wrap justify-center gap-6 mb-10">
                      {displayZone.images.map((src, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.2 }}
                          className="rounded-3xl overflow-hidden border-8 border-white shadow-2xl max-w-md w-full"
                        >
                          <img src={src} alt="Illustration" className="w-full h-auto object-contain" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={handleComplete}
                    className="btn-primary text-2xl px-12 py-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 group"
                  >
                    <span className="group-hover:scale-110 transition-transform">{t('im_hero')}</span>
                    <span className="text-3xl">🐢</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Écran de fin */
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12">
              <Turtle mood="celebrating" size="xl" message={t('well_done')} />

              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-4xl font-black text-primary-800 mt-8 mb-4">
                {t('great_job')}
              </motion.h2>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="bg-white rounded-3xl shadow-xl p-6 max-w-sm mx-auto mb-8 border border-primary-50">
                <p className="text-2xl font-bold text-primary mb-2">{t('mission_complete')}</p>
                <p className="text-gray-500 text-xl">{t('lesson_finished')}</p>
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
                  {t('return_map')}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
