import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import { AudioEngine } from '@/components/audio-player';

export const metadata: Metadata = { title: 'Phumtify', description: 'Personal self-hosted music library by Phumtify', manifest: '/Phumtify/manifest.json', icons: { icon: '/Phumtify/phumtify-logo.png', apple: '/Phumtify/phumtify-logo.png' }, appleWebApp: { capable: true, title: 'Phumtify', statusBarStyle: 'black-translucent' } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}<AudioEngine /></body></html>;
}
