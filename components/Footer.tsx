import type { JSX } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faYoutube,
  faFacebookF,
  faXTwitter
  // faDiscord
} from '@awesome.me/kit-5c0a16ac00/icons/classic/brands';
import styles from './Footer.module.css';

export const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>
          © 2025 NWA Codes •{' '}
          <Link href="/code-of-conduct" className={styles.footerLink}>
            Code of Conduct
          </Link>
        </p>
        <nav className={styles.socialIcons} aria-label="Social media links">
          <a
            href="https://www.youtube.com/@nwacodes"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Visit NWA Codes YouTube channel (opens in new tab)"
          >
            <FontAwesomeIcon icon={faYoutube} className={styles.socialIcon} aria-hidden="true" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61580880059510"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Visit NWA Codes Facebook page (opens in new tab)"
          >
            <FontAwesomeIcon icon={faFacebookF} className={styles.socialIcon} aria-hidden="true" />
          </a>
          <a
            href="https://x.com/CodesNWA"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Follow NWA Codes on X (opens in new tab)"
          >
            <FontAwesomeIcon icon={faXTwitter} className={styles.socialIcon} aria-hidden="true" />
          </a>
          {/* <a */}
          {/*   href="https://discord.gg/9zdhcZn4Tp" */}
          {/*   target="_blank" */}
          {/*   rel="noopener noreferrer" */}
          {/*   className={styles.socialLink} */}
          {/*   aria-label="Join NWA Codes Discord server (opens in new tab)" */}
          {/* > */}
          {/*   <FontAwesomeIcon icon={faDiscord} className={styles.socialIcon} aria-hidden="true" /> */}
          {/* </a> */}
        </nav>
      </div>
    </footer>
  );
};
