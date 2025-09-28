import type { JSX } from 'react';
import Image from 'next/image';

import { SponsorButton } from '@/components/SponsorButton';
import styles from './Header.module.css';

const TAG_LINE = 'Learn & Network with Over 800 Members';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <section className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image
              src="/nwa-codes-white-transparent.svg"
              alt="NWA Codes Logo"
              width={40}
              height={40}
              className={styles.logoImage}
            />
          </div>
          <span className={styles.tagline}>{TAG_LINE}</span>
        </section>
        <div className={styles.sponsorButtonContainer}>
          <SponsorButton />
        </div>
      </div>
    </header>
  );
};
