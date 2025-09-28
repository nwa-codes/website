import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';

import '@/globals.css';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600']
});

export const metadata: Metadata = {
  title: 'NWA Codes',
  description: 'The homepage for the NWA Codes community',
  icons: {
    icon: '/nwa-codes-raspberry-white.svg'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={raleway.className}>{children}</body>
    </html>
  );
}
