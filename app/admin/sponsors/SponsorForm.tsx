'use client';

import { useTransition } from 'react';
import type { JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormField } from '@/components/admin/FormField';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { ImageUpload } from '@/components/admin/ImageUpload';

import type { SponsorFormValues } from './actions';
import styles from './SponsorForm.module.css';

const SponsorFormSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  tier: z.string().min(1),
});

type SponsorFormSchema = z.infer<typeof SponsorFormSchema>;

type SponsorFormProps = {
  defaultValues?: Partial<SponsorFormValues>;
  onSubmit: (data: SponsorFormValues) => Promise<void>;
  submitLabel: string;
};

const TIER_OPTIONS = [
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Community', value: 'community' },
];

/**
 * Shared form for creating and editing sponsors.
 * Handles validation via react-hook-form + zod and delegates submission to the parent action.
 */
export const SponsorForm = ({ defaultValues, onSubmit, submitLabel }: SponsorFormProps): JSX.Element => {
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
      tier: defaultValues?.tier ?? '',
    },
  });

  const handleFormSubmit = (data: SponsorFormSchema) => {
    startTransition(async () => {
      await onSubmit(data as SponsorFormValues);
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <FormField label="Name" error={errors.name?.message}>
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

      <FormField label="Tier" error={errors.tier?.message}>
        <Controller
          name="tier"
          control={control}
          render={({ field }) => (
            <AdminSelect
              options={TIER_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a tier"
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
