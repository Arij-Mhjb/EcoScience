// Composant Tortue Mascotte — Animation dynamique du logo unique
// Ajout d'objets scientifiques et de recyclage flottants
'use client';

import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Types d'humeur de la tortue
type TurtleMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'waving' | 'celebrating';

interface TurtleProps {
  mood?: TurtleMood;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBubble?: boolean;
  className?: string;
}

// Animation Framer Motion dynamique sur le même logo pour donner l'impression de mouvement
const moodAnimations: Record<TurtleMood, TargetAndTransition> = {
  idle: {
    y: [0, -6, 0],
    rotate: [0, 1, -1, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  happy: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  sad: {
    y: [0, 5, 0],
    rotate: [0, -4, 0],
    scale: [1, 0.95, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  thinking: {
    rotate: [0, -8, 0, 8, 0],
    x: [-2, 2, -2],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  waving: {
    rotate: [0, 12, -5, 10, 0],
    y: [0, -8, 0],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
  celebrating: {
    y: [0, -25, 0],
    scale: [1, 1.15, 1],
    rotate: [0, 8, -8, 0],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Tailles en pixels
const sizeMap = {
  sm: { width: 80, height: 80, bubbleClass: 'text-sm max-w-[180px]' },
  md: { width: 130, height: 130, bubbleClass: 'text-base max-w-[220px]' },
  lg: { width: 190, height: 190, bubbleClass: 'text-lg max-w-[280px]' },
  xl: { width: 260, height: 260, bubbleClass: 'text-xl max-w-[320px]' },
};

// Icônes scientifiques et de recyclage
const scienceIcons = ['🧪', '🔬', '🧬', '⚛️', '🔭', '💡'];
const ecoIcons = ['♻️', '🌍', '🌱', '🍃', '💧', '☀️'];

export default function Turtle({
  mood = 'idle',
  message,
  size = 'md',
  showBubble = true,
  className = '',
}: TurtleProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const { width, height, bubbleClass } = sizeMap[size];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`relative inline-flex flex-col items-center ${className}`}>
        <div style={{ width, height }} />
      </div>
    );
  }

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Bulle de dialogue */}
      <AnimatePresence>
        {message && showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`relative z-30 mb-4 bg-white rounded-bubble px-4 py-3 shadow-kid
                       border-2 border-primary-200 ${bubbleClass}`}
          >
            <p className="text-center font-bold text-primary-800 leading-relaxed">
              {message}
            </p>
            {/* Triangle de la bulle pointant vers la tortue */}
            <div className="absolute -bottom-[10px] left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px]
                            border-l-transparent border-r-transparent border-t-white" />
              {/* Bordure du triangle pour correspondre au design */}
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px]
                            border-l-transparent border-r-transparent border-t-primary-200 absolute -bottom-[2px] -left-[12px] -z-10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Le conteneur d'animation */}
      <div className="relative">
        {/* Halo lumineux derrière la tortue */}
        <motion.div
          className="absolute rounded-full bg-success/20 blur-2xl z-0"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: width * 0.8,
            height: height * 0.8,
            top: height * 0.1,
            left: width * 0.1,
          }}
        />

        {/* La tortue animée avec le logo unique */}
        <motion.div
          animate={moodAnimations[mood]}
          className="relative cursor-pointer z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/images/turtle-character.png"
            alt={isAr ? "السلحفاة البحرية — مرشدك في المغامرة" : "La tortue marine — ton guide dans l'aventure"}
            width={width}
            height={height}
            className="drop-shadow-xl object-contain"
            priority
          />
        </motion.div>

        {/* Objets flottants: Célébration (Mix Sciences & Eco) */}
        {mood === 'celebrating' && (
          <>
            {[...scienceIcons.slice(0, 3), ...ecoIcons.slice(0, 3)].map((icon, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl z-20 pointer-events-none"
                style={{ top: '30%', left: '40%' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 15)],
                  y: [0, -50 - i * 15],
                  rotate: [0, i % 2 === 0 ? 360 : -360]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {icon}
              </motion.span>
            ))}
          </>
        )}

        {/* Objets flottants: Happy (Eco) */}
        {mood === 'happy' && (
          <>
            {ecoIcons.slice(0, 3).map((icon, i) => (
              <motion.span
                key={i}
                className="absolute text-xl z-20 pointer-events-none"
                style={{ top: '20%', left: `${20 + i * 30}%` }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -30],
                  scale: [0.5, 1.2, 0.5],
                  rotate: [0, 15, -15]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                {icon}
              </motion.span>
            ))}
          </>
        )}

        {/* Objets flottants: Thinking (Sciences) */}
        {mood === 'thinking' && (
          <>
            {scienceIcons.slice(0, 3).map((icon, i) => (
              <motion.span
                key={`think-${i}`}
                className="absolute text-xl z-20 pointer-events-none"
                style={{ top: '10%', right: `${10 + i * 20}%` }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [0, -20],
                  scale: [0.5, 1, 0.8],
                  x: [0, 10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                }}
              >
                {icon}
              </motion.span>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
