import type { JSX } from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
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

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={raleway.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
