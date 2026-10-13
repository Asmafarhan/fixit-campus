import Link from 'next/link';
import { SETTINGS } from '@/lib/config';

const RAINBOW = ['text-red-500', 'text-orange-500', 'text-yellow-400', 'text-green-500', 'text-cyan-500', 'text-blue-600', 'text-purple-600', 'text-pink-500'];

export default function Home() {
  const letters = SETTINGS.appName.split('');
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-sky-300 px-4 py-10">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-6xl font-extrabold drop-shadow-sm sm:text-8xl">
          {letters.map((ch, i) => <span key={i} className={RAINBOW[i % RAINBOW.length]}>{ch === ' ' ? '\u00A0' : ch}</span>)}
        </h1>
        <p className="mt-3 text-2xl font-semibold text-purple-900">{SETTINGS.tagline}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {SETTINGS.categories.map((c) => (
            <span key={c.key} className={`rounded-full bg-gradient-to-r ${c.color} px-5 py-2 text-lg font-bold text-white shadow-md`}>{c.emoji} {c.label}</span>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {SETTINGS.portals.map((p) => (
            <Link key={p.role} href={`/login/${p.role}`}
              className={`rounded-3xl bg-gradient-to-br ${p.color} p-8 text-white shadow-xl transition hover:scale-105 focus:outline focus:outline-4 focus:outline-purple-700`}>
              <div className="text-6xl">{p.emoji}</div>
              <div className="mt-3 text-2xl font-extrabold">{p.label}</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-white/80 p-6 text-left shadow-lg">
          <h2 className="text-2xl font-extrabold text-purple-800">How it works</h2>
          <p className="mt-2 text-lg">1️⃣ Log in with your campus ID. 2️⃣ Pick what is broken and describe it. 3️⃣ Watch the colour change:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {Object.values(SETTINGS.statuses).map((s) => (
              <span key={s.label} className={`rounded-full px-4 py-2 font-bold ${s.cls}`}>{s.emoji} {s.label}</span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
