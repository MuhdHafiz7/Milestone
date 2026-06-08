# Assignment Due Date Tracker

A modern shared assignment board for students to manage deadlines with realtime updates powered by Nhost.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- TanStack Query
- React Router
- shadcn/ui-style reusable components
- Lucide Icons
- Recharts
- Nhost (PostgreSQL + Hasura GraphQL + Realtime)
- vite-plugin-pwa (for turning the app into an installable Progressive Web App)

## PWA Requirements

Configure the application as a fully installable Progressive Web App using `vite-plugin-pwa`:

- Create a `manifest.webmanifest` or configure it inside `vite.config.ts`.
- Set `display: "standalone"` so it opens in its own window without browser UI.
- Set `orientation: "portrait"` for optimal mobile viewing.
- Provide a standard app icon configuration (include placeholder icons for 192x192 and 512x512 sizes).
- Set the `theme_color` to match the Indigo primary color (#4f46e5) and `background_color` to match the Slate background.
- Implement standard Service Worker registration code in `main.tsx` to handle automatic updates.

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

- `VITE_NHOST_SUBDOMAIN`
- `VITE_NHOST_REGION` (optional, not needed for local development)

## Nhost Setup

1. Create a Nhost project at [nhost.io](https://nhost.io).
2. Run `/nhost/schema.sql` against the PostgreSQL database (via Nhost's **SQL** tab in the Dashboard or using the Hasura Console).
3. In the **Hasura Console**, set the **public** role permissions on the `assignments` table to allow `select`, `insert`, `update`, and `delete` (this app has no authentication — it's a shared public board).
4. Copy your Nhost subdomain and region into `.env`:

   ```env
   VITE_NHOST_SUBDOMAIN=your-subdomain
   VITE_NHOST_REGION=your-region
   ```
   During local development with the Nhost CLI, use `VITE_NHOST_SUBDOMAIN=local` (no region required).

> **Important:** This app is intentionally configured as a shared public board for student projects.  
> Anyone with the backend URL can read and modify assignment data.

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
4. Add `VITE_NHOST_SUBDOMAIN` and `VITE_NHOST_REGION` environment variables.
5. Deploy.

## Deliverables

1-13. _(Existing deliverables from the project specification)_

14. PWA configuration (`vite.config.ts` setup and web manifest)
15. Instructions on how users can install the app on iOS (via Share -> Add to Home Screen) and Android/Chrome (via the install prompt).
