'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/lib/useProfile';
import { SETTINGS } from '@/lib/config';

export default function Stats() {
  const profile = useProfile(true);
  const [list, setList] = useState([]);
  useEffect(() => {
    if (profile) supabase.from('complaints').select('*').then(({ data }) => setList(data || []));
  }, [profile]);

  const statuses = Object.entries(SETTINGS.statuses);
  const count = (fn) => list.filter(fn).length;
  const total = list.length;
  const resolved = count((c) => c.status === 'resolved');
  const happy = count((c) => c.satisfied === true);
  const unhappy = count((c) => c.satisfied === false);

  const pieData = statuses.map(([k, s]) => ({ name: s.label, value: count((c) => c.status === k), color: s.hex }));
  const barData = SETTINGS.categories.map((cat) => {
    const row = { name: cat.label };
    statuses.forEach(([k, s]) => (row[s.label] = count((c) => c.category === cat.key && c.status === k)));
    return row;
  });
  const th = 'border px-3 py-2 text-left';
  const td = 'border px-3 py-2';

  return (
    <>
      <Navbar profile={profile} />
      <main className="mx-auto max-w-4xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/admin" className="font-bold text-purple-700">← Back to complaints</Link>
          <button onClick={() => window.print()} className="rounded-full bg-purple-600 px-6 py-2 font-bold text-white">🖨️ Print / Save final report</button>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-purple-800">Final Report — {SETTINGS.appName}</h1>
        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>

        <p className="mt-4 rounded-2xl bg-yellow-100 p-4 text-lg">
          Total complaints: <b>{total}</b> · Resolved: <b>{resolved}</b> ({total ? Math.round((resolved / total) * 100) : 0}%) · Satisfied: <b>😊 {happy}</b> · Not satisfied: <b>😞 {unhappy}</b>
        </p>

        <h2 className="mt-6 text-2xl font-extrabold">Table: complaints by category</h2>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full bg-white">
            <thead><tr className="bg-purple-100"><th className={th}>Category</th>{statuses.map(([k, s]) => <th key={k} className={th}>{s.emoji} {s.label}</th>)}<th className={th}>Total</th></tr></thead>
            <tbody>
              {SETTINGS.categories.map((cat) => (
                <tr key={cat.key}>
                  <td className={td}>{cat.emoji} {cat.label}</td>
                  {statuses.map(([k]) => <td key={k} className={td}>{count((c) => c.category === cat.key && c.status === k)}</td>)}
                  <td className={`${td} font-bold`}>{count((c) => c.category === cat.key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-6 text-2xl font-extrabold">Table: students vs staff</h2>
        <table className="mt-2 w-full bg-white">
          <thead><tr className="bg-purple-100"><th className={th}>Who</th><th className={th}>Complaints</th><th className={th}>Resolved</th></tr></thead>
          <tbody>
            {['student', 'staff'].map((t) => (
              <tr key={t}><td className={td}>{t === 'student' ? '🎓 Students' : '🧑‍🏫 Staff'}</td><td className={td}>{count((c) => c.user_type === t)}</td><td className={td}>{count((c) => c.user_type === t && c.status === 'resolved')}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-6 text-2xl font-extrabold">Graphs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-72 rounded-2xl bg-white p-2 shadow">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" label>{pieData.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-72 rounded-2xl bg-white p-2 shadow">
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Legend />
                {statuses.map(([k, s]) => <Bar key={k} dataKey={s.label} stackId="a" fill={s.hex} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </>
  );
}
