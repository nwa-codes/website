'use client';

import type { JSX } from 'react';

import type { AdminSponsor } from '@/utils/event.types';

import styles from './SponsorPicker.module.css';

type SponsorPickerProps = {
  sponsors: AdminSponsor[];
  value: AdminSponsor[];
  onChange: (sponsors: AdminSponsor[]) => void;
};

const isSelected = (sponsor: AdminSponsor, value: AdminSponsor[]): boolean =>
  value.some((selected) => selected.id === sponsor.id);

const isVisible = (sponsor: AdminSponsor, value: AdminSponsor[]): boolean =>
  sponsor.active || isSelected(sponsor, value);

const toggleSponsor = (
  sponsor: AdminSponsor,
  value: AdminSponsor[],
  onChange: (sponsors: AdminSponsor[]) => void
) => {
  if (isSelected(sponsor, value)) {
    onChange(value.filter((selected) => selected.id !== sponsor.id));
  } else {
    onChange([...value, sponsor]);
  }
};

/**
 * Multi-select picker for attaching sponsors to an event.
 * Active sponsors are always shown; inactive sponsors are only shown if already assigned.
 */
export const SponsorPicker = ({ sponsors, value, onChange }: SponsorPickerProps): JSX.Element => {
  const visibleSponsors = sponsors.filter((sponsor) => isVisible(sponsor, value));

  return (
    <ul className={styles.list}>
      {visibleSponsors.map((sponsor) => (
        <li key={sponsor.id} className={styles.item}>
          <label
            className={`${styles.label} ${!sponsor.active ? styles.labelInactive : ''}`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isSelected(sponsor, value)}
              disabled={!sponsor.active && !isSelected(sponsor, value)}
              onChange={() => toggleSponsor(sponsor, value, onChange)}
            />
            <span className={styles.name}>{sponsor.name}</span>
            {!sponsor.active ? (
              <span className={styles.inactiveBadge}>(inactive)</span>
            ) : null}
          </label>
        </li>
      ))}
      {visibleSponsors.length === 0 ? (
        <li className={styles.empty}>No sponsors available.</li>
      ) : null}
    </ul>
  );
};
