'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SETTINGS } from '@/lib/config';

export default function Navbar({ profile }) {
  const router = useRouter();
  async function logout() { await supabase.auth.signOut(); router.push('/'); }
  return (
    <nav className="print:hidden flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-fuchsia-600 via-orange-500 to-yellow-400 px-4 py-3 text-white shadow-lg">
      <Link href="/" className="text-xl font-extrabold">🌈 {SETTINGS.appName}</Link>
      {profile && (
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span>{profile.full_name} ({profile.campus_id})</span>
          <button onClick={logout} className="rounded-full bg-white px-4 py-1 font-bold text-fuchsia-700">Logout</button>
        </div>
      )}
    </nav>
  );
}
