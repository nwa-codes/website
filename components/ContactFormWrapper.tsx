'use client';

import type { JSX } from 'react';
import { useActionState } from 'react';
import { submitContactForm, type ContactFormState } from '@/app/actions/contact';
import { ContactForm } from './ContactForm';

const initialState: ContactFormState = {};

export const ContactFormWrapper = (): JSX.Element => {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return <ContactForm state={state} action={formAction} />;
};
