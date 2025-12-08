import type { Event } from './event.types';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Generates an ICS calendar file for an event
 * @param event - The event to create a calendar entry for
 * @returns A blob URL for the ICS file
 */
export function generateICSFile(event: Event): string {
  const timezone = 'America/Chicago';
  const eventDate = toZonedTime(new Date(event.date), timezone);

  // Format date for ICS (YYYYMMDDTHHMMSS)
  const formatICSDate = (date: Date): string => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  // Calculate end time (assume 2 hour duration if not specified)
  const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

  // Format location
  const location = event.venue
    ? `${event.venue.name}, ${event.venue.address}`
    : 'TBD';

  // Format description
  const description = [
    event.title,
    event.speaker ? `Speaker: ${event.speaker.name}` : '',
    event.speaker?.speakerTitle ? event.speaker.speakerTitle : '',
  ]
    .filter(Boolean)
    .join('\\n');

  // Generate ICS content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NWA Codes//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@nwacodes.com`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(eventDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Event starts in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  // Create blob and return URL
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
}

/**
 * Downloads an ICS file for an event
 * @param event - The event to download
 */
export function downloadICSFile(event: Event): void {
  const url = generateICSFile(event);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nwacodes-${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
