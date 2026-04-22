'use client';

import { useTransition } from 'react';
import type { JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormField } from '@/components/admin/FormField';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SpeakerPicker } from '@/components/admin/SpeakerPicker';
import { SponsorPicker } from '@/components/admin/SponsorPicker';
import type { AdminSpeaker, AdminSponsor } from '@/utils/event.types';

import type { EventFormValues } from './actions';
import styles from './EventForm.module.css';

const EventFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  eventStartTime: z.string().min(1),
  eventEndTime: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  status: z.enum(['draft', 'published', 'completed', 'cancelled']),
  eventType: z.string().optional(),
  tags: z.string(),
  maxAttendees: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  speakers: z.array(z.unknown()).optional(),
  sponsors: z.array(z.unknown()).optional(),
});

type EventFormSchema = z.infer<typeof EventFormSchema>;

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

type EventFormProps = {
  speakers: AdminSpeaker[];
  sponsors: AdminSponsor[];
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (data: EventFormValues) => Promise<void>;
  submitLabel: string;
};

/**
 * Shared form for creating and editing events.
 * Handles validation via react-hook-form + zod and delegates submission to the parent action.
 */
export const EventForm = ({
  speakers,
  sponsors,
  defaultValues,
  onSubmit,
  submitLabel,
}: EventFormProps): JSX.Element => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormSchema>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      eventStartTime: defaultValues?.eventStartTime ?? '',
      eventEndTime: defaultValues?.eventEndTime ?? '',
      venueName: defaultValues?.venueName ?? '',
      venueAddress: defaultValues?.venueAddress ?? '',
      status: defaultValues?.status ?? 'draft',
      eventType: defaultValues?.eventType ?? '',
      tags: defaultValues?.tags ?? '',
      maxAttendees: defaultValues?.maxAttendees,
      imageUrl: defaultValues?.imageUrl ?? '',
      videoUrl: defaultValues?.videoUrl ?? '',
      speakers: (defaultValues?.speakers as AdminSpeaker[]) ?? [],
      sponsors: (defaultValues?.sponsors as AdminSponsor[]) ?? [],
    },
  });

  const handleFormSubmit = (data: EventFormSchema) => {
    startTransition(async () => {
      await onSubmit(data as EventFormValues);
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <FormField label="Title" error={errors.title?.message}>
        <input
          {...register('title')}
          type="text"
          className={styles.input}
          placeholder="Event title"
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          className={styles.textarea}
          rows={4}
          placeholder="Describe the event"
        />
      </FormField>

      <div className={styles.row}>
        <FormField label="Start Time" error={errors.eventStartTime?.message}>
          <input
            {...register('eventStartTime')}
            type="datetime-local"
            className={styles.input}
          />
        </FormField>

        <FormField label="End Time" error={errors.eventEndTime?.message}>
          <input
            {...register('eventEndTime')}
            type="datetime-local"
            className={styles.input}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Venue Name" error={errors.venueName?.message}>
          <input
            {...register('venueName')}
            type="text"
            className={styles.input}
            placeholder="Venue name"
          />
        </FormField>

        <FormField label="Venue Address" error={errors.venueAddress?.message}>
          <input
            {...register('venueAddress')}
            type="text"
            className={styles.input}
            placeholder="Full address"
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Status" error={errors.status?.message}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <AdminSelect
                options={STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>

        <FormField label="Event Type" error={errors.eventType?.message}>
          <input
            {...register('eventType')}
            type="text"
            className={styles.input}
            placeholder="e.g. Meetup, Workshop"
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Tags" error={errors.tags?.message}>
          <input
            {...register('tags')}
            type="text"
            className={styles.input}
            placeholder="comma-separated"
          />
        </FormField>

        <FormField label="Max Attendees" error={errors.maxAttendees?.message}>
          <input
            {...register('maxAttendees')}
            type="number"
            className={styles.input}
            placeholder="Leave blank for unlimited"
            min={1}
          />
        </FormField>
      </div>

      <FormField label="Event Image" error={errors.imageUrl?.message}>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageUpload
              folder="event-title-photos"
              value={field.value ?? null}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField label="Video URL" error={errors.videoUrl?.message}>
        <input
          {...register('videoUrl')}
          type="url"
          className={styles.input}
          placeholder="https://youtube.com/..."
        />
      </FormField>

      <FormField label="Speakers" error={errors.speakers?.message}>
        <Controller
          name="speakers"
          control={control}
          render={({ field }) => (
            <SpeakerPicker
              speakers={speakers}
              value={(field.value as AdminSpeaker[]) ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField label="Sponsors" error={errors.sponsors?.message}>
        <Controller
          name="sponsors"
          control={control}
          render={({ field }) => (
            <SponsorPicker
              sponsors={sponsors}
              value={(field.value as AdminSponsor[]) ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <div className={styles.footer}>
        <button type="submit" className={styles.submitButton} disabled={isPending}>
          {isPending ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
