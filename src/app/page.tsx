'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Turtle from '@/components/Turtle';
import { useLanguage } from '@/context/LanguageContext';

// Composant bulle décorative
function Bubble({ delay, size, left }: { delay: number; size: number; left: string }) {
  return (
    <motion.div
      className="absolute bottom-0 rounded-full bg-white/10"
      style={{ width: size, height: size, left }}
      animate={{ y: [0, -800], opacity: [0, 0.6, 0] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

// Composant poisson décoratif
function Fish({ delay, y, direction }: { delay: number; y: string; direction: 'rtl' | 'ltr' }) {
  return (
    <motion.div
      className="absolute text-2xl"
      style={{ top: y }}
      animate={{
        x: direction === 'rtl' ? ['100vw', '-100px'] : ['-100px', '100vw'],
        y: [0, -20, 0, 20, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, delay, ease: 'linear' }}
    >
      {direction === 'rtl' ? '🐟' : '🐠'}
    </motion.div>
  );
}

export default function LandingPage() {
  const { t, locale } = useLanguage();

  return (
    <main className="relative min-h-screen overflow-hidden bg-ocean-gradient">
      {/* Vagues en arrière-plan */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg className="relative w-[200%] h-24" viewBox="0 0 1440 120" preserveAspectRatio="none"
          style={{ animation: 'oceanWave 8s ease-in-out infinite' }}>
          <path d="M0,40 C360,120 720,0 1080,80 C1260,110 1380,40 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.1)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg className="relative w-[200%] h-20" viewBox="0 0 1440 120" preserveAspectRatio="none"
          style={{ animation: 'oceanWave 6s ease-in-out infinite reverse' }}>
          <path d="M0,80 C360,20 720,100 1080,40 C1260,10 1380,80 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>

      {/* Bulles décoratives */}
      {[...Array(8)].map((_, i) => (
        <Bubble key={i} delay={i * 1.5} size={8 + Math.random() * 24} left={`${5 + Math.random() * 90}%`} />
      ))}

      {/* Poissons */}
      <Fish delay={0} y="60%" direction={locale === 'ar' ? 'rtl' : 'ltr'} />
      <Fish delay={4} y="75%" direction={locale === 'ar' ? 'ltr' : 'rtl'} />
      <Fish delay={8} y="45%" direction={locale === 'ar' ? 'rtl' : 'ltr'} />

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo InNOScEnce Principal */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <Image src="/images/ecoscience-text-logo.png" alt="InNOScEnce" width={300} height={300}
            className="drop-shadow-2xl object-contain" priority />
        </motion.div>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-ocean-light/90 mb-2 text-center font-semibold"
        >
          {t('hero_title')}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-xl md:text-2xl text-white/90 mb-4 text-center max-w-2xl leading-relaxed"
        >
          {t('hero_desc')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-base md:text-lg text-white/70 mb-10 text-center max-w-xl leading-relaxed"
        >
          {t('hero_subdesc')}
        </motion.p>

        {/* Tortue mascotte */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <Turtle mood="waving" size="lg" message={locale === 'ar' ? "هيا بنا! المغامرة تنتظرنا 🌊" : "C'est parti ! L'aventure nous attend 🌊"} />
        </motion.div>

        {/* Bouton CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(126, 217, 87, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-success hover:bg-success-500 text-white font-bold text-2xl
                         py-5 px-12 rounded-full shadow-xl transition-all duration-300
                         flex items-center gap-3"
            >
              <span>{t('start_adventure')}</span>
              <motion.span animate={{ x: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                🚀
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {[
            { icon: '🧪', title: t('feature_science'), desc: t('feature_science_desc') },
            { icon: '🏆', title: t('feature_contests'), desc: t('feature_contests_desc') },
            { icon: '🌱', title: t('feature_planet'), desc: t('feature_planet_desc') },
          ].map((f, i) => (
            <motion.div key={i}
              whileHover={{ y: -5 }}
              className="glass rounded-kid p-6 text-center"
            >
              <span className="text-4xl mb-3 block">{f.icon}</span>
              <h3 className="text-white font-bold text-lg mb-1">{f.title}</h3>
              <p className="text-white/70 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Lien caché vers l'admin */}
        <div className="absolute bottom-4 right-4 z-50">
          <Link href="/admin/login" className="text-white/30 hover:text-white/80 text-xs font-semibold transition-colors">
            {t('administration')}
          </Link>
        </div>
      </div>
    </main>
  );
}
