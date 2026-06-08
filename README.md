# Yaftty — frontend-only copy

This folder is a **UI-only** snapshot of `w:\Yaftty\website`. It includes pages, views, components, styles, and client libraries — but **no** Next.js API routes, Express server, or Supabase migrations.

## Run locally

```powershell
cd W:\yafttyfront
copy env.example .env.local
# Set NEXT_PUBLIC_MAPBOX_TOKEN and Supabase keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend features

Calls to `/api/...` (bookings, chat, admin, uploads, etc.) require the full app at `w:\Yaftty\website`. Either:

- Run the full `website` project instead, or
- Run `website` on another port and set `NEXT_PUBLIC_API_URL` to that origin’s `/api` path (if your client code proxies there).

## Refresh from `website`

When the main site frontend changes, re-copy from `w:\Yaftty\website`:

```powershell
robocopy "w:\Yaftty\website" "W:\yafttyfront" /E /XD node_modules .next server .git /XF .env .env.local package-lock.json
# Then remove backend paths again:
Remove-Item "W:\yafttyfront\src\app\api","W:\yafttyfront\server","W:\yafttyfront\supabase","W:\yafttyfront\scripts" -Recurse -Force -ErrorAction SilentlyContinue
```

Restore this `package.json`, `env.example`, and `README.md` if overwritten.

## What is excluded

- `src/app/api/`
- `server/`
- `supabase/`
- `scripts/`
- Server-only npm packages (AWS SDK, nodemailer, `@supabase/ssr`, etc.)
