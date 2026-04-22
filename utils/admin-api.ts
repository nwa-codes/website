import type { AdminEvent, AdminSpeaker, AdminSponsor } from './event.types';

/**
 * Performs an authenticated request to the Atlas API.
 * Throws a descriptive Error on non-2xx responses.
 */
const atlasRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${process.env.ATLAS_API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ATLAS_API_KEY ?? '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Atlas API error ${response.status}: ${options.method ?? 'GET'} ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

/**
 * Fetches all events from the Atlas admin API.
 */
export const getAdminEvents = (): Promise<AdminEvent[]> =>
  atlasRequest<AdminEvent[]>('/api/events');

/**
 * Fetches a single event by ID from the Atlas admin API.
 */
export const getAdminEvent = (id: string): Promise<AdminEvent> =>
  atlasRequest<AdminEvent>(`/api/events/${id}`);

/**
 * Creates a new event via the Atlas admin API.
 */
export const createEvent = (payload: Partial<AdminEvent>): Promise<AdminEvent> =>
  atlasRequest<AdminEvent>('/api/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/**
 * Updates an existing event by ID via the Atlas admin API.
 */
export const updateEvent = (id: string, payload: Partial<AdminEvent>): Promise<AdminEvent> =>
  atlasRequest<AdminEvent>(`/api/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

/**
 * Soft-deletes an event by ID via the Atlas admin API.
 */
export const softDeleteEvent = (id: string): Promise<void> =>
  atlasRequest<void>(`/api/events/${id}`, { method: 'DELETE' });

/**
 * Fetches all speakers from the Atlas admin API.
 */
export const getAdminSpeakers = (): Promise<AdminSpeaker[]> =>
  atlasRequest<AdminSpeaker[]>('/api/speakers');

/**
 * Fetches a single speaker by ID from the Atlas admin API.
 */
export const getAdminSpeaker = (id: string): Promise<AdminSpeaker> =>
  atlasRequest<AdminSpeaker>(`/api/speakers/${id}`);

/**
 * Creates a new speaker via the Atlas admin API.
 */
export const createSpeaker = (payload: Partial<AdminSpeaker>): Promise<AdminSpeaker> =>
  atlasRequest<AdminSpeaker>('/api/speakers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/**
 * Updates an existing speaker by ID via the Atlas admin API.
 */
export const updateSpeaker = (id: string, payload: Partial<AdminSpeaker>): Promise<AdminSpeaker> =>
  atlasRequest<AdminSpeaker>(`/api/speakers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

/**
 * Deactivates a speaker by ID via the Atlas admin API.
 */
export const deactivateSpeaker = (id: string): Promise<AdminSpeaker> =>
  atlasRequest<AdminSpeaker>(`/api/speakers/${id}/deactivate`, { method: 'PATCH' });

/**
 * Fetches all sponsors from the Atlas admin API.
 */
export const getAdminSponsors = (): Promise<AdminSponsor[]> =>
  atlasRequest<AdminSponsor[]>('/api/sponsors');

/**
 * Fetches a single sponsor by ID from the Atlas admin API.
 */
export const getAdminSponsor = (id: string): Promise<AdminSponsor> =>
  atlasRequest<AdminSponsor>(`/api/sponsors/${id}`);

/**
 * Creates a new sponsor via the Atlas admin API.
 */
export const createSponsor = (payload: Partial<AdminSponsor>): Promise<AdminSponsor> =>
  atlasRequest<AdminSponsor>('/api/sponsors', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/**
 * Updates an existing sponsor by ID via the Atlas admin API.
 */
export const updateSponsor = (id: string, payload: Partial<AdminSponsor>): Promise<AdminSponsor> =>
  atlasRequest<AdminSponsor>(`/api/sponsors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

/**
 * Deactivates a sponsor by ID via the Atlas admin API.
 */
export const deactivateSponsor = (id: string): Promise<AdminSponsor> =>
  atlasRequest<AdminSponsor>(`/api/sponsors/${id}/deactivate`, { method: 'PATCH' });
