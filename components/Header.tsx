'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SponsorButton } from '@/components/SponsorButton';
import styles from './Header.module.css';

const TAG_LINE = 'Learn & Network with Over 800 Members';

export const Header = (): JSX.Element => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const logoImage = (
    <Image
      src="/nwa-codes-white-transparent.svg"
      alt="NWA Codes Logo"
      width={40}
      height={40}
      className={styles.logoImage}
    />
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          {isHomePage ? (
            <div className={styles.logo}>{logoImage}</div>
          ) : (
            <Link href="/" className={styles.logo}>
              {logoImage}
            </Link>
          )}
          <span className={styles.tagline}>{TAG_LINE}</span>
        </div>
        <div className={styles.sponsorButtonContainer}>
          <SponsorButton />
        </div>
      </div>
    </header>
  );
};
