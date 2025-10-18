# Authentication Files - Complete Code

## 📋 Summary

This document contains the complete code for the two core authentication files requested:
1. `/src/lib/supabaseClient.ts` - Browser client
2. `/src/lib/supabaseServer.ts` - Server-side client

Both files share the same environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 1️⃣ Browser Client: `/src/lib/supabaseClient.ts`

**Purpose:** Use in Client Components (with `'use client'` directive)

```typescript
import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase Browser Client
 * Use this in Client Components (with 'use client' directive)
 * Automatically handles session management in the browser
 */

export function createClient() {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
```

### Usage Example:

```tsx
'use client';

import { createClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  return <div>{user?.email || 'Not logged in'}</div>;
}
```

---

## 2️⃣ Server Client: `/src/lib/supabaseServer.ts`

**Purpose:** Use in Server Components, Server Actions, and Route Handlers

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase Server Client
 * Use this in Server Components, Server Actions, and Route Handlers
 * Handles session management using cookies for server-side operations
 */

export async function createClient() {
  const cookieStore = await cookies();

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
```

### Usage Examples:

#### In Server Components:

```tsx
import { createClient } from '@/lib/supabaseServer';

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <div>Welcome, {user?.email}!</div>;
}
```

#### In Server Actions:

```tsx
'use server';

import { createClient } from '@/lib/supabaseServer';

export async function myServerAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // Your logic here...
}
```

#### In API Route Handlers:

```tsx
import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user });
}
```

---

## 🔑 Environment Variables

Both files use these shared environment variables from `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://exzhyofcaiklkghfnbdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4emh5b2ZjYWlrbGtnaGZuYmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzQ3ODgsImV4cCI6MjA3NjM1MDc4OH0.Itc4jh7YggW8tadRg-RHFJO_Q6eeJtR-y3zUZBEWc0k
```

---

## 🎯 When to Use Which Client

### Use Browser Client (`supabaseClient.ts`) When:

✅ In Client Components (`'use client'`)  
✅ Handling user interactions (login forms, buttons)  
✅ Listening to auth state changes (`onAuthStateChange`)  
✅ Real-time subscriptions  
✅ Client-side navigation after auth  

### Use Server Client (`supabaseServer.ts`) When:

✅ In Server Components (default in App Router)  
✅ In Server Actions (`'use server'`)  
✅ In API Route Handlers  
✅ Accessing auth state on initial page load  
✅ Protecting routes server-side  

---

## 📦 Required Dependencies

```bash
npm i @supabase/ssr @supabase/auth-helpers-nextjs
```

Already installed in your project! ✅

---

## 🚀 Quick Integration

### 1. Login Form (Client Component)

```tsx
'use client';

import { createClient } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.signInWithPassword({ email, password });
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### 2. Protected Page (Server Component)

```tsx
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Protected content for {user.email}</div>;
}
```

### 3. Protected API Route

```tsx
import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your protected logic here...
  return NextResponse.json({ success: true });
}
```

---

## ✅ Features

### Browser Client Features:
- ✅ Automatic cookie management
- ✅ Real-time auth state changes
- ✅ OAuth integration
- ✅ Magic link support
- ✅ Client-side session refresh

### Server Client Features:
- ✅ Cookie-based session storage
- ✅ Server-side auth validation
- ✅ Next.js 15 App Router compatible
- ✅ Server Action support
- ✅ API Route Handler support
- ✅ Works with middleware

---

## 📚 Additional Files Created

For a complete authentication system, we also created:

- **`/src/middleware.ts`** - Automatic session refresh
- **`/src/lib/auth-helpers.ts`** - Utility functions
- **`/src/components/auth/LoginForm.tsx`** - Example login form
- **`/src/components/auth/UserProfile.tsx`** - User profile widget
- **`/src/app/login/page.tsx`** - Login page
- **`/src/app/auth/callback/route.ts`** - OAuth callback handler

See `AUTH_SETUP_GUIDE.md` for complete documentation!

---

## 🎉 Ready to Use!

Your authentication is fully configured and ready to integrate into your Codev Media CMS! Both clients are working and share the same environment variables for seamless authentication across your entire application.

