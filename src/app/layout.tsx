// /client/src/app/layout.js

import { Hind_Siliguri } from 'next/font/google';
import './globals.css';

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata = {
  title: 'हमारे वादे - तरदहा ग्राम प्रधान उम्मीदवार',
  description: 'मुकेश मिश्रा (राजू मिश्रा) - तरदaha ग्राम पंचायत प्रधान पद के उम्मीदवार। नया विजन, नई ऊर्जा - हमारे गाँव का समग्र विकास।',
};

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className="!scroll-smooth" suppressHydrationWarning={true}>
      <body className={hindSiliguri.className}>
        {children}
      </body>
    </html>
  );
}