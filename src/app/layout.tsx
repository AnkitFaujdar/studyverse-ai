import type { Metadata } from 'next';
import Script from 'next/script';
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

        <Script id="voiceflow-widget" strategy="afterInteractive">
          {`
      (function(d, t) {
        var v = d.createElement(t), s = d.getElementsByTagName(t)[0];

        v.onload = function() {
          window.voiceflow.chat.load({
            verify: {
              projectID: '6abc7d8638b7f3c62a428de3'
            },
            url: 'https://general-runtime.voiceflow.com',
            version: 'production',
            voice: {
              url: 'https://runtime-api.voiceflow.com'
            }
          });
        };

        v.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
        v.type = 'text/javascript';
        s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `}
        </Script>
      </body>
    </html>
  );
}
