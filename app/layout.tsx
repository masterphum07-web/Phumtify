import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import { AudioEngine } from '@/components/audio-player';

export const metadata: Metadata = { title: 'Phumtify', description: 'Personal self-hosted music library by Phumtify', icons: { icon: '/Phumtify/phumtify-logo.png' } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}<AudioEngine /></body></html>;
}

