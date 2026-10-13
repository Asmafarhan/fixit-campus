import './globals.css';
import { Baloo_2 } from 'next/font/google';
import { SETTINGS } from '@/lib/config';

const font = Baloo_2({ subsets: ['latin'], weight: ['400', '600', '800'] });
export const metadata = { title: SETTINGS.appName, description: SETTINGS.tagline };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
