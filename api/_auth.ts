import { createClerkClient } from '@clerk/backend';

export async function requireAuth(authHeader: string | null): Promise<string> {
  if (!authHeader) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  const token = authHeader.replace('Bearer ', '');
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const { sub } = await clerk.verifyToken(token);
  return sub; // Clerk userId
}
