// Layout principal — EcoScience / InNOScEnce
// Direction RTL, langue arabe, police Cairo

import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import SponsorsNav from '@/components/SponsorsNav';
import SponsorsFooter from '@/components/SponsorsFooter';

export const metadata: Metadata = {
  title: 'EcoScience — منصة العلوم البيئية',
  description: 'منصة تعليمية تفاعلية لاكتشاف العلوم البيئية من خلال التجارب والمسابقات — مشروع InNOScEnce',
  keywords: ['علوم', 'بيئة', 'تعليم', 'أطفال', 'إعادة تدوير', 'InNOScEnce'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-cairo antialiased">
        <SessionProvider>
          <SponsorsNav />
          <div className="pt-[60px] pb-[60px] min-h-screen">
            {children}
          </div>
          <SponsorsFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
