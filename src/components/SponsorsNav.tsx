'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function SponsorsNav() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm px-4 py-2"
      dir="ltr" // Force Left-to-Right layout specifically for the logos as requested in the diagram
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Association chef de file */}
        <div className="flex items-center gap-4">
          <Image
            src="/images/association-logo.png"
            alt="InNOScEnce"
            width={100}
            height={50}
            className="object-contain max-h-[50px] w-auto"
            priority
          />

          {/* Bouton de langue */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-sm border border-primary/20 shadow-sm"
          >
            <span>{locale === 'ar' ? '🇫🇷 FR' : '🇹🇳 AR'}</span>
          </button>
        </div>

        {/* Right: SWAFY, ANPR, UE, EU4YOUTH */}
        <div className="flex items-center gap-4 md:gap-8">
          <Image src="/images/logos/logo1.png" alt="Sponsor" width={70} height={45} className="object-contain max-h-[45px] w-auto" />
          <Image src="/images/logos/logo2.png" alt="Sponsor" width={70} height={45} className="object-contain max-h-[45px] w-auto" />
          <Image src="/images/logos/logo3.png" alt="Sponsor" width={70} height={45} className="object-contain max-h-[45px] w-auto" />
          <Image src="/images/logos/logo4.png" alt="Sponsor" width={70} height={45} className="object-contain max-h-[45px] w-auto" />
        </div>
      </div>
    </nav>
  );
}
