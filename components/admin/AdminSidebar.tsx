'use client';

import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightFromBracket, faBars, faXmark } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

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
 * On desktop: always-visible fixed-width sidebar.
 * On mobile: hidden off-screen with a hamburger top bar that slides it in as an overlay.
 */
export const AdminSidebar = (): JSX.Element => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sidebarNav = (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {NAV_ITEMS.map((item) => (
          <li key={item.href} className={styles.navItem}>
            <Link
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
              onClick={closeSidebar}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  const sidebarFooter = (
    <div className={styles.footer}>
      <Link href="/" className={styles.footerLink} onClick={closeSidebar}>
        <FontAwesomeIcon icon={faHouse} className={styles.footerIcon} />
        Home
      </Link>
      <SignOutButton>
        <button className={styles.footerLink} type="button" onClick={closeSidebar}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.footerIcon} />
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );

  return (
    <>
      <div className={styles.topBar}>
        <button
          className={styles.hamburger}
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="admin-sidebar"
          onClick={openSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Image
          src="/nwa-codes-white-transparent.svg"
          alt="NWA Codes"
          width={32}
          height={32}
        />
      </div>

      {isOpen ? (
        <div
          className={styles.overlay}
          aria-hidden="true"
          onClick={closeSidebar}
        />
      ) : null}

      <aside id="admin-sidebar" className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <Image
            src="/nwa-codes-white-transparent.svg"
            alt="NWA Codes"
            width={40}
            height={40}
            className={styles.brandLogo}
          />
          <span className={styles.brandSubtext}>Admin Console</span>
          <button
            className={styles.closeButton}
            type="button"
            aria-label="Close navigation menu"
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {sidebarNav}
        {sidebarFooter}
      </aside>
    </>
  );
};
