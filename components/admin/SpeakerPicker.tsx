'use client';

import type { JSX } from 'react';

import type { AdminSpeaker } from '@/utils/event.types';

import styles from './SpeakerPicker.module.css';

type SpeakerPickerProps = {
  speakers: AdminSpeaker[];
  value: AdminSpeaker[];
  onChange: (speakers: AdminSpeaker[]) => void;
};

const isSelected = (speaker: AdminSpeaker, value: AdminSpeaker[]): boolean =>
  value.some((selected) => selected.id === speaker.id);

const isVisible = (speaker: AdminSpeaker, value: AdminSpeaker[]): boolean =>
  speaker.active || isSelected(speaker, value);

const toggleSpeaker = (
  speaker: AdminSpeaker,
  value: AdminSpeaker[],
  onChange: (speakers: AdminSpeaker[]) => void
) => {
  if (isSelected(speaker, value)) {
    onChange(value.filter((selected) => selected.id !== speaker.id));
  } else {
    onChange([...value, speaker]);
  }
};

/**
 * Multi-select picker for attaching speakers to an event.
 * Active speakers are always shown; inactive speakers are only shown if already assigned.
 */
export const SpeakerPicker = ({ speakers, value, onChange }: SpeakerPickerProps): JSX.Element => {
  const visibleSpeakers = speakers.filter((speaker) => isVisible(speaker, value));

  return (
    <ul className={styles.list}>
      {visibleSpeakers.map((speaker) => (
        <li key={speaker.id} className={styles.item}>
          <label
            className={`${styles.label} ${!speaker.active ? styles.labelInactive : ''}`}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isSelected(speaker, value)}
              disabled={!speaker.active && !isSelected(speaker, value)}
              onChange={() => toggleSpeaker(speaker, value, onChange)}
            />
            <span className={styles.name}>{speaker.name}</span>
            {speaker.speakerTitle ? (
              <span className={styles.title}>{speaker.speakerTitle}</span>
            ) : null}
            {!speaker.active ? (
              <span className={styles.inactiveBadge}>(inactive)</span>
            ) : null}
          </label>
        </li>
      ))}
      {visibleSpeakers.length === 0 ? (
        <li className={styles.empty}>No speakers available.</li>
      ) : null}
    </ul>
  );
};
