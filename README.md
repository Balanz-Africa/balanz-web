# Balanz — Web

The Balanz website and web app: the public marketing site, a browser-based user app (sign in, verify, dashboard), and a separate **admin console** for KYC review — all in one Vite build, talking to the Balanz backend API.

> Repository: `balanz-web`

## Two surfaces, one build

`src/main.tsx` picks the surface by path:

- **Public site + user app** (`src/App.tsx`) — everything not under `/admin`.
- **Admin console** (`src/admin/AdminApp.tsx`) — any path starting with `/admin`. It shares the site's API client and design tokens but keeps its own admin JWT session and no customer state.

Both talk to the backend (`Balanz-Africa/balanz-backend`) through the shared `request()` client in `src/lib/api.ts`, using a bearer token. No provider secrets live in the client.

## Routes

Public / user (`App.tsx`, history-based):

| Path | Screen |
| --- | --- |
| `/` | Landing page |
| `/download` | App download page |
| `/signin`, `/signup` | Auth |
| `/verify-email` | Email OTP verification |
| `/forgot-password`, `/reset-password` | Password reset |
| `/dashboard` | Signed-in user dashboard (wallet balance, etc.) |

Admin (`/admin`): login → dashboard → KYC document review (list, view, approve, reject) against the backend's `/admin/*` endpoints.

## Tech stack

- **React 19** + **TypeScript** on **Vite 7**
- **Tailwind CSS v4** (`@tailwindcss/vite`) + custom CSS in `src/index.css`
- **Framer Motion** (animation), **Lucide React** (icons)
- ESLint + Prettier

## Brand

Sky-blue palette, matching the mobile app and backend brand:

- **Primary**: `#0EA5E9` · lighter `#38BDF8` · darker `#0369A1` / `#0284C7`
- **Ink**: `#0B1220` · **tints**: `#F0F9FF`, `#EAF7FF`

## Project structure

```
src/
├── App.tsx              # Public site + user app (routing by screen)
├── main.tsx             # Entry: routes /admin → AdminApp, else App
├── components/          # Landing, auth, dashboard, download, site chrome
├── admin/               # AdminApp, AdminLogin, AdminDashboard, DocumentViewer, adminApi
├── lib/                 # api.ts (request client), routing.ts
├── types/               # shared types
├── assets/              # images
└── index.css            # global styles / tokens
```

## Setup

### Prerequisites

- Node.js 18+
- A running [balanz-backend](https://github.com/Balanz-Africa/balanz-backend) (local or deployed)

### Install & run

```bash
npm install
npm run dev        # http://localhost:5173  (admin at /admin)
```

### Environment

Create `.env` (or `.env.local`):

```env
# Backend API base — include the /api/v1 suffix
VITE_API_URL=http://localhost:4000/api/v1
```

Defaults to `http://localhost:4000/api/v1` when unset (`src/lib/api.ts`).

## Scripts

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run preview   # preview the production build
npm run lint      # ESLint
```

## License

Private — Balanz Africa.
