'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightFromBracket } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

import styles from './AdminSidebar.module.css';

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Events', href: '/admin/events' },
  { label: 'Speakers', href: '/admin/speakers' },
  { label: 'Sponsors', href: '/admin/sponsors' },
];

/**
 * Sidebar navigation for the admin section.
 * Highlights the active route using the current pathname.
 */
export const AdminSidebar = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Image
          src="/nwa-codes-white-transparent.svg"
          alt="NWA Codes"
          width={32}
          height={32}
          className={styles.brandLogo}
        />
        <span className={styles.brandSubtext}>Admin Console</span>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.footer}>
        <Link href="/" className={styles.footerLink}>
          <FontAwesomeIcon icon={faHouse} className={styles.footerIcon} />
          Home
        </Link>
        <SignOutButton>
          <button className={styles.footerLink} type="button">
            <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.footerIcon} />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
};
