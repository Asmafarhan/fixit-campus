'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/lib/useProfile';
import { SETTINGS, catOf } from '@/lib/config';

function AdminCard({ c, reload }) {
  const [remark, setRemark] = useState(c.admin_remark || '');
  async function setStatus(status) {
    const patch = { status };
    if (status !== 'resolved') { patch.satisfied = null; patch.user_remark = null; } // reopening clears old feedback
    await supabase.from('complaints').update(patch).eq('id', c.id);
    reload();
  }
  async function saveRemark() {
    await supabase.from('complaints').update({ admin_remark: remark }).eq('id', c.id);
    reload();
  }
  return (
    <div className="rounded-3xl bg-white p-5 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-extrabold">{catOf(c.category).emoji} {catOf(c.category).label} <span className="text-gray-400">#{c.id}</span></h2>
        <StatusBadge status={c.status} />
      </div>
      <p className="mt-1 text-sm text-gray-500">👤 {c.full_name} ({c.campus_id}, {c.user_type}) · 📍 {c.location} · {new Date(c.created_at).toLocaleDateString()}</p>
      <p className="mt-2">{c.description}</p>
      {c.photo_url && <a href={c.photo_url} target="_blank"><img src={c.photo_url} alt="complaint" className="mt-3 max-h-48 rounded-xl" /></a>}
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(SETTINGS.statuses).map(([key, s]) => (
          <button key={key} onClick={() => setStatus(key)} className={`rounded-full px-4 py-2 font-bold ${s.cls} ${c.status === key ? 'ring-4 ring-purple-600' : 'opacity-60'}`}>{s.emoji} {s.label}</button>
        ))}
      </div>
      <textarea className="mt-3 w-full rounded-xl border-2 border-blue-200 p-2" placeholder="Write a remark for the complainer" value={remark} onChange={(e) => setRemark(e.target.value)} />
      <button onClick={saveRemark} className="mt-1 rounded-full bg-blue-600 px-5 py-2 font-bold text-white">Save remark</button>
      {c.satisfied !== null && (
        <p className={`mt-3 rounded-xl p-3 font-bold ${c.satisfied ? 'bg-green-100' : 'bg-red-100'}`}>
          {c.satisfied ? '😊 Complainer is satisfied' : '😞 Complainer is NOT satisfied (click In Progress to reopen)'} {c.user_remark && `— “${c.user_remark}”`}
        </p>
      )}
    </div>
  );
}

export default function Admin() {
  const profile = useProfile(true);
  const [list, setList] = useState([]);
  const [fStatus, setFStatus] = useState('');
  const [fCat, setFCat] = useState('');
  const [fType, setFType] = useState('');

  async function load() {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    setList(data || []);
  }
  useEffect(() => { if (profile) load(); }, [profile]);

  const shown = list.filter((c) => (!fStatus || c.status === fStatus) && (!fCat || c.category === fCat) && (!fType || c.user_type === fType));
  const sel = 'rounded-xl border-2 border-purple-300 bg-white px-3 py-2 font-semibold';
  return (
    <>
      <Navbar profile={profile} />
      <main className="mx-auto max-w-4xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-purple-800">Admin Dashboard</h1>
          <Link href="/admin/stats" className="rounded-full bg-gradient-to-r from-lime-400 to-green-600 px-6 py-3 text-lg font-bold text-white shadow-lg">📊 Statistics & Report</Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <select className={sel} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
            <option value="">All statuses</option>
            {Object.entries(SETTINGS.statuses).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
          <select className={sel} value={fCat} onChange={(e) => setFCat(e.target.value)}>
            <option value="">All categories</option>
            {SETTINGS.categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <select className={sel} value={fType} onChange={(e) => setFType(e.target.value)}>
            <option value="">Students & Staff</option>
            <option value="student">Students only</option>
            <option value="staff">Staff only</option>
          </select>
        </div>
        <p className="mt-3 font-semibold text-gray-600">Showing {shown.length} of {list.length} complaints</p>
        <div className="mt-3 space-y-4">{shown.map((c) => <AdminCard key={c.id + c.status + (c.admin_remark || '')} c={c} reload={load} />)}</div>
      </main>
    </>
  );
}
