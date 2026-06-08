# Assignment Due Date Tracker

A modern shared assignment board for students to manage deadlines with realtime updates powered by Supabase.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- TanStack Query
- React Router
- shadcn/ui-style reusable components
- Lucide Icons
- Recharts
- Supabase Database + Realtime

## Features

- Shared dashboard with totals, pending/in-progress/completed, overdue, due today, and due this week
- Assignment CRUD with form validation
- Search, sorting, and filtering in assignment table
- Inline status updates with colored badges
- Overdue highlighting and overdue statistics
- Monthly calendar view with date/assignment drill-down
- Analytics charts (status, subject, monthly due trend)
- Realtime synchronization across connected clients
- Responsive sidebar/tablet/mobile layout

## Project Structure

```txt
src/
├── components/
├── pages/
├── hooks/
├── services/
├── lib/
├── types/
├── utils/
├── assets/
└── App.tsx
```

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `/supabase/schema.sql`.
3. In **Database > Replication**, confirm `assignments` is in the `supabase_realtime` publication.
4. In **Authentication > Providers**, keep default public anon usage (no login required in app).
5. Copy project URL + anon key into `.env`.

> **Important:** This app is intentionally configured as a shared public board for student projects.  
> Anyone with the anon key can read and modify assignment data.

## Run Locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Deployment

Deploy on Vercel/Netlify:

1. Import repository.
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables.
5. Deploy.
