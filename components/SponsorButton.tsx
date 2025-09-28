'use client';

import type { JSX } from 'react';
import { Button } from '@/components/Button';

export const SponsorButton = (): JSX.Element => {
  const scrollToContactForm = () => {
    const contactForm = document.querySelector('[data-section="sponsor-form"]');

    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button variant="outline" onClick={scrollToContactForm}>
      BECOME A SPONSOR
    </Button>
  );
};
