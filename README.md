# 🌈 FixIt Campus – Electronic Issue Reporting System

Students and staff report campus problems (Computer, Projector, Fan, Light, Wi-Fi) with a description and photo.
The admin manages them and sees statistics. No AI key is needed.

## Features
- Colourful, mobile-friendly interface
- Separate Student, Staff and Admin logins using the campus-provided ID
- Complaint categories, description and photo upload
- Status: 🔴 Pending, 🟡 In Progress, 🟢 Resolved 😊
- Admin dashboard: filters, status buttons, remarks to complainer
- Complainer gives final feedback (😊 satisfied / 😞 not satisfied)
- Statistics as tables and graphs, plus a printable final report

## Tech
Next.js, Tailwind CSS, Supabase (database, login, photo storage), Recharts, Vercel.

## Setup
1. Create a free project at supabase.com.
2. In Supabase: SQL Editor → paste everything from `supabase.sql` → Run.
3. In Supabase: Authentication → Providers → Email → turn **OFF** "Confirm email".
4. Copy `.env.local.example` to `.env.local` and paste your Project URL and anon key (Project Settings → API).
5. Run `npm install` then `npm run dev` and open http://localhost:3000.

## Adding campus IDs
Supabase → Table Editor → `campus_ids` → Insert row (ID, name, type = student / staff / admin).
Users then press "First time here? Create password" on their login page.

## Customising
Edit `lib/config.js` to change the app name, categories, emojis and colours.

## Deploy
Push to GitHub, import the repo in Vercel, and add the same two environment variables.

## How this project was built
(Write here, in your own words, how you used AI tools to build it.)
