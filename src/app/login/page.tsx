'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Turtle from '@/components/Turtle';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turtleMood, setTurtleMood] = useState<'idle' | 'thinking' | 'happy' | 'sad'>('idle');
  const [turtleMsg, setTurtleMsg] = useState('');

  // Set initial turtle message based on language
  useEffect(() => {
    setTurtleMsg(t('login_welcome'));
  }, [locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTurtleMood('thinking');
    setTurtleMsg(t('login_loading') + ' 🔍');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setTurtleMood('sad');
        setTurtleMsg(t('login_error'));
      } else {
        setTurtleMood('happy');
        setTurtleMsg(locale === 'ar' ? 'مرحبا بك! هيا بنا! 🎉' : 'Bienvenue ! C\'est parti ! 🎉');
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } catch {
      setError(locale === 'ar' ? 'حدث خطأ غير متوقع' : 'Une erreur est survenue');
      setTurtleMood('sad');
      setTurtleMsg('⚠️');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ocean-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Bulles décoratives */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white/10"
          style={{ width: 8 + Math.random() * 20, height: 8 + Math.random() * 20,
                   left: `${Math.random() * 100}%`, bottom: 0 }}
          animate={{ y: [0, -600], opacity: [0, 0.5, 0] }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: i * 1.2 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo en haut */}
        <div className="text-center mb-6">
          <Image src="/images/ecoscience-text-logo.png" alt="InNOScEnce" width={180} height={180}
            className="mx-auto drop-shadow-xl mb-3 object-contain" priority />
          <p className="text-ocean-light/80 mt-1">{t('login_title')}</p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white/95 backdrop-blur-sm rounded-kid shadow-2xl p-8">
          {/* Tortue */}
          <div className="flex justify-center -mt-16 mb-4">
            <Turtle mood={turtleMood} message={turtleMsg} size="sm" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-primary-800 mb-2">
                {t('email')}
              </label>
              <input
                id="email" type="email" value={email} required
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                onFocus={() => { setTurtleMood('idle'); setTurtleMsg(t('email')); }}
                placeholder="student@ecoscience.ma"
                className="w-full p-4 rounded-kid border-2 border-gray-200 focus:border-primary
                           focus:ring-2 focus:ring-primary-200 outline-none transition-all
                           text-lg placeholder:text-gray-300"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-primary-800 mb-2">
                {t('password')}
              </label>
              <input
                id="password" type="password" value={password} required
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onFocus={() => { setTurtleMood('idle'); setTurtleMsg(t('password')); }}
                placeholder="••••••••"
                className="w-full p-4 rounded-kid border-2 border-gray-200 focus:border-primary
                           focus:ring-2 focus:ring-primary-200 outline-none transition-all
                           text-lg placeholder:text-gray-300"
              />
            </div>

            {/* Erreur */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-kid text-center font-semibold">
                ⚠️ {error}
              </motion.div>
            )}

            {/* Bouton de connexion */}
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`w-full py-4 rounded-full font-bold text-xl text-white transition-all
                ${loading ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl'}`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>🐢</motion.span>
                  {t('login_loading')}
                </span>
              ) : t('login_button')}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            {t('login_footer')}
          </p>
        </div>
      </motion.div>
    </main>
  );
}
