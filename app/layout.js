import './globals.css';

export const metadata = {
  title: 'Dove Riposa — MVP',
  description: 'Motore federato per la ricerca delle sepolture in Italia.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}