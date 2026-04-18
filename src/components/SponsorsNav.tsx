import Image from 'next/image';

export default function SponsorsNav() {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm px-4 py-2"
      dir="ltr" // Force Left-to-Right layout specifically for the logos as requested in the diagram
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Association chef de file */}
        <div className="flex items-center">
          <Image 
            src="/images/logos/association-logo.png" 
            alt="Association chef de file" 
            width={120} 
            height={45} 
            className="object-contain max-h-[45px] w-auto" 
            priority
          />
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
