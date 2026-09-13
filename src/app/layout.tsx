import type { Metadata } from 'next';
import './globals.css';
import { StudyVerseProvider } from '@/lib/store/studyverse-context';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'StudyVerse AI — Prepare. Compete. Level Up.',
  description: 'A revolutionary gamified exam-preparation platform. Master your syllabus, crush focus timers, battle peers, and level up with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-purple-600 selection:text-white">
        <StudyVerseProvider>
          <AppShell>{children}</AppShell>
        </StudyVerseProvider>
      </body>
    </html>
  );
}
