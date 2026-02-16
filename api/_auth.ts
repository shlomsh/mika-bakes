import { verifyToken } from '@clerk/backend';

export async function requireAuth(authHeader: string | null): Promise<string> {
  if (!authHeader) throw Object.assign(new Error('Unauthorized: missing token'), { status: 401 });
  const token = authHeader.replace('Bearer ', '');
  try {
    const { sub } = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    return sub; // Clerk userId
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw Object.assign(new Error(`Unauthorized: ${message}`), { status: 401 });
  }
}
