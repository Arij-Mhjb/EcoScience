"use client";

import { usePathname } from "next/navigation";
import SponsorsNav from "./SponsorsNav";
import SponsorsFooter from "./SponsorsFooter";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <SponsorsNav />}
      <div className={!isAdmin ? "pt-[60px] pb-[60px] min-h-screen" : "min-h-screen"}>
        {children}
      </div>
      {!isAdmin && <SponsorsFooter />}
    </>
  );
}
