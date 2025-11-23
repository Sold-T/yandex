import { Nunito } from 'next/font/google';
import "./globals.scss";

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata = {
  title: "Моя библиотека",
  description: "Веб-приложение для учета личной коллекции книг",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={nunito.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
