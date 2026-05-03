# Alpha Pro MENA

Marketing site for Alpha Pro MENA — Vite + React SPA with a tRPC contact-form backend running on Vercel Serverless Functions and Neon Postgres.

## Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, wouter, framer-motion, shadcn/radix UI
- **Backend:** Vercel Edge Function exposing a tRPC router (`api/trpc/[trpc].ts`)
- **Database:** Neon Postgres via `@neondatabase/serverless` + Drizzle ORM
- **Email notifications:** Resend (optional)
- **CRM webhook:** generic POST endpoint (optional)

## Local development

```bash
cp .env.example .env
pnpm install
```

For frontend-only dev (no API):

```bash
pnpm dev
```

For full-stack dev (frontend + serverless functions):

```bash
pnpm i -g vercel   # one-time
vercel dev
```

## Database setup

1. Create a free project at [neon.tech](https://neon.tech) and copy the pooled connection string into `DATABASE_URL`.
2. Generate a migration and apply it:

```bash
pnpm db:generate
pnpm db:push
```

`db:push` is the fastest way to sync the schema in dev. For production, commit the generated migrations and run `drizzle-kit migrate` from CI/CD.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string. Required. |
| `RESEND_API_KEY` | Resend API key for email notifications. Optional — if absent, notifications log to console. |
| `NOTIFICATION_EMAIL_TO` | Recipient for contact-form notifications. Optional. |
| `NOTIFICATION_EMAIL_FROM` | Verified sender for Resend. Defaults to `onboarding@resend.dev`. |
| `DEPARTMENT_WEBHOOK_URL` | Optional CRM webhook fired on every contact submission. |
| `DEPARTMENT_WEBHOOK_TOKEN` | Optional bearer token sent with the webhook. |

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), click **New Project** and import the repo.
3. In **Project Settings → Environment Variables**, paste the values from your `.env`.
4. Click **Deploy**. Subsequent pushes to the configured branch redeploy automatically.

`vercel.json` already declares the framework and output directory, so Vercel needs no further config.

## Notes

- Tests were removed during the migration. Add new ones (e.g. via `vitest`) before relying on test runs in CI.
- The `users` table is kept in the schema as a placeholder for future auth, but no auth code currently exists.
