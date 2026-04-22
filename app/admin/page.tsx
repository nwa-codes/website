import type { JSX } from 'react';
import Link from 'next/link';

import { getAdminEvents, getAdminSpeakers, getAdminSponsors } from '@/utils/admin-api';

import styles from './page.module.css';

type SummaryCard = {
  label: string;
  count: number;
  href: string;
};

const getSummaryCounts = async (): Promise<SummaryCard[]> => {
  const [events, speakers, sponsors] = await Promise.all([
    getAdminEvents(),
    getAdminSpeakers(),
    getAdminSponsors(),
  ]);

  return [
    { label: 'Events', count: events.length, href: '/admin/events' },
    { label: 'Speakers', count: speakers.length, href: '/admin/speakers' },
    { label: 'Sponsors', count: sponsors.length, href: '/admin/sponsors' },
  ];
};

const AdminDashboard = async (): Promise<JSX.Element> => {
  const cards = await getSummaryCounts();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subheading}>Overview of your NWA Codes content</p>
      <div className={styles.cards}>
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className={styles.card}>
            <span className={styles.cardLabel}>{card.label}</span>
            <span className={styles.cardCount}>{card.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
