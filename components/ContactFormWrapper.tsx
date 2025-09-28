'use client';

import type { JSX } from 'react';
import { useFormState } from 'react-dom';
import { submitContactForm, type ContactFormState } from '@/app/actions/contact';
import { ContactForm } from './ContactForm';

const initialState: ContactFormState = {};

export const ContactFormWrapper = (): JSX.Element => {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  return <ContactForm state={state} action={formAction} />;
};
