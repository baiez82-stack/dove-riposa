import './globals.css';

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
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}