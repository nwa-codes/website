export type Speaker = {
  id: string;
  name: string;
  speakerTitle: string;
  imageUrl: string;
};

export type Venue = {
  name: string;
  address: string;
};

export type Event = {
  id: string;
  date: string;
  title: string;
  imageUrl?: string;
  speakers?: Speaker[];
  photos?: string[];
  venue: Venue;
  videoUrl?: string;
  sponsoredBy?: string[];
  sponsoredByLogos?: string[];
  imageCredit?: string;
};

export type MockEvent = {
  date: string;
  title: string;
  imageUrl?: string;
  speakers?: Speaker[];
  photos?: string[];
  venue: Venue;
  videoUrl?: string;
  sponsoredBy?: string;
  sponsoredByLogo?: string;
  imageCredit?: string;
};

export type AdminSpeaker = {
  id: number;
  name: string;
  speakerTitle: string;
  bio: string | null;
  imageUrl: string | null;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  } | null;
  active: boolean;
};

export type AdminSponsor = {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  active: boolean;
};

export type AdminEvent = {
  id: string;
  title: string;
  description: string | null;
  eventStartTime: string;
  eventEndTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  photoUrls: string[];
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  tags: string[];
  maxAttendees: number | null;
  eventType: string | null;
  speakers: AdminSpeaker[];
  sponsors: AdminSponsor[];
  rsvpCount?: number;
};

export type AdminEventSpeakerInput = {
  id: number;
  name?: string;
  title?: string;
  imageUrl?: string;
  displayOrder?: number;
};

export type AdminEventSponsorInput = {
  id: number;
  name?: string;
  logoUrl?: string;
  websiteUrl?: string;
  sponsorshipType?: string;
  displayOrder?: number;
};

/**
 * Shape the Atlas API accepts when creating or updating an event. This is the
 * write counterpart to AdminEvent: speakers and sponsors are sent as id
 * references with optional overrides, not as fully hydrated records.
 */
export type AdminEventPayload = {
  title?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  venueName?: string;
  venueAddress?: string;
  status?: AdminEvent['status'];
  imageUrl?: string;
  videoUrl?: string;
  speakers?: AdminEventSpeakerInput[];
  sponsors?: AdminEventSponsorInput[];
};

export type AdminRsvp = {
  id: number;
  source: 'website' | 'discord';
  status: 'interested' | 'going' | 'not_going';
  email: string | null;
  discordDisplayName: string | null;
  discordUsername: string | null;
  createdAt: string;
};