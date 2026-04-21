// Composant Barre d'XP — Progression de l'élève
'use client';

import { motion } from 'framer-motion';

interface XPBarProps {
  xp: number;
  level: number;
  maxXP?: number;
  showLabel?: boolean;
}

// XP nécessaire par niveau
function getXPForLevel(level: number): number {
  return level * 100;
}

export default function XPBar({ xp, level, maxXP, showLabel = true }: XPBarProps) {
  const xpNeeded = maxXP || getXPForLevel(level);
  const progress = Math.min((xp / xpNeeded) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          {/* Niveau */}
          <div className="flex items-center gap-2">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐
            </motion.span>
            <span className="font-bold text-primary text-lg">
              المستوى {level}
            </span>
          </div>

          {/* XP Count */}
          <span className="text-sm font-semibold text-gray-500">
            {xp} / {xpNeeded} نقطة
          </span>
        </div>
      )}

      {/* Barre de progression */}
      <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(90deg, #5e17eb, #7ed957)',
          }}
        >
          {/* Effet de brillance animé */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1,
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              width: '50%',
            }}
          />
        </motion.div>

        {/* Marqueurs de progression */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-white/30"
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>
    </div>
  );
}
