import type { JSX } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';

import { AdminTable } from '@/components/admin/AdminTable';
import { getAdminSponsors } from '@/utils/admin-api';
import type { AdminSponsor } from '@/utils/event.types';

import { SponsorActions } from './SponsorActions';
import styles from './page.module.css';

const buildColumns = () => [
  {
    key: 'name',
    label: 'Name',
    render: (row: AdminSponsor) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{row.name}</span>
        {row.logoUrl ? (
          <a
            href={row.logoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View logo"
            style={{ color: '#c7c7c7', lineHeight: 1 }}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '12px' }} />
          </a>
        ) : null}
      </div>
    ),
  },
  {
    key: 'active',
    label: 'Active',
    render: (row: AdminSponsor) => (
      <span style={{ color: row.active ? '#4caf50' : '#e05a5a', fontWeight: 600 }}>
        {row.active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row: AdminSponsor) => <SponsorActions sponsorId={row.id} sponsorName={row.name} />,
  },
];

const SponsorsPage = async (): Promise<JSX.Element> => {
  const sponsors = await getAdminSponsors();
  const columns = buildColumns();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Sponsors</h1>
        <Link href="/admin/sponsors/new" className={styles.createLink}>
          New Sponsor
        </Link>
      </div>
      <AdminTable columns={columns} rows={sponsors} keyField="id" />
    </div>
  );
};

export default SponsorsPage;
