import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

/** Must match ADMIN_ROLE in api/_auth.ts. The server is the real gate; this only drives the UI. */
const ADMIN_ROLE = 'admin';

export function useAuth() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  const isAuthenticated = isSignedIn ?? false;
  const isAdmin = isAuthenticated && user?.publicMetadata?.role === ADMIN_ROLE;

  return {
    session: isSignedIn ? { user } : null,
    user: user ?? null,
    loading: !isLoaded || !isUserLoaded,
    isAuthenticated,
    isAdmin,
    getToken,
  };
}
