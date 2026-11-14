import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ASTROVITAL // Multi-Planetary Mission-Adaptive Crew Health & Telemetry System',
  description:
    'NASA Space Apps Challenge 2026: Offline-first, multi-planetary mission-adaptive astronaut health monitoring, biometric facial HUD, and explainable AI health intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-spacecraft-bg text-gray-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
