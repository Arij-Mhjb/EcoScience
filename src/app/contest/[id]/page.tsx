// PAGE 4 — Roadmap Aventure (Concours)
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Turtle from "@/components/Turtle";
import ZoneMap from "@/components/ZoneMap";
import { useLanguage } from "@/context/LanguageContext";

interface Zone {
  id: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  order: number;
}

interface ContestData {
  id: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  zones: Zone[];
}

export default function ContestPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useLanguage();
  const isAr = locale === 'ar';
  const contestId = params.id as string;
  const [contest, setContest] = useState<ContestData | null>(null);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [participationStatus, setParticipationStatus] = useState<string>("not_started");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contestRes, progressRes, participationRes] = await Promise.all([
          fetch(`/api/contests/${contestId}`),
          fetch("/api/progress"),
          fetch(`/api/contest-progress?contestId=${contestId}`),
        ]);
        if (contestRes.ok) setContest(await contestRes.json());
        if (progressRes.ok) {
          const data = await progressRes.json();
          setCompletedZones(data.completedZones || []);
        }
        if (participationRes.ok) {
          const data = await participationRes.json();
          if (data.progress) setParticipationStatus(data.progress.status);
        }
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated" && contestId) fetchData();
  }, [status, contestId]);

  // Traductions système pour les zones par défaut (si non définies en BDD)
  const SYSTEM_ZONES: Record<string, { title: string; description: string }> = {
    '69e51151482488070228f2ba': { title: 'Tri des déchets', description: 'Apprends à trier tes déchets' },
    '69e51151482488070228f2bf': { title: 'Les Matériaux', description: 'Découvre les différents types de matériaux' },
    '69e51151482488070228f2c4': { title: 'Sauver la Planète', description: 'Aide à protéger l\'environnement' },
  };

  const SYSTEM_CONTESTS: Record<string, { title: string; description: string }> = {
    '69e51150482488070228f2b8': { title: '♻️ Recyclage des matériaux', description: 'Pars avec la tortue pour sauver la planète du plastique !' },
    '69e51153482488070228f2cd': { title: '🌱 Compostage et gestion bio', description: 'Découvre comment les déchets organiques se transforment en compost naturel utile.' },
    '69e51153482488070228f2ce': { title: '🌍 Sauver la planète', description: 'Une aventure complète pour protéger notre planète de la pollution et des déchets.' },
  };

  // Données fallback
  const fallbackContestAr: ContestData = {
    id: contestId,
    title: "♻️ إعادة تدوير المواد",
    description: "انطلق مع السلحفاة لإنقاذ الكوكب من البلاستيك!",
    zones: [
      { id: "69e51151482488070228f2ba", title: "تصنيف النفايات", description: "تعلّم كيفية فرز النفايات", order: 1 },
      { id: "69e51151482488070228f2bf", title: "المواد", description: "اكتشف أنواع المواد المختلفة", order: 2 },
      { id: "69e51151482488070228f2c4", title: "إنقاذ الكوكب", description: "ساعد في حماية البيئة", order: 3 },
    ],
  };

  const fallbackContestFr: ContestData = {
    id: contestId,
    title: "♻️ Recyclage des matériaux",
    description: "Pars avec la tortue pour sauver la planète du plastique !",
    zones: [
      { id: "69e51151482488070228f2ba", title: "Tri des déchets", description: "Apprends à trier tes déchets", order: 1 },
      { id: "69e51151482488070228f2bf", title: "Les Matériaux", description: "Découvre les différents types de matériaux", order: 2 },
      { id: "69e51151482488070228f2c4", title: "Sauver la Planète", description: "Aide à protéger l'environnement", order: 3 },
    ],
  };

  let displayContest = contest || (locale === 'ar' ? fallbackContestAr : fallbackContestFr);

  // Appliquer les traductions système si nécessaire
  if (!isAr && displayContest) {
    if (!displayContest.titleFr && SYSTEM_CONTESTS[displayContest.id]) {
      displayContest = { 
        ...displayContest, 
        titleFr: SYSTEM_CONTESTS[displayContest.id].title, 
        descriptionFr: SYSTEM_CONTESTS[displayContest.id].description 
      };
    }
    displayContest.zones = displayContest.zones.map(z => {
      if (!z.titleFr && SYSTEM_ZONES[z.id]) {
        return { ...z, titleFr: SYSTEM_ZONES[z.id].title, descriptionFr: SYSTEM_ZONES[z.id].description };
      }
      return z;
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-ocean-gradient flex items-center justify-center">
        <Turtle mood="thinking" size="lg" message={t('loading_adventure')} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ocean-gradient relative overflow-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Bulles sous-marines */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: 6 + Math.random() * 16,
            height: 6 + Math.random() * 16,
            left: `${Math.random() * 100}%`,
            bottom: 0,
          }}
          animate={{ y: [0, -800], opacity: [0, 0.4, 0] }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}

      {/* En-tête */}
      <header className="relative z-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>{locale === 'ar' ? '→' : '←'}</span>
            <span className="font-semibold">{t('back')}</span>
          </button>
          <div className="flex items-center">
            <Image
              src="/images/ecoscience-text-logo.png"
              alt="InNOScEnce"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Titre du concours */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
            {(!isAr && displayContest.titleFr) ? displayContest.titleFr : displayContest.title}
          </h1>
          <p className="text-ocean-light text-lg">
            {(!isAr && displayContest.descriptionFr) ? displayContest.descriptionFr : displayContest.description}
          </p>
        </motion.div>

        {/* Bouton de démarrage du concours */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 18,
          }}
          className="mb-6"
        >
          <div className="relative rounded-kid overflow-hidden shadow-kid-hover">
            {/* Fond dégradé vert */}
            <div className={`absolute inset-0 bg-gradient-to-l from-success-600 via-success to-success-400 opacity-90 ${locale === 'fr' ? 'bg-gradient-to-r' : ''}`} />
            {/* Éclat lumineux */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-kid"
              animate={{ opacity: [0.05, 0.2, 0.05] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className={`relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 ${locale === 'fr' ? 'sm:flex-row' : ''}`}>
              <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-white font-black text-xl leading-tight drop-shadow">
                  {t('ready_for_contest')}
                </p>
                <p className="text-success-50/90 text-sm mt-1 font-medium">
                  {t('contest_instructions')}
                </p>
              </div>
              <motion.button
                onClick={() => router.push(`/contest/${contestId}/play`)}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex items-center gap-2 px-7 py-3 rounded-full shadow-lg transition-colors duration-200 select-none font-black text-lg
                           ${participationStatus === 'completed' 
                             ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                             : 'bg-white text-success-700 hover:bg-success-50'}`}
              >
                <span>{participationStatus === 'completed' ? '🏁' : '🏆'}</span>
                <span>
                  {participationStatus === 'completed' 
                    ? (isAr ? 'عرض النتائج' : 'Voir les résultats') 
                    : (participationStatus === 'in_progress' 
                        ? (isAr ? 'مواصلة المسابقة' : 'Continuer le concours')
                        : t('start_contest_btn'))}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Carte d'aventure */}
        <ZoneMap
          zones={displayContest.zones}
          completedZones={completedZones}
          onZoneClick={(zoneId) => router.push(`/zone/${zoneId}`)}
        />

        {/* Légende */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-6 mt-8 text-sm text-white/70"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success" />
            <span>{t('status_completed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            <span>{t('status_available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400" />
            <span>{t('status_locked')}</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
