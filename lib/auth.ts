import { currentUser } from '@clerk/nextjs/server';

import { ForbiddenError } from './errors';

export { ForbiddenError };

/**
 * Verifies the current user has the admin role by fetching the full user object.
 * Uses currentUser() to access publicMetadata, which is not included in session
 * tokens by default and therefore not available via auth().sessionClaims.
 * Throws ForbiddenError if the user is not authenticated or the role is not 'admin'.
 */
export const requireAdmin = async (): Promise<void> => {
  const user = await currentUser();

  if (user?.publicMetadata?.role !== 'admin') {
    throw new ForbiddenError();
  }
};
