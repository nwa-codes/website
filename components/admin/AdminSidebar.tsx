'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        <span className={styles.brandText}>NWA Codes</span>
        <span className={styles.brandSubtext}>Admin</span>
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
    </aside>
  );
};
