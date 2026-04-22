import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

import { AdminTable } from '@/components/admin/AdminTable';
import { getAdminSpeakers } from '@/utils/admin-api';
import type { AdminSpeaker } from '@/utils/event.types';

import { SpeakerActions } from './SpeakerActions';
import styles from './page.module.css';

const buildColumns = () => [
  {
    key: 'name',
    label: 'Name',
    render: (row: AdminSpeaker) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {row.imageUrl ? (
          <Image
            src={row.imageUrl}
            alt={row.name}
            width={32}
            height={32}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#333', flexShrink: 0 }} />
        )}
        <span>{row.name}</span>
        {row.imageUrl ? (
          <a
            href={row.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View photo"
            style={{ color: '#c7c7c7', lineHeight: 1 }}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '12px' }} />
          </a>
        ) : null}
      </div>
    ),
  },
  {
    key: 'speakerTitle',
    label: 'Title',
  },
  {
    key: 'active',
    label: 'Active',
    render: (row: AdminSpeaker) => (
      <span style={{ color: row.active ? '#4caf50' : '#e05a5a', fontWeight: 600 }}>
        {row.active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row: AdminSpeaker) => <SpeakerActions speakerId={row.id} speakerName={row.name} />,
  },
];

const SpeakersPage = async (): Promise<JSX.Element> => {
  const speakers = await getAdminSpeakers();
  const columns = buildColumns();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Speakers</h1>
        <Link href="/admin/speakers/new" className={styles.createLink}>
          New Speaker
        </Link>
      </div>
      <AdminTable columns={columns} rows={speakers} keyField="id" />
    </div>
  );
};

export default SpeakersPage;
