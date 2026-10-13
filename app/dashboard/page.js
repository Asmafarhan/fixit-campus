'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/lib/useProfile';
import { catOf } from '@/lib/config';

// Box shown after a complaint is Resolved: "Are you satisfied?"
function Feedback({ c, onSave }) {
  const [remark, setRemark] = useState('');
  return (
    <div className="mt-3 rounded-2xl bg-green-50 p-4">
      <p className="font-bold text-green-800">Your complaint is resolved! Are you satisfied?</p>
      <textarea className="mt-2 w-full rounded-xl border-2 border-green-300 p-2" placeholder="Write a short remark (optional)" value={remark} onChange={(e) => setRemark(e.target.value)} />
      <div className="mt-2 flex gap-3">
        <button onClick={() => onSave(c.id, true, remark)} className="rounded-full bg-green-500 px-5 py-2 font-bold text-white">😊 Satisfied</button>
        <button onClick={() => onSave(c.id, false, remark)} className="rounded-full bg-red-500 px-5 py-2 font-bold text-white">😞 Not satisfied</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const profile = useProfile(false);
  const [list, setList] = useState([]);

  async function load() {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    setList(data || []);
  }
  useEffect(() => { if (profile) load(); }, [profile]);

  async function saveFeedback(id, satisfied, remark) {
    await supabase.from('complaints').update({ satisfied, user_remark: remark }).eq('id', id);
    load();
  }

  return (
    <>
      <Navbar profile={profile} />
      <main className="mx-auto max-w-3xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-purple-800">My Complaints</h1>
          <Link href="/dashboard/new" className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-3 text-lg font-bold text-white shadow-lg">➕ New complaint</Link>
        </div>
        {list.length === 0 && <p className="mt-8 text-center text-xl text-gray-600">No complaints yet. Tap “New complaint” to report a problem. 🎉</p>}
        <div className="mt-6 space-y-4">
          {list.map((c) => (
            <div key={c.id} className="rounded-3xl bg-white p-5 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-extrabold">{catOf(c.category).emoji} {catOf(c.category).label} <span className="text-gray-400">#{c.id}</span></h2>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-1 text-sm text-gray-500">📍 {c.location} · {new Date(c.created_at).toLocaleDateString()}</p>
              <p className="mt-2">{c.description}</p>
              {c.photo_url && <img src={c.photo_url} alt="complaint" className="mt-3 max-h-60 rounded-xl" />}
              {c.admin_remark && <p className="mt-3 rounded-xl bg-blue-50 p-3"><b>Admin says:</b> {c.admin_remark}</p>}
              {c.status === 'resolved' && c.satisfied === null && <Feedback c={c} onSave={saveFeedback} />}
              {c.satisfied !== null && <p className="mt-3 font-bold">{c.satisfied ? '😊 You said: Satisfied' : '😞 You said: Not satisfied'} {c.user_remark && `— ${c.user_remark}`}</p>}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
