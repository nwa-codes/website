'use client';

import { useTransition } from 'react';
import type { JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormField } from '@/components/admin/FormField';
import { ImageUpload } from '@/components/admin/ImageUpload';

import type { SpeakerFormValues } from './actions';
import styles from './SpeakerForm.module.css';

const SpeakerFormSchema = z.object({
  name: z.string().min(1),
  speakerTitle: z.string().min(1),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
});

type SpeakerFormSchema = z.infer<typeof SpeakerFormSchema>;

type SpeakerFormProps = {
  defaultValues?: Partial<SpeakerFormValues>;
  onSubmit: (data: SpeakerFormValues) => Promise<void>;
  submitLabel: string;
};

/**
 * Shared form for creating and editing speakers.
 * Handles validation via react-hook-form + zod and delegates submission to the parent action.
 */
export const SpeakerForm = ({ defaultValues, onSubmit, submitLabel }: SpeakerFormProps): JSX.Element => {
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
      bio: defaultValues?.bio ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      socialLinks: {
        twitter: defaultValues?.socialLinks?.twitter ?? '',
        linkedin: defaultValues?.socialLinks?.linkedin ?? '',
        github: defaultValues?.socialLinks?.github ?? '',
        website: defaultValues?.socialLinks?.website ?? '',
      },
    },
  });

  const handleFormSubmit = (data: SpeakerFormSchema) => {
    startTransition(async () => {
      await onSubmit(data as SpeakerFormValues);
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <FormField label="Name" error={errors.name?.message}>
        <input
          {...register('name')}
          type="text"
          className={styles.input}
          placeholder="Full name"
        />
      </FormField>

      <FormField label="Title" error={errors.speakerTitle?.message}>
        <input
          {...register('speakerTitle')}
          type="text"
          className={styles.input}
          placeholder="e.g. Senior Engineer at Acme"
        />
      </FormField>

      <FormField label="Bio" error={errors.bio?.message}>
        <textarea
          {...register('bio')}
          className={styles.textarea}
          rows={4}
          placeholder="Short speaker bio"
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

      <FormField label="Twitter" error={errors.socialLinks?.twitter?.message}>
        <input
          {...register('socialLinks.twitter')}
          type="text"
          className={styles.input}
          placeholder="https://twitter.com/handle"
        />
      </FormField>

      <FormField label="LinkedIn" error={errors.socialLinks?.linkedin?.message}>
        <input
          {...register('socialLinks.linkedin')}
          type="text"
          className={styles.input}
          placeholder="https://linkedin.com/in/handle"
        />
      </FormField>

      <FormField label="GitHub" error={errors.socialLinks?.github?.message}>
        <input
          {...register('socialLinks.github')}
          type="text"
          className={styles.input}
          placeholder="https://github.com/handle"
        />
      </FormField>

      <FormField label="Website" error={errors.socialLinks?.website?.message}>
        <input
          {...register('socialLinks.website')}
          type="text"
          className={styles.input}
          placeholder="https://example.com"
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
