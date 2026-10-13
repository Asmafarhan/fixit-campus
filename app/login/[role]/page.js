'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, toEmail } from '@/lib/supabase';
import { SETTINGS } from '@/lib/config';

export default function Login({ params }) {
  const portal = SETTINGS.portals.find((p) => p.role === params.role);
  const router = useRouter();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [signup, setSignup] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  if (!portal) return <p className="p-8">Page not found.</p>;

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg('');
    const email = toEmail(id);
    const res = signup
      ? await supabase.auth.signUp({ email, password: pw, options: { data: { campus_id: id.trim().toUpperCase() } } })
      : await supabase.auth.signInWithPassword({ email, password: pw });
    if (res.error) {
      const notReg = res.error.message.includes('Database error');
      setMsg(notReg ? '❌ This Campus ID is not registered. Please ask the admin to add it.' : '❌ ' + res.error.message);
      return setBusy(false);
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== params.role) {
      await supabase.auth.signOut();
      setMsg(`❌ This ID is not a ${params.role} ID. Please use the correct login.`);
      return setBusy(false);
    }
    router.push(params.role === 'admin' ? '/admin' : '/dashboard');
  }

  const input = 'w-full rounded-xl border-2 border-purple-300 px-4 py-3 text-lg focus:border-purple-600 focus:outline-none';
  return (
    <main className={`flex min-h-screen items-center justify-center bg-gradient-to-br ${portal.color} p-4`}>
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center text-6xl">{portal.emoji}</div>
        <h1 className="text-center text-3xl font-extrabold text-purple-800">{portal.label}</h1>
        <p className="text-center text-gray-600">{signup ? 'Create your password (first time only)' : 'Enter your campus ID and password'}</p>
        <input className={input} placeholder="Campus ID (e.g. STU001)" value={id} onChange={(e) => setId(e.target.value)} required />
        <input className={input} type="password" placeholder="Password (min 6 characters)" value={pw} onChange={(e) => setPw(e.target.value)} minLength={6} required />
        {msg && <p className="font-semibold text-red-600">{msg}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-purple-600 py-3 text-xl font-bold text-white hover:bg-purple-700 disabled:opacity-50">
          {busy ? 'Please wait...' : signup ? 'Create account' : 'Log in'}
        </button>
        <button type="button" onClick={() => setSignup(!signup)} className="w-full text-purple-700 underline">
          {signup ? 'I already have a password' : 'First time here? Create password'}
        </button>
        <Link href="/" className="block text-center text-gray-500">← Back to home</Link>
      </form>
    </main>
  );
}
