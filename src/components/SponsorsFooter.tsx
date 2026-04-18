import Image from 'next/image';

export default function SponsorsFooter() {
  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-4 py-2"
      dir="ltr" // Force Left-to-Right layout specifically for the logos as requested in the diagram
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* En bas à gauche: Logo UE projet financé */}
        <div className="flex items-center">
          <Image 
            src="/images/logos/eu-financed.png" 
            alt="Projet financé par l'Union européenne" 
            width={200} 
            height={50} 
            className="object-contain max-h-[45px] w-auto" 
            priority
          />
        </div>

        {/* En bas à droite: Logos des codemandeurs (Placeholders for now) */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="bg-[#6B5B95] text-white text-[10px] md:text-xs font-bold py-1 px-2 md:py-2 md:px-4 rounded text-center whitespace-pre-line leading-tight">
            {'Logo\ncodemandeur'}
          </div>
          <div className="bg-[#6B5B95] text-white text-[10px] md:text-xs font-bold py-1 px-2 md:py-2 md:px-4 rounded text-center whitespace-pre-line leading-tight">
            {'Logo\ncodemandeur'}
          </div>
          <div className="bg-[#6B5B95] text-white text-[10px] md:text-xs font-bold py-1 px-2 md:py-2 md:px-4 rounded text-center whitespace-pre-line leading-tight">
            {'Logo\ncodemandeur'}
          </div>
        </div>
      </div>
    </footer>
  );
}
