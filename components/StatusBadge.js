import { SETTINGS } from '@/lib/config';
export default function StatusBadge({ status }) {
  const s = SETTINGS.statuses[status] || SETTINGS.statuses.pending;
  return <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${s.cls}`}>{s.emoji} {s.label}</span>;
}
