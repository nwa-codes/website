'use server';

import { createRSVP, checkExistingRSVP } from '@/utils/airtable';

export async function submitRSVP(
  eventId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const hasRSVP = await checkExistingRSVP(eventId, email);

    if (hasRSVP) {
      return {
        success: false,
        error: "You've already RSVP'd for this event."
      };
    }

    await createRSVP(eventId, email);
    return { success: true };
  } catch (error) {
    console.error('Failed to submit RSVP:', error);
    return {
      success: false,
      error: 'Failed to submit RSVP. Please try again.'
    };
  }
}
