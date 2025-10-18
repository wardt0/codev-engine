# Supabase Authentication Setup Guide

## 🔐 Overview

This guide explains how to use Supabase authentication in your Codev Media CMS built with Next.js 15 App Router.

---

## 📁 Files Created

### Core Authentication Files

1. **`/src/lib/supabaseClient.ts`** - Browser client for client components
2. **`/src/lib/supabaseServer.ts`** - Server client for server components/actions
3. **`/src/middleware.ts`** - Session refresh middleware
4. **`/src/lib/auth-helpers.ts`** - Server-side auth utility functions

### Example Components & Pages

5. **`/src/components/auth/LoginForm.tsx`** - Login/signup form component
6. **`/src/components/auth/UserProfile.tsx`** - User profile display
7. **`/src/app/login/page.tsx`** - Login page
8. **`/src/app/auth/callback/route.ts`** - OAuth callback handler

---

## 🔑 Environment Variables

Both clients use these shared environment variables (already configured):

```env
NEXT_PUBLIC_SUPABASE_URL=https://exzhyofcaiklkghfnbdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 📖 Usage Guide

### 1. Client-Side Authentication (Client Components)

Use `supabaseClient.ts` in components with `'use client'` directive:

```tsx
'use client';

import { createClient } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Sign in
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return <div>{user ? user.email : 'Not logged in'}</div>;
}
```

### 2. Server-Side Authentication (Server Components)

Use `supabaseServer.ts` in Server Components:

```tsx
import { createClient } from '@/lib/supabaseServer';

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.email}!</div>;
}
```

### 3. Server Actions

Use in Server Actions:

```tsx
'use server';

import { createClient } from '@/lib/supabaseServer';

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Create post...
}
```

### 4. Route Handlers (API Routes)

Use in API routes:

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

### 5. Using Auth Helper Functions

The `auth-helpers.ts` file provides convenient functions:

```tsx
import { getCurrentUser, requireAuth, isAuthenticated } from '@/lib/auth-helpers';

// In a Server Component
export default async function ProtectedPage() {
  const user = await getCurrentUser(); // Returns user or null
  
  if (!user) {
    redirect('/login');
  }

  return <div>Protected content</div>;
}

// In a Server Action
export async function protectedAction() {
  'use server';
  
  const user = await requireAuth(); // Throws error if not authenticated
  // Continue with authenticated logic...
}

// Check authentication status
export default async function Header() {
  const authenticated = await isAuthenticated(); // Returns boolean
  
  return (
    <div>
      {authenticated ? 'Logged in' : 'Logged out'}
    </div>
  );
}
```

---

## 🔒 Protecting Routes with Middleware

The middleware automatically refreshes sessions. To protect routes, uncomment the protection logic in `/src/middleware.ts`:

```typescript
// Protect admin routes
if (!user && request.nextUrl.pathname.startsWith('/admin')) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}
```

---

## 🎨 Example Pages

### Login Page

Visit: `http://localhost:3001/login`

Features:
- Email/password sign in
- Email/password sign up
- Error handling
- Success messages

### User Profile Component

Add to your layout or navbar:

```tsx
import UserProfile from '@/components/auth/UserProfile';

export default function Layout({ children }) {
  return (
    <div>
      <nav>
        <UserProfile />
      </nav>
      {children}
    </div>
  );
}
```

---

## 🚀 Supabase Dashboard Setup

### 1. Enable Email Authentication

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Configure email templates (optional)

### 2. Create Test User

Option A: Via Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password

Option B: Via Sign Up Form
1. Visit `/login` in your app
2. Click "Sign Up"
3. Check email for confirmation link

### 3. Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### 4. Set Up OAuth Providers (Optional)

Enable GitHub, Google, etc.:
1. Go to **Authentication** → **Providers**
2. Enable desired provider
3. Add OAuth credentials
4. Update callback URL: `http://localhost:3001/auth/callback`

---

## 📝 Common Authentication Methods

### Sign In with Email/Password

```tsx
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### Sign Up with Email/Password

```tsx
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    emailRedirectTo: 'http://localhost:3001/auth/callback',
  },
});
```

### Sign In with Magic Link

```tsx
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'http://localhost:3001/auth/callback',
  },
});
```

### Sign In with OAuth (GitHub, Google, etc.)

```tsx
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: 'http://localhost:3001/auth/callback',
  },
});
```

### Sign Out

```tsx
const { error } = await supabase.auth.signOut();
```

### Get Current User

```tsx
const { data: { user } } = await supabase.auth.getUser();
```

### Get Current Session

```tsx
const { data: { session } } = await supabase.auth.getSession();
```

---

## 🔐 Protecting Admin Routes

### Example: Protected Admin Page

```tsx
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  );
}
```

### Example: Protected API Route

```tsx
import { requireAuth } from '@/lib/auth-helpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    
    // Process authenticated request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

---

## 🛠️ Integration with Existing CMS

### Protect Post Creation

Update `/src/app/admin/posts/new/page.tsx`:

```tsx
import { getCurrentUser } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Rest of your component...
}
```

### Protect API Routes

Update `/src/app/api/posts/route.ts`:

```tsx
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    await requireAuth(); // Verify authentication
    
    // Existing post creation logic...
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
}
```

---

## 🧪 Testing Authentication

### 1. Create a Test User

```bash
# Via Supabase Dashboard
# Or sign up at http://localhost:3001/login
```

### 2. Test Login Flow

1. Visit `http://localhost:3001/login`
2. Enter credentials
3. Click "Sign In"
4. Should redirect to `/admin/posts/new`

### 3. Test Sign Out

1. Add `<UserProfile />` component to a page
2. Click "Sign Out"
3. Session should be cleared

### 4. Test Protected Routes

1. Enable route protection in middleware
2. Try accessing `/admin` without auth
3. Should redirect to `/login`

---

## 📊 Session Management

### How Sessions Work

1. **Browser**: Sessions stored in cookies automatically
2. **Server**: Middleware refreshes session on each request
3. **Expiration**: Sessions auto-refresh before expiring
4. **Persistence**: Users stay logged in across page reloads

### Session Duration

Default: 1 hour (auto-refreshed)

To customize, configure in Supabase Dashboard:
- **Authentication** → **Settings**
- Adjust JWT expiry time

---

## 🔍 Debugging

### Check User State

```tsx
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### Check Session

```tsx
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);
```

### Check Cookies

Browser DevTools → Application → Cookies → Look for:
- `sb-<project-ref>-auth-token`

---

## 🚨 Common Issues & Solutions

### Issue: "Missing environment variables"

**Solution:** Ensure `.env.local` has both:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Issue: "User logged out randomly"

**Solution:** 
1. Check middleware is properly configured
2. Ensure you're returning the correct response from middleware
3. Don't modify cookies between `createServerClient` and `getUser`

### Issue: "OAuth redirect not working"

**Solution:**
1. Add callback URL to Supabase Dashboard:
   - **Authentication** → **URL Configuration**
   - Add: `http://localhost:3001/auth/callback`

### Issue: "Session not persisting"

**Solution:**
1. Verify middleware is running
2. Check middleware matcher config
3. Ensure cookies are not blocked by browser

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [@supabase/ssr Package](https://github.com/supabase/auth-helpers)

---

## ✅ Quick Start Checklist

- [x] Install packages (`@supabase/ssr`, `@supabase/auth-helpers-nextjs`)
- [x] Create `supabaseClient.ts` (browser client)
- [x] Create `supabaseServer.ts` (server client)
- [x] Create `middleware.ts` (session refresh)
- [x] Create `auth-helpers.ts` (utility functions)
- [x] Add environment variables to `.env.local`
- [ ] Enable Email Auth in Supabase Dashboard
- [ ] Create test user
- [ ] Test login flow at `/login`
- [ ] Protect admin routes (uncomment middleware code)
- [ ] Test protected routes

---

**Authentication is now fully configured and ready to use!** 🎉

