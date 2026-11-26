import { createClerkClient, verifyToken } from '@clerk/backend';

/**
 * Server-side auth helpers for Vercel functions.
 *
 * Self-contained on purpose (no project imports) so other projects on the
 * same stack can copy this file as is. Needs CLERK_SECRET_KEY.
 *
 * Errors carry an explicit `status`:
 *   401 — missing/invalid token, or the user no longer exists
 *   403 — signed in, but not an admin
 *   503 — Clerk could not be reached to check the role (fails closed)
 */

/** A user is an admin only when their Clerk publicMetadata.role is exactly this. */
export const ADMIN_ROLE = 'admin';

type HttpError = Error & { status: number };

function httpError(status: number, message: string): HttpError {
  return Object.assign(new Error(message), { status });
}

/** Verifies the Clerk session token and returns the Clerk userId. Any signed-in user passes. */
export async function requireAuth(authHeader: string | null): Promise<string> {
  if (!authHeader) throw httpError(401, 'Unauthorized: missing token');
  const token = authHeader.replace('Bearer ', '');
  try {
    const { sub } = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    return sub; // Clerk userId
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw httpError(401, `Unauthorized: ${message}`);
  }
}

let clerk: ReturnType<typeof createClerkClient> | null = null;
function getClerk() {
  if (!clerk) clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  return clerk;
}

/**
 * Verifies the token, then loads the user from Clerk and checks
 * publicMetadata.role === 'admin'. The role is read live from Clerk on every
 * call (not from the session token), so removing the role takes effect on the
 * next request and no custom session-token claim is needed.
 *
 * Returns the Clerk userId of the admin.
 */
export async function requireAdmin(authHeader: string | null): Promise<string> {
  const userId = await requireAuth(authHeader);

  let role: unknown;
  try {
    const user = await getClerk().users.getUser(userId);
    role = user.publicMetadata?.role;
  } catch (err: unknown) {
    if ((err as { status?: number }).status === 404) {
      throw httpError(401, 'Unauthorized: user not found');
    }
    console.error('requireAdmin: Clerk user lookup failed:', err);
    throw httpError(503, 'Could not verify admin access, please try again');
  }

  if (role !== ADMIN_ROLE) {
    throw httpError(403, 'Forbidden: admin access required');
  }
  return userId;
}
