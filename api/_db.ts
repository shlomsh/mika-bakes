import { neon } from '@neondatabase/serverless';

// Singleton: created once at module load, reused across invocations
// on the same warm function instance instead of reconnecting every request.
const _sql = neon(process.env.DATABASE_URL!);

export const getDb = () => _sql;
