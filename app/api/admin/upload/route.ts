import { NextResponse } from 'next/server';

import { cloudinary } from '@/utils/cloudinary';
import { ForbiddenError, UnauthorizedError, requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_FOLDERS = ['event-title-photos', 'event-photos', 'speakers', 'sponsors'] as const;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];
type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/**
 * Verifies that the raw bytes of the file match the declared MIME type
 * by inspecting the magic bytes in the first 12 bytes of the buffer.
 */
const validateMagicBytes = (bytes: Uint8Array, mimeType: AllowedMimeType): boolean => {
  if (mimeType === 'image/jpeg') {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === 'image/png') {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }

  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
};

const toDataUri = (buffer: ArrayBuffer, mimeType: string): string => {
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const folder = formData.get('folder') as string | null;

  if (!folder || !(ALLOWED_FOLDERS as readonly string[]).includes(folder)) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (!validateMagicBytes(bytes, file.type as AllowedMimeType)) {
    return NextResponse.json({ error: 'File content does not match declared type' }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.upload(toDataUri(buffer, file.type), {
      folder: folder as AllowedFolder,
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
};
