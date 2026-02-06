/**
 * Client-safe Cloudinary URL transformation utilities.
 * These functions can be used in client components without importing the Node.js SDK.
 */

const CLOUDINARY_CLOUD_NAME = 'dmrl9ghse';

/**
 * Transforms Cloudinary image URLs to generate square, face-cropped avatars.
 * Uses face detection and crop-to-fill transformation to prevent stretching.
 * Generates 2x size for retina displays while preserving original version numbers.
 * Non-Cloudinary URLs are returned unchanged.
 */
export const getAvatarUrl = (url: string, size: number): string => {
  const cloudinaryPattern = /cloudinary\.com\/[^/]+\/image\/upload\/(v\d+\/)?(.+)/;
  const match = url.match(cloudinaryPattern);

  if (!match) {
    return url;
  }

  const [, version, publicId] = match;
  const retinaSize = size * 2;
  const transformations = `c_fill,g_face,w_${retinaSize},h_${retinaSize},q_auto,f_auto`;
  const versionPart = version ?? '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${versionPart}${publicId}`;
};
