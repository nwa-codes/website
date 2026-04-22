import { currentUser } from '@clerk/nextjs/server';

import { ForbiddenError, UnauthorizedError } from './errors';

export { ForbiddenError, UnauthorizedError };

/**
 * Verifies the current user has the admin role by fetching the full user object.
 * Uses currentUser() to access publicMetadata, which is not included in session
 * tokens by default and therefore not available via auth().sessionClaims.
 * Throws UnauthorizedError if the user is not authenticated.
 * Throws ForbiddenError if the user is authenticated but lacks the admin role.
 */
export const requireAdmin = async (): Promise<void> => {
  const user = await currentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  if (user.publicMetadata?.role !== 'admin') {
    throw new ForbiddenError();
  }
};
