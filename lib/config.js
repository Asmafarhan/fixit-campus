// ✏️ EASY SETTINGS FILE - change names, emojis and colours here.
export const SETTINGS = {
  appName: 'FixIt Campus',
  tagline: 'Report it. Track it. Get it fixed!',

  // Complaint categories (add or remove lines to change them)
  categories: [
    { key: 'computer',  label: 'Computer',  emoji: '💻', color: 'from-blue-400 to-indigo-500' },
    { key: 'projector', label: 'Projector', emoji: '📽️', color: 'from-purple-400 to-fuchsia-500' },
    { key: 'fan',       label: 'Fan',       emoji: '🌀', color: 'from-teal-400 to-emerald-500' },
    { key: 'light',     label: 'Light',     emoji: '💡', color: 'from-yellow-300 to-orange-400' },
    { key: 'wifi',      label: 'Wi-Fi',     emoji: '📶', color: 'from-pink-400 to-rose-500' },
  ],

  // Status colours: Pending = red, In Progress = yellow, Resolved = green
  statuses: {
    pending:     { label: 'Pending',     emoji: '🔴', hex: '#ef4444', cls: 'bg-red-500 text-white' },
    in_progress: { label: 'In Progress', emoji: '🟡', hex: '#eab308', cls: 'bg-yellow-400 text-black' },
    resolved:    { label: 'Resolved',    emoji: '😊', hex: '#22c55e', cls: 'bg-green-500 text-white' },
  },

  // The three login doors on the front page
  portals: [
    { role: 'student', label: 'Student Login', emoji: '🎓', color: 'from-pink-500 to-orange-400' },
    { role: 'staff',   label: 'Staff Login',   emoji: '🧑‍🏫', color: 'from-cyan-400 to-blue-600' },
    { role: 'admin',   label: 'Admin Login',   emoji: '🛠️', color: 'from-lime-400 to-green-600' },
  ],
};

export const catOf = (key) => SETTINGS.categories.find((c) => c.key === key) || { label: key, emoji: '❓' };
