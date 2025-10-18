import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.SUPABASE_DB_URL) {
  throw new Error('SUPABASE_DB_URL is not set');
}

// Disable prefetch as it's not supported for "Transaction" pool mode
const client = postgres(process.env.SUPABASE_DB_URL, { prepare: false });
export const db = drizzle(client);

