import { motion } from 'framer-motion';
import Turtle from './Turtle';
import { useLanguage } from '@/context/LanguageContext';

interface ZoneData {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface ZoneMapProps {
  zones: ZoneData[];
  completedZones: string[];
  onZoneClick: (zoneId: string) => void;
}

export default function ZoneMap({ zones, completedZones, onZoneClick }: ZoneMapProps) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const zoneIcons = ['🏝️', '🧪', '🌍'];
  const sortedZones = [...zones].sort((a, b) => a.order - b.order);

  const getZoneStatus = (zone: ZoneData, index: number) => {
    if (completedZones.includes(zone.id)) return 'completed';
    if (index === 0) return 'available';
    const prevZone = sortedZones[index - 1];
    if (completedZones.includes(prevZone.id)) return 'available';
    return 'locked';
  };

  // Trouver la zone active courante (pour positionner la tortue)
  const currentZoneIndex = sortedZones.findIndex((z, i) => getZoneStatus(z, i) === 'available');

  return (
    <div className="relative w-full max-w-lg mx-auto py-8">
      {/* Chemin SVG connectant les zones */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#5e17eb" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 200 80 C 300 150, 100 250, 200 320 C 300 390, 100 490, 200 560"
          stroke="url(#pathGrad)" strokeWidth="6" fill="none" strokeDasharray="12 6" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </svg>

      {/* Bulles décoratives */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-ocean-light/20"
          style={{
            width: 10 + Math.random() * 20,
            height: 10 + Math.random() * 20,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Les 3 zones */}
      <div className="relative flex flex-col items-center gap-16 py-4">
        {sortedZones.map((zone, index) => {
          const status = getZoneStatus(zone, index);
          const isCurrent = index === currentZoneIndex;
          const icon = zoneIcons[index] || '🔬';
          const positions = ['self-end mr-8', 'self-start ml-8', 'self-end mr-8'];

          return (
            <motion.div key={zone.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.3, type: 'spring' }}
              className={`relative ${positions[index]}`}>
              
              {/* Tortue à la zone courante */}
              {isCurrent && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <Turtle mood="waving" size="sm" message={isAr ? "هيا بنا! 🌊" : "C'est parti ! 🌊"} />
                </div>
              )}

              {/* Nœud de zone */}
              <motion.button
                onClick={() => status !== 'locked' ? onZoneClick(zone.id) : undefined}
                whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
                whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center
                  transition-all duration-300 shadow-lg
                  ${status === 'completed' ? 'bg-success text-white shadow-success/30 cursor-pointer'
                    : status === 'available' ? 'bg-primary text-white shadow-primary/30 cursor-pointer animate-pulse-glow'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                <span className="text-3xl mb-1">{status === 'completed' ? '✅' : status === 'locked' ? '🔒' : icon}</span>
                <span className="text-xs font-bold px-2 text-center leading-tight">{zone.title}</span>
              </motion.button>

              {/* Badge */}
              {status === 'completed' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-sand rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm">⭐</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
