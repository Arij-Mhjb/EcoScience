// Layout principal — EcoScience / InNOScEnce
// Direction RTL, langue arabe, police Cairo

import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import MainLayoutWrapper from '@/components/MainLayoutWrapper';
import { LanguageProvider } from '@/context/LanguageContext';

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
    <html>
      <body className="font-cairo antialiased">
        <SessionProvider>
          <LanguageProvider>
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
