// Composant Carte Concours — Affiche un concours sur le dashboard
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface ContestCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  onClick: () => void;
}

export default function ContestCard({
  title,
  description,
  image,
  order,
  isActive,
  onClick,
}: ContestCardProps) {
  const { t } = useLanguage();
  // Icônes pour chaque concours
  const contestIcons = ['♻️', '🌱', '🌍'];
  const icon = contestIcons[order - 1] || '🔬';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: order * 0.15, duration: 0.5 }}
      whileHover={isActive ? { y: -8, scale: 1.02 } : {}}
      whileTap={isActive ? { scale: 0.98 } : {}}
      onClick={isActive ? onClick : undefined}
      className={`relative overflow-hidden rounded-kid cursor-pointer
                  transition-all duration-300 group
                  ${isActive
                    ? 'shadow-kid hover:shadow-kid-hover'
                    : 'opacity-60 grayscale cursor-not-allowed'
                  }`}
    >
      {/* Image de fond */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500
                     ${isActive ? 'group-hover:scale-110' : ''}`}
        />
        {/* Overlay dégradé */}
        <div className={`absolute inset-0 
                        ${isActive
                          ? 'bg-gradient-to-t from-primary-900/80 via-primary-900/30 to-transparent'
                          : 'bg-gray-900/50'
                        }`}
        />
        
        {/* Badge numéro */}
        <div className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center
                        text-white font-bold text-lg
                        ${isActive ? 'bg-primary' : 'bg-gray-500'}`}>
          {order}
        </div>

        {/* Badge "قريبا" pour les concours inactifs */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 left-3 bg-sand text-primary-900 font-bold
                       px-3 py-1 rounded-full text-sm shadow-lg"
          >
            {t('soon')}
          </motion.div>
        )}

        {/* Icône flottante */}
        <motion.span
          className="absolute bottom-3 left-3 text-4xl"
          animate={isActive ? { y: [0, -5, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </motion.span>
      </div>

      {/* Contenu de la carte */}
      <div className={`p-5 ${isActive ? 'bg-white' : 'bg-gray-100'}`}>
        <h3 className={`text-xl font-bold mb-2
                       ${isActive ? 'text-primary' : 'text-gray-500'}`}>
          {title}
        </h3>
        <p className={`text-sm leading-relaxed mb-4
                      ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>

        {/* Bouton d'action */}
        <motion.button
          whileHover={isActive ? { scale: 1.05 } : {}}
          whileTap={isActive ? { scale: 0.95 } : {}}
          className={`w-full py-3 rounded-full font-bold text-lg transition-all
                     ${isActive
                       ? 'bg-primary text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
          disabled={!isActive}
        >
          {isActive ? '🚀 ' + t('start_adventure') : t('soon')}
        </motion.button>
      </div>

      {/* Effet de brillance au survol */}
      {isActive && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
          }}
        />
      )}
    </motion.div>
  );
}
