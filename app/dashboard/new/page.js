'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/lib/useProfile';
import { SETTINGS } from '@/lib/config';

export default function NewComplaint() {
  const profile = useProfile(false);
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!category) return setMsg('❌ Please choose a category first.');
    setBusy(true); setMsg('');
    let photo_url = null;
    if (file) {
      const path = `${profile.id}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const up = await supabase.storage.from('photos').upload(path, file);
      if (up.error) { setMsg('❌ Photo upload failed: ' + up.error.message); return setBusy(false); }
      photo_url = supabase.storage.from('photos').getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from('complaints').insert({
      category, location, description, photo_url,
      campus_id: profile.campus_id, full_name: profile.full_name, user_type: profile.role,
    });
    if (error) { setMsg('❌ ' + error.message); return setBusy(false); }
    router.push('/dashboard');
  }

  const input = 'w-full rounded-xl border-2 border-purple-300 px-4 py-3 text-lg focus:border-purple-600 focus:outline-none';
  return (
    <>
      <Navbar profile={profile} />
      <main className="mx-auto max-w-2xl p-4">
        <h1 className="text-3xl font-extrabold text-purple-800">What is the problem?</h1>
        <form onSubmit={submit} className="mt-4 space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SETTINGS.categories.map((c) => (
              <button type="button" key={c.key} onClick={() => setCategory(c.key)}
                className={`rounded-2xl bg-gradient-to-br ${c.color} p-4 text-lg font-extrabold text-white shadow-md ${category === c.key ? 'ring-4 ring-purple-700 scale-105' : 'opacity-80'}`}>
                <div className="text-4xl">{c.emoji}</div>{c.label}
              </button>
            ))}
          </div>
          <input className={input} placeholder="Where? (e.g. Room 12, Block B)" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <textarea className={input} rows={4} placeholder="Describe the problem" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <div>
            <label className="font-bold">📷 Add a picture (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="mt-1 block w-full" />
          </div>
          {msg && <p className="font-semibold text-red-600">{msg}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-purple-600 py-3 text-xl font-bold text-white disabled:opacity-50">{busy ? 'Sending...' : 'Send complaint 🚀'}</button>
        </form>
      </main>
    </>
  );
}
