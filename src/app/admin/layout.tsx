import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import UserProfile from '@/components/auth/UserProfile';
import SignOutButton from '@/components/auth/SignOutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user session
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo/Title */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                Codev Media
              </h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Admin
              </span>
            </div>

            {/* Right: User Profile + Sign Out */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <UserProfile />
              </div>
              <div className="sm:hidden">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Optional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-600">
            Logged in as <span className="font-medium">{user.email}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

