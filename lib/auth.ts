import { auth } from '@clerk/nextjs/server';

import { ForbiddenError } from './errors';

export { ForbiddenError };

/**
 * Verifies the current session belongs to a user with the admin role.
 * Throws ForbiddenError if the session is missing or the role is not 'admin'.
 */
export const requireAdmin = async (): Promise<void> => {
  const { sessionClaims } = await auth();

  if (sessionClaims?.publicMetadata?.role !== 'admin') {
    throw new ForbiddenError();
  }
};
