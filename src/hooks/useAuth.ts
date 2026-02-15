import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

export function useAuth() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();

  return {
    session: isSignedIn ? { user } : null,
    user: user ?? null,
    loading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    getToken,
  };
}
