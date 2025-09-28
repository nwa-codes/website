'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronsDown } from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import styles from './ScrollIndicator.module.css';

type ScrollIndicatorProps = {
  hasPastEvents: boolean;
};

export const ScrollIndicator = ({ hasPastEvents }: ScrollIndicatorProps) => {
  const handleScroll = () => {
    const pastEventsSection = document.querySelector('[data-section="past-events"]');
    const sponsorSection = document.querySelector('[data-section="sponsor-form"]');

    if (hasPastEvents && pastEventsSection) {
      pastEventsSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (!hasPastEvents && sponsorSection) {
      sponsorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      className={styles.scrollIndicator}
      onClick={handleScroll}
      aria-label={hasPastEvents ? 'Scroll to past events' : 'Scroll to sponsor form'}
    >
      <FontAwesomeIcon icon={faChevronsDown} className={styles.scrollIcon} aria-hidden="true" />
    </button>
  );
};
