'use server';

type RSVPResult = { success: true } | { success: false; error: string };

/**
 * Submits an RSVP for an event to the Atlas API.
 * Returns a 409 if the email is already registered, 404 if the event is not
 * found, and a generic error for any other non-2xx response.
 */
export const submitRSVP = async (eventId: string, email: string): Promise<RSVPResult> => {
  const response = await fetch(`${process.env.ATLAS_API_URL}/api/events/${eventId}/rsvps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ATLAS_API_KEY ?? ''
    },
    body: JSON.stringify({ email, source: 'website' }),
    cache: 'no-store'
  });

  if (response.status === 409) {
    return { success: false, error: 'already_registered' };
  }

  if (response.status === 404) {
    return { success: false, error: 'event_not_found' };
  }

  if (!response.ok) {
    return { success: false, error: 'submission_failed' };
  }

  return { success: true };
};
