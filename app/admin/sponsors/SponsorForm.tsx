'use client';

import { useTransition } from 'react';
import type { JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormField } from '@/components/admin/FormField';
import { ImageUpload } from '@/components/admin/ImageUpload';

import { createSponsorAction, updateSponsorAction } from './actions';
import type { SponsorFormValues } from './actions';
import styles from './SponsorForm.module.css';

const SponsorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

type SponsorFormSchema = z.infer<typeof SponsorFormSchema>;

type SponsorFormProps = {
  sponsorId?: string;
  defaultValues?: Partial<SponsorFormValues>;
  submitLabel: string;
};

/**
 * Shared form for creating and editing sponsors.
 * When sponsorId is provided the form calls updateSponsorAction; otherwise createSponsorAction.
 */
export const SponsorForm = ({ sponsorId, defaultValues, submitLabel }: SponsorFormProps): JSX.Element => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SponsorFormSchema>({
    resolver: zodResolver(SponsorFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      logoUrl: defaultValues?.logoUrl ?? '',
      websiteUrl: defaultValues?.websiteUrl ?? '',
    },
  });

  const handleFormSubmit = (data: SponsorFormSchema) => {
    startTransition(async () => {
      if (sponsorId) {
        await updateSponsorAction(sponsorId, data as SponsorFormValues);
      } else {
        await createSponsorAction(data as SponsorFormValues);
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
          placeholder="Sponsor name"
        />
      </FormField>

      <FormField label="Logo" error={errors.logoUrl?.message}>
        <Controller
          name="logoUrl"
          control={control}
          render={({ field }) => (
            <ImageUpload
              folder="sponsors"
              value={field.value ?? null}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField label="Website URL" error={errors.websiteUrl?.message}>
        <input
          {...register('websiteUrl')}
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
