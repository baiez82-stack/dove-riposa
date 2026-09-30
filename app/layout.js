import './globals.css';
import { Manrope, Fraunces } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap'
});

export const metadata = {
  title: {
    default: 'Dove Riposa',
    template: '%s | Dove Riposa'
  },
  description: 'Ricerca e navigazione cimiteriale digitale, semplice e accessibile.',
  applicationName: 'Dove Riposa',
  icons: {
    icon: '/icon.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${manrope.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
