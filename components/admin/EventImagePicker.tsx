'use client';

import type { JSX } from 'react';
import Image from 'next/image';

import { getImageThumbnailUrl } from '@/utils/cloudinary-client';
import { ImageUpload } from './ImageUpload';
import styles from './EventImagePicker.module.css';

const DEFAULT_EVENT_IMAGE = 'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg';

type EventImagePickerProps = {
  previousImages: string[];
  value: string | null;
  onChange: (url: string) => void;
};

/**
 * Combines a file upload input with a grid of previously used event title images.
 * The default event background always appears first and is pre-selected when no
 * value is set. Admins can upload a new image or click any thumbnail to reuse it.
 */
export const EventImagePicker = ({
  previousImages,
  value,
  onChange,
}: EventImagePickerProps): JSX.Element => {
  const effectiveValue = value || DEFAULT_EVENT_IMAGE;

  const allImages = [
    DEFAULT_EVENT_IMAGE,
    ...previousImages.filter((url) => url !== DEFAULT_EVENT_IMAGE),
  ];

  return (
    <div className={styles.wrapper}>
      <ImageUpload folder="event-title-photos" value={value} onChange={onChange} />

      <div className={styles.previousSection}>
        <span className={styles.previousLabel}>Or choose a previous image</span>
        <div className={styles.grid}>
          {allImages.map((url) => (
            <button
              key={url}
              type="button"
              className={`${styles.thumbnail} ${url === effectiveValue ? styles.thumbnailSelected : ''}`}
              onClick={() => onChange(url)}
              aria-label="Select this image"
              aria-pressed={url === effectiveValue}
            >
              <Image
                src={getImageThumbnailUrl(url, 80, 55)}
                alt="Previous event image"
                width={80}
                height={55}
                className={styles.thumbnailImage}
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
