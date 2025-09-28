'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  interests: z
    .array(z.enum(['sponsor', 'host', 'speaker']))
    .min(1, 'Please select at least one option')
});

export type ContactFormState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    interests?: string[];
    _form?: string[];
  };
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const interests = formData.getAll('interests') as string[];

  const validationResult = contactFormSchema.safeParse({
    name,
    email,
    interests
  });

  if (!validationResult.success) {
    const flattened = z.flattenError(validationResult.error);
    return {
      errors: flattened.fieldErrors
    };
  }

  try {
    const { name, email, interests } = validationResult.data;
    const interestsText = interests.join(', ');

    // Add delay in development mode to see loading state
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 750));

      console.table({
        Name: name,
        Email: email,
        'Interested in': interestsText,
        'Submitted at': new Date().toISOString()
      });

      console.log('Form submission (dev mode - no email sent)');
      return { success: true };
    }

    await resend.emails.send({
      from: 'NWA Codes <noreply@nwacodes.com>',
      to: [process.env.CONTACT_EMAIL!],
      subject: `New contact submission - ${name}`,
      text: `New contact submission from the website:
Name: ${name}
Email: ${email}
Interested in: ${interestsText}`
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      errors: {
        _form: ['An unexpected error occurred. Please try again.']
      }
    };
  }
}
