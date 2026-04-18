// PAGE 4 — Roadmap Aventure (Concours)
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Turtle from '@/components/Turtle';
import ZoneMap from '@/components/ZoneMap';

interface Zone {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface ContestData {
  id: string;
  title: string;
  description: string;
  zones: Zone[];
}

export default function ContestPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const contestId = params.id as string;
  const [contest, setContest] = useState<ContestData | null>(null);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contestRes, progressRes] = await Promise.all([
          fetch(`/api/contests/${contestId}`),
          fetch('/api/progress'),
        ]);
        if (contestRes.ok) setContest(await contestRes.json());
        if (progressRes.ok) {
          const data = await progressRes.json();
          setCompletedZones(data.completedZones || []);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
    if (status === 'authenticated' && contestId) fetchData();
  }, [status, contestId]);

  // Données fallback
  const fallbackContest: ContestData = {
    id: contestId,
    title: '♻️ إعادة تدوير المواد',
    description: 'انطلق مع السلحفاة لإنقاذ الكوكب من البلاستيك!',
    zones: [
      { id: 'z1', title: 'تصنيف النفايات', description: 'تعلّم كيفية فرز النفايات', order: 1 },
      { id: 'z2', title: 'المواد', description: 'اكتشف أنواع المواد المختلفة', order: 2 },
      { id: 'z3', title: 'إنقاذ الكوكب', description: 'ساعد في حماية البيئة', order: 3 },
    ],
  };

  const displayContest = contest || fallbackContest;

  if (loading) {
    return (
      <main className="min-h-screen bg-ocean-gradient flex items-center justify-center">
        <Turtle mood="thinking" size="lg" message="جاري تحميل المغامرة... ⏳" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ocean-gradient relative overflow-hidden">
      {/* Bulles sous-marines */}
      {[...Array(10)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white/10"
          style={{ width: 6 + Math.random() * 16, height: 6 + Math.random() * 16,
                   left: `${Math.random() * 100}%`, bottom: 0 }}
          animate={{ y: [0, -800], opacity: [0, 0.4, 0] }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}

      {/* En-tête */}
      <header className="relative z-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')}
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
            <span>→</span>
            <span className="font-semibold">العودة</span>
          </button>
          <div className="flex items-center">
            <Image src="/images/ecoscience-text-logo.png" alt="InNOScEnce" width={100} height={100} className="object-contain" />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Titre du concours */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
            {displayContest.title}
          </h1>
          <p className="text-ocean-light text-lg">
            انطلق مع السلحفاة لإنقاذ الكوكب من البلاستيك! 🌊
          </p>
        </motion.div>

        {/* Carte d'aventure */}
        <ZoneMap
          zones={displayContest.zones}
          completedZones={completedZones}
          onZoneClick={(zoneId) => router.push(`/zone/${zoneId}`)}
        />

        {/* Légende */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="flex justify-center gap-6 mt-8 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success" />
            <span>مكتمل</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            <span>متاح</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400" />
            <span>مقفل</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
