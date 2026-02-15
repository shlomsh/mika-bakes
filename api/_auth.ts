import { verifyToken } from '@clerk/backend';

export async function requireAuth(authHeader: string | null): Promise<string> {
  if (!authHeader) throw Object.assign(new Error('Unauthorized: missing token'), { status: 401 });
  const token = authHeader.replace('Bearer ', '');
  try {
    const { sub } = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    return sub; // Clerk userId
  } catch (err: any) {
    throw Object.assign(new Error(`Unauthorized: ${err.message}`), { status: 401 });
  }
}
