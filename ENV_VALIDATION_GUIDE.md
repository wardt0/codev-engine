# Environment Variable Validation Guide

## 📋 Overview

The `/src/lib/env.ts` file uses Zod to validate all required environment variables at runtime, ensuring your application has the correct configuration before it starts.

---

## 📁 File: `/src/lib/env.ts`

### Features:

✅ **Runtime Validation** - Checks env vars when the app starts  
✅ **Type Safety** - Fully typed environment variables  
✅ **Descriptive Errors** - Clear error messages for missing/invalid variables  
✅ **URL Validation** - Ensures Supabase URL is a valid URL  
✅ **Database URL Validation** - Ensures DB URL is a PostgreSQL connection string  
✅ **Single Source of Truth** - Import from one place throughout your app  

---

## 🔑 Validated Environment Variables

| Variable | Type | Validation | Access |
|----------|------|------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | string | Must be valid URL | Browser + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | Required | Browser + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | string | Required | Server only |
| `SUPABASE_DB_URL` | string | Must start with `postgresql://` | Server only |

---

## 📝 Usage Examples

### Basic Usage:

```typescript
import { env } from '@/lib/env';

// Access validated environment variables
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = env.SUPABASE_DB_URL;
```

### In Supabase Client:

```typescript
// Before (unsafe):
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) throw new Error('Missing URL');

// After (validated):
import { env } from '@/lib/env';
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL; // Always defined
```

### In Database Connection:

```typescript
import { env } from '@/lib/env';
import postgres from 'postgres';

// Database URL is guaranteed to be valid PostgreSQL connection string
const client = postgres(env.SUPABASE_DB_URL);
```

---

## 🚨 Error Messages

### Example: Missing Variable

```
🚨 Environment Variable Validation Failed!

Missing or invalid environment variables:

  ❌ NEXT_PUBLIC_SUPABASE_URL: NEXT_PUBLIC_SUPABASE_URL is required
  ❌ SUPABASE_DB_URL: SUPABASE_DB_URL is required

Please check your .env.local file and ensure all required variables are set.

Required variables:
  - NEXT_PUBLIC_SUPABASE_URL (must be a valid URL)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_DB_URL (must be a PostgreSQL connection string)

Example .env.local:
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  SUPABASE_DB_URL=postgresql://postgres:password@host:5432/postgres
```

### Example: Invalid URL

```
❌ NEXT_PUBLIC_SUPABASE_URL: NEXT_PUBLIC_SUPABASE_URL must be a valid URL
```

### Example: Invalid Database URL

```
❌ SUPABASE_DB_URL: SUPABASE_DB_URL must be a valid PostgreSQL connection string
```

---

## 🔄 Updating Existing Files

### 1. Update `/src/lib/supabaseClient.ts`:

**Before:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables');
}
```

**After:**
```typescript
import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### 2. Update `/src/lib/supabaseServer.ts`:

**Before:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables');
}
```

**After:**
```typescript
import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### 3. Update `/src/lib/db.ts`:

**Before:**
```typescript
if (!process.env.SUPABASE_DB_URL) {
  throw new Error('SUPABASE_DB_URL is not set');
}

const client = postgres(process.env.SUPABASE_DB_URL, { prepare: false });
```

**After:**
```typescript
import { env } from '@/lib/env';

const client = postgres(env.SUPABASE_DB_URL, { prepare: false });
```

### 4. Update `/drizzle.config.ts`:

**Before:**
```typescript
dbCredentials: {
  url: process.env.SUPABASE_DB_URL!,
}
```

**After:**
```typescript
import { env } from './src/lib/env';

dbCredentials: {
  url: env.SUPABASE_DB_URL,
}
```

---

## ✅ Benefits

### 1. **Early Error Detection**
- Errors caught at startup, not at runtime
- Clear error messages guide developers

### 2. **Type Safety**
- TypeScript knows variables are always defined
- No need for `!` or optional chaining

### 3. **Single Source of Truth**
- One place to import environment variables
- Consistent validation across the app

### 4. **Better Developer Experience**
- Clear error messages
- Example .env.local in error output
- Validation rules documented in code

---

## 🧪 Testing Validation

### Test 1: Missing Variable

1. Comment out a variable in `.env.local`:
```env
# NEXT_PUBLIC_SUPABASE_URL=https://...
```

2. Start dev server:
```bash
npm run dev
```

3. Expected output:
```
Error: Environment Variable Validation Failed!
  ❌ NEXT_PUBLIC_SUPABASE_URL: NEXT_PUBLIC_SUPABASE_URL is required
```

### Test 2: Invalid URL

1. Set invalid URL in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=not-a-url
```

2. Start dev server

3. Expected output:
```
Error: NEXT_PUBLIC_SUPABASE_URL must be a valid URL
```

### Test 3: Invalid Database URL

1. Set invalid DB URL in `.env.local`:
```env
SUPABASE_DB_URL=mysql://localhost:3306/db
```

2. Start dev server

3. Expected output:
```
Error: SUPABASE_DB_URL must be a valid PostgreSQL connection string
```

---

## 📊 Current .env.local

Your current environment variables (already valid):

```env
NEXT_PUBLIC_SUPABASE_URL=https://exzhyofcaiklkghfnbdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=[configured]
SUPABASE_DB_URL=[configured]
```

✅ All required variables are present and valid!

---

## 🔐 Security Notes

### Server-Only Variables

These variables are ONLY accessible on the server:
- `SUPABASE_SERVICE_ROLE_KEY` - Never expose to browser
- `SUPABASE_DB_URL` - Never expose to browser

### Public Variables

These variables are safe to expose to the browser:
- `NEXT_PUBLIC_SUPABASE_URL` - Public URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key

The `NEXT_PUBLIC_` prefix means these are bundled into the client-side JavaScript.

---

## 🚀 Next Steps

### Optional: Migrate Existing Files

You can optionally update existing files to use the validated `env` object instead of `process.env` directly. This provides:
- Better type safety
- Centralized validation
- Cleaner code

### Add More Variables

To add more environment variables:

1. Add to the schema in `/src/lib/env.ts`:
```typescript
const envSchema = z.object({
  // ... existing variables
  
  // Add new variable
  MY_NEW_VARIABLE: z.string().min(1, 'MY_NEW_VARIABLE is required'),
});
```

2. Import and use:
```typescript
import { env } from '@/lib/env';
const myVar = env.MY_NEW_VARIABLE;
```

---

## ✅ Summary

✅ Created `/src/lib/env.ts` with Zod validation  
✅ Validates all 4 required environment variables  
✅ Throws descriptive errors if any missing/invalid  
✅ Exports type-safe constants  
✅ Ready to use throughout your application  

**Your environment variables are now validated and type-safe!** 🎉

