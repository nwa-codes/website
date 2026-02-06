import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Helper to generate optimized image URLs
export function getOptimizedImageUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}) {
  const { width, height, quality = 'auto', format = 'auto' } = options;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations.join(',')}/${publicId}`;
}

// Generate thumbnail URL
export function getThumbnailUrl(url: string, width: number = 400, height: number = 300): string {
  // If already a Cloudinary URL, extract public_id and regenerate with thumbnail params
  const cloudinaryPattern = /cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)/;
  const match = url.match(cloudinaryPattern);

  if (match) {
    const publicId = match[1].replace(/\.[^.]+$/, ''); // Remove extension
    return getOptimizedImageUrl(publicId, { width, height, quality: 80, format: 'auto' });
  }

  // For non-Cloudinary URLs, return as-is (fallback)
  return url;
}

