'use client';

import { useTransition } from 'react';
import type { JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormField } from '@/components/admin/FormField';
import { ImageUpload } from '@/components/admin/ImageUpload';

import { createSpeakerAction, updateSpeakerAction } from './actions';
import type { SpeakerFormValues } from './actions';
import styles from './SpeakerForm.module.css';

const SpeakerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  speakerTitle: z.string().min(1, 'Title is required'),
  imageUrl: z.string().optional(),
});

type SpeakerFormSchema = z.infer<typeof SpeakerFormSchema>;

type SpeakerFormProps = {
  speakerId?: string;
  defaultValues?: Partial<SpeakerFormValues>;
  submitLabel: string;
};

/**
 * Shared form for creating and editing speakers.
 * When speakerId is provided the form calls updateSpeakerAction; otherwise createSpeakerAction.
 */
export const SpeakerForm = ({ speakerId, defaultValues, submitLabel }: SpeakerFormProps): JSX.Element => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SpeakerFormSchema>({
    resolver: zodResolver(SpeakerFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      speakerTitle: defaultValues?.speakerTitle ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
    },
  });

  const handleFormSubmit = (data: SpeakerFormSchema) => {
    startTransition(async () => {
      if (speakerId) {
        await updateSpeakerAction(speakerId, data as SpeakerFormValues);
      } else {
        await createSpeakerAction(data as SpeakerFormValues);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <FormField label="Name *" error={errors.name?.message}>
        <input
          {...register('name')}
          type="text"
          className={styles.input}
          placeholder="Full name"
        />
      </FormField>

      <FormField label="Title *" error={errors.speakerTitle?.message}>
        <input
          {...register('speakerTitle')}
          type="text"
          className={styles.input}
          placeholder="e.g. Senior Engineer at Acme"
        />
      </FormField>

      <FormField label="Photo" error={errors.imageUrl?.message}>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageUpload
              folder="speakers"
              value={field.value ?? null}
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
