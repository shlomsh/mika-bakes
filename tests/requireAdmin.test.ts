// Unit tests for api/_auth.ts (requireAuth / requireAdmin) with @clerk/backend mocked.
// Run: npm run test:api
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

type FakeUser = { publicMetadata: Record<string, unknown> };

// token -> userId (anything else fails verification)
const tokens: Record<string, string> = {
  'admin-token': 'user_admin',
  'plain-token': 'user_plain',
  'editor-token': 'user_editor',
  'gone-token': 'user_gone',
  'outage-token': 'user_outage',
};
const users: Record<string, FakeUser> = {
  user_admin: { publicMetadata: { role: 'admin' } },
  user_plain: { publicMetadata: {} },
  user_editor: { publicMetadata: { role: 'editor' } },
};

mock.module('@clerk/backend', {
  namedExports: {
    verifyToken: async (token: string) => {
      const sub = tokens[token];
      if (!sub) throw new Error('Invalid JWT');
      return { sub };
    },
    createClerkClient: () => ({
      users: {
        getUser: async (userId: string) => {
          if (userId === 'user_outage') throw Object.assign(new Error('boom'), { status: 500 });
          const user = users[userId];
          if (!user) throw Object.assign(new Error('Not Found'), { status: 404 });
          return user;
        },
      },
    }),
  },
});

const { requireAuth, requireAdmin } = await import('../api/_auth.ts');

async function statusOf(p: Promise<unknown>): Promise<number | 'ok'> {
  try {
    await p;
    return 'ok';
  } catch (err) {
    return (err as { status?: number }).status ?? -1;
  }
}

test('requireAuth: missing header -> 401', async () => {
  assert.equal(await statusOf(requireAuth(null)), 401);
});

test('requireAuth: any signed-in user passes', async () => {
  assert.equal(await requireAuth('Bearer plain-token'), 'user_plain');
});

test('requireAdmin: missing header -> 401', async () => {
  assert.equal(await statusOf(requireAdmin(null)), 401);
});

test('requireAdmin: invalid token -> 401', async () => {
  assert.equal(await statusOf(requireAdmin('Bearer garbage')), 401);
});

test('requireAdmin: signed in, no role -> 403', async () => {
  assert.equal(await statusOf(requireAdmin('Bearer plain-token')), 403);
});

test('requireAdmin: signed in, other role -> 403', async () => {
  assert.equal(await statusOf(requireAdmin('Bearer editor-token')), 403);
});

test('requireAdmin: user deleted in Clerk -> 401', async () => {
  assert.equal(await statusOf(requireAdmin('Bearer gone-token')), 401);
});

test('requireAdmin: Clerk lookup fails -> 503 (fails closed)', async () => {
  const origError = console.error;
  console.error = () => {};
  try {
    assert.equal(await statusOf(requireAdmin('Bearer outage-token')), 503);
  } finally {
    console.error = origError;
  }
});

test('requireAdmin: role admin -> returns userId', async () => {
  assert.equal(await requireAdmin('Bearer admin-token'), 'user_admin');
});
