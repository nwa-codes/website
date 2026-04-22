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

import { createEventAction, updateEventAction } from './actions';
import type { EventFormValues } from './actions';
import styles from './EventForm.module.css';

const EventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  eventStartTime: z.string().min(1, 'Start time is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  venueAddress: z.string().optional(),
  status: z.enum(['draft', 'published', 'completed', 'cancelled'], { errorMap: () => ({ message: 'Status is required' }) }),
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
  eventId?: string;
  speakers: AdminSpeaker[];
  sponsors: AdminSponsor[];
  defaultValues?: Partial<EventFormValues>;
  submitLabel: string;
};

/**
 * Shared form for creating and editing events.
 * When eventId is provided the form calls updateEventAction; otherwise createEventAction.
 */
export const EventForm = ({
  eventId,
  speakers,
  sponsors,
  defaultValues,
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
      eventStartTime: defaultValues?.eventStartTime ?? '',
      venueName: defaultValues?.venueName ?? '',
      venueAddress: defaultValues?.venueAddress ?? '',
      status: defaultValues?.status ?? 'draft',
      imageUrl: defaultValues?.imageUrl ?? '',
      videoUrl: defaultValues?.videoUrl ?? '',
      speakers: (defaultValues?.speakers as AdminSpeaker[]) ?? [],
      sponsors: (defaultValues?.sponsors as AdminSponsor[]) ?? [],
    },
  });

  const handleFormSubmit = (data: EventFormSchema) => {
    startTransition(async () => {
      if (eventId) {
        await updateEventAction(eventId, data as EventFormValues);
      } else {
        await createEventAction(data as EventFormValues);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <FormField label="Title *" error={errors.title?.message}>
        <input
          {...register('title')}
          type="text"
          className={styles.input}
          placeholder="Event title"
        />
      </FormField>

      <FormField label="Start Time (CST) *" error={errors.eventStartTime?.message}>
        <input
          {...register('eventStartTime')}
          type="datetime-local"
          className={styles.input}
        />
      </FormField>

      <div className={styles.row}>
        <FormField label="Venue Name *" error={errors.venueName?.message}>
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

      <FormField label="Status *" error={errors.status?.message}>
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
