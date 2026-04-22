import type { JSX } from 'react';

import { getAdminEvents, getAdminSpeakers, getAdminSponsors } from '@/utils/admin-api';

import styles from './page.module.css';

type SummaryCard = {
  label: string;
  count: number;
};

const getSummaryCounts = async (): Promise<SummaryCard[]> => {
  const [events, speakers, sponsors] = await Promise.all([
    getAdminEvents(),
    getAdminSpeakers(),
    getAdminSponsors(),
  ]);

  return [
    { label: 'Events', count: events.length },
    { label: 'Speakers', count: speakers.length },
    { label: 'Sponsors', count: sponsors.length },
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
          <div key={card.label} className={styles.card}>
            <span className={styles.cardLabel}>{card.label}</span>
            <span className={styles.cardCount}>{card.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
