# Markd — Smart Bookmark Manager

A private, real-time bookmark manager built with **Next.js 14 (App Router)**, **Supabase**, and **Tailwind CSS**. Sign in with Google, save bookmarks, and watch them sync live across all your open tabs.

---

## Features

- **Google OAuth only** — no email/password signup
- **Private bookmarks** — each user sees only their own (enforced via Supabase Row Level Security)
- **Real-time sync** — Supabase Realtime pushes changes across all open tabs instantly
- **Optimistic UI** — bookmarks appear/disappear immediately without waiting for the server
- **Two-click delete** — confirm before deleting (prevents accidents)
- **Favicon detection** — pulls site icons automatically

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase Postgres |
| Realtime | Supabase Realtime (Postgres CDC) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Setup Instructions

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd smart-bookmarks
npm install
```

### Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**, give it a name (e.g. `smart-bookmarks`), and create it
3. Wait ~1 minute for the project to be ready

### Step 3: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql` and paste it into the editor
3. Click **Run** — this creates:
   - The `bookmarks` table
   - Row Level Security (RLS) policies (enforces user data isolation)
   - A Realtime publication (enables live sync)

### Step 4: Configure Google OAuth

1. In Supabase dashboard, go to **Authentication → Providers**
2. Find **Google** and toggle it **on**
3. You'll need to create a Google OAuth app:

   **Create Google OAuth credentials:**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Navigate to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Add Authorized redirect URIs:
     - For Supabase: `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`
     - For local dev: `http://localhost:3000/auth/callback`
     - For production: `https://<YOUR_VERCEL_DOMAIN>/auth/callback`
   - Copy the **Client ID** and **Client Secret**

4. Paste the Google Client ID and Secret into Supabase's Google provider settings
5. Save changes

### Step 5: Set Up Environment Variables

Create a `.env.local` file in the root:

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

You can find these in Supabase: **Project Settings → API**

### Step 6: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## Deploy to Vercel

### Option A: Deploy via GitHub

1. Push your code to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. In the Vercel dashboard, add these **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Option B: Deploy via CLI

```bash
npm install -g vercel
vercel --prod
```

Follow the prompts. Add the environment variables when asked.

### Post-Deploy: Update OAuth Redirect URLs

After getting your Vercel URL (e.g. `https://smart-bookmarks.vercel.app`):

1. In **Google Cloud Console → Credentials**, add:
   `https://smart-bookmarks.vercel.app/auth/callback`
2. In **Supabase → Authentication → URL Configuration**, add:
   - Site URL: `https://smart-bookmarks.vercel.app`
   - Redirect URLs: `https://smart-bookmarks.vercel.app/auth/callback`

---

## Project Structure

```
smart-bookmarks/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirects to /login or /dashboard
│   ├── globals.css             # Global styles + Tailwind
│   ├── login/
│   │   └── page.tsx            # Login page (server component)
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard (server component, fetches initial data)
│   └── auth/
│       └── callback/
│           └── route.ts        # OAuth callback handler
├── components/
│   ├── BookmarkManager.tsx     # Main client component (realtime, state)
│   ├── AddBookmarkForm.tsx     # Add bookmark form
│   ├── BookmarkCard.tsx        # Individual bookmark with delete
│   ├── LoginButton.tsx         # Google OAuth trigger button
│   └── UserMenu.tsx            # User dropdown with sign out
├── lib/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       ├── server.ts           # Server Supabase client
│       └── middleware.ts       # Middleware Supabase client
├── middleware.ts               # Route protection
├── supabase/
│   └── schema.sql              # Database schema + RLS policies
├── .env.local.example          # Environment variable template
└── README.md
```

---

## How Real-time Works

1. When the dashboard loads, it subscribes to a Supabase channel filtered to the current user's `user_id`
2. Any `INSERT` or `DELETE` on the `bookmarks` table triggers a message via Supabase Realtime (Postgres CDC)
3. The React state is updated immediately — no page refresh needed
4. Optimistic updates ensure the UI feels instant even before the server confirms

---

## Security

- **Row Level Security (RLS)** is enabled on the `bookmarks` table
- Users can only `SELECT`, `INSERT`, and `DELETE` rows where `user_id = auth.uid()`
- Even if someone had a valid session token, they cannot read or modify another user's bookmarks at the database level
- Middleware (`middleware.ts`) redirects unauthenticated requests to `/login`

---

## Troubleshooting

**"Realtime not working"**
- Make sure you ran the `ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;` SQL command
- Check the browser console for Supabase channel subscription errors

**"Google OAuth redirect error"**  
- Verify the redirect URL in Google Cloud Console matches exactly: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`

**"Users can see each other's bookmarks"**
- Confirm RLS is enabled: in Supabase SQL Editor, run `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bookmarks';`
- The `rowsecurity` column should be `true`
