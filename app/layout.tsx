import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'MySpotify', description: 'Personal self-hosted music library' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
