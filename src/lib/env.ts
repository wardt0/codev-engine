import { z } from 'zod';

/**
 * Environment Variable Validation
 * 
 * This file validates all required environment variables at runtime.
 * If any required variables are missing or invalid, the application
 * will throw a descriptive error before starting.
 * 
 * Usage:
 * import { env } from '@/lib/env';
 * const url = env.NEXT_PUBLIC_SUPABASE_URL;
 */

// Define the schema for environment variables
const envSchema = z.object({
  // Public Supabase Configuration (accessible in browser)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // Server-side only Supabase Configuration
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // Database Connection String
  SUPABASE_DB_URL: z
    .string()
    .min(1, 'SUPABASE_DB_URL is required')
    .refine(
      (val) => val.startsWith('postgresql://') || val.startsWith('postgres://'),
      'SUPABASE_DB_URL must be a valid PostgreSQL connection string'
    ),
});

// Validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
    });

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => {
        return `  ❌ ${err.path.join('.')}: ${err.message}`;
      });

      throw new Error(
        `\n\n🚨 Environment Variable Validation Failed!\n\n` +
        `Missing or invalid environment variables:\n\n` +
        `${missingVars.join('\n')}\n\n` +
        `Please check your .env.local file and ensure all required variables are set.\n\n` +
        `Required variables:\n` +
        `  - NEXT_PUBLIC_SUPABASE_URL (must be a valid URL)\n` +
        `  - NEXT_PUBLIC_SUPABASE_ANON_KEY\n` +
        `  - SUPABASE_SERVICE_ROLE_KEY\n` +
        `  - SUPABASE_DB_URL (must be a PostgreSQL connection string)\n\n` +
        `Example .env.local:\n` +
        `  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n` +
        `  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n` +
        `  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n` +
        `  SUPABASE_DB_URL=postgresql://postgres:password@host:5432/postgres\n`
      );
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe access to environment variables
export type Env = z.infer<typeof envSchema>;

