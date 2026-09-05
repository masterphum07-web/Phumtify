import type { Metadata } from 'next';
import './globals.css';
import { AudioEngine } from '@/components/audio-player';

export const metadata: Metadata = { title: 'MySpotify', description: 'Personal self-hosted music library' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}<AudioEngine /></body></html>;
}
