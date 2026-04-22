'use client';

import { useState } from 'react';
import type { ChangeEvent, JSX } from 'react';
import Image from 'next/image';

import styles from './ImageUpload.module.css';

type ImageUploadFolder = 'event-title-photos' | 'event-photos' | 'speakers' | 'sponsors';

type ImageUploadProps = {
  folder: ImageUploadFolder;
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
};

type UploadState =
  | { status: 'idle' }
  | { status: 'uploading' }
  | { status: 'error'; message: string };

/**
 * File input that uploads an image to /api/admin/upload and calls onChange with the resulting URL.
 * Displays a preview of the current value when set.
 */
export const ImageUpload = ({ folder, value, onChange, label }: ImageUploadProps): JSX.Element => {
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle' });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadState({ status: 'uploading' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = (await response.json()) as { url: string };
      onChange(data.url);
      setUploadState({ status: 'idle' });
    } catch {
      setUploadState({ status: 'error', message: 'Upload failed. Please try again.' });
    }
  };

  return (
    <div className={styles.wrapper}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {value ? (
        <div className={styles.preview}>
          <Image
            src={value}
            alt="Current image"
            width={120}
            height={80}
            className={styles.previewImage}
            unoptimized
          />
        </div>
      ) : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.input}
        onChange={handleFileChange}
        disabled={uploadState.status === 'uploading'}
      />
      {uploadState.status === 'uploading' ? (
        <span className={styles.status}>Uploading...</span>
      ) : null}
      {uploadState.status === 'error' ? (
        <span className={styles.error}>{uploadState.message}</span>
      ) : null}
    </div>
  );
};
