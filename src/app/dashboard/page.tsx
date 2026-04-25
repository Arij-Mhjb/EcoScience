'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Turtle from '@/components/Turtle';
import ContestCard from '@/components/ContestCard';
import XPBar from '@/components/XPBar';
import { useLanguage } from '@/context/LanguageContext';

interface Contest {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

interface UserProgress {
  xp: number;
  level: number;
  completedZones: string[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [contests, setContests] = useState<Contest[]>([]);
  const [progress, setProgress] = useState<UserProgress>({ xp: 0, level: 1, completedZones: [] });
  const [loading, setLoading] = useState(true);

  // Rediriger si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Charger les concours et la progression
  useEffect(() => {
    async function fetchData() {
      try {
        const [contestsRes, progressRes] = await Promise.all([
          fetch('/api/contests'),
          fetch('/api/progress'),
        ]);
        if (contestsRes.ok) {
          const data = await contestsRes.json();
          setContests(data);
        }
        if (progressRes.ok) {
          const data = await progressRes.json();
          setProgress(data);
        }
      } catch (err) {
        console.error('Erreur de chargement:', err);
      } finally {
        setLoading(false);
      }
    }
    if (status === 'authenticated') fetchData();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Turtle mood="thinking" size="lg" message={t('loading')} />
        </motion.div>
      </main>
    );
  }

  // Données fallback si l'API n'est pas encore connectée
  const displayContests = contests.length > 0 ? contests : [
    { 
      id: '1', 
      title: locale === 'ar' ? '♻️ إعادة تدوير المواد' : '♻️ Recyclage des matériaux', 
      description: locale === 'ar' ? 'تعلّم كيفية فرز النفايات وإعادة تدوير المواد لحماية البيئة' : 'Apprends à trier les déchets et recycler les matériaux pour protéger l\'environnement', 
      image: '/images/contest-recycling.svg', order: 1 
    },
    { 
      id: '2', 
      title: locale === 'ar' ? '🌱 التسميد وتدبير النفايات العضوية' : '🌱 Compostage et gestion bio', 
      description: locale === 'ar' ? 'اكتشف كيف تتحول النفايات العضوية إلى سماد طبيعي مفيد' : 'Découvre comment les déchets organiques se transforment en compost naturel utile', 
      image: '/images/contest-compost.svg', order: 2 
    },
    { 
      id: '3', 
      title: locale === 'ar' ? '🌍 إنقاذ الكوكب' : '🌍 Sauver la planète', 
      description: locale === 'ar' ? 'مغامرة شاملة لحماية كوكبنا من التلوث والنفايات' : 'Une aventure complète pour protéger notre planète de la pollution et des déchets', 
      image: '/images/contest-planet.svg', order: 3 
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-ocean-light/10">
      {/* En-tête */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-[60px] z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/images/ecoscience-text-logo.png" alt="InNOScEnce" width={120} height={120} className="object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-600">
              {t('welcome')}، {session?.user?.name || t('student')} 👋
            </span>
            <button onClick={async () => {
              await signOut({ redirect: false });
              router.replace('/login');
            }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Message de bienvenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-primary-800 mb-2">
            {t('scientific_contests')}
          </h2>
          <p className="text-gray-500 text-lg">{t('choose_contest')}</p>
        </motion.div>

        {/* Barre XP */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-kid shadow-kid p-5 mb-8 max-w-xl mx-auto">
          <XPBar xp={progress.xp} level={progress.level} />
        </motion.div>

        {/* Grille des concours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {displayContests.sort((a, b) => a.order - b.order).map((contest) => (
            <ContestCard
              key={contest.id}
              id={contest.id}
              title={contest.title}
              description={contest.description}
              image={contest.image}
              order={contest.order}
              isActive={contest.order === 1}
              onClick={() => router.push(`/contest/${contest.id}`)}
            />
          ))}
        </div>

        {/* Tortue en bas */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex justify-center">
          <Turtle mood="happy" size="md" message={isAr ? "اختر مسابقة وهيا بنا! 🐢" : "Choisis un concours et c'est parti ! 🐢"} />
        </motion.div>
      </div>
    </main>
  );
}
