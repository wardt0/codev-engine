import { createClient } from '@/lib/supabaseServer';

/**
 * Server-side auth helper functions
 * Use these in Server Components, Server Actions, and Route Handlers
 */

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current session
 * Returns null if no active session
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Check if user is authenticated
 * Returns true if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in Server Actions or Route Handlers that require auth
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

