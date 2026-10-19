# 余白 · wenchao.io

Personal archive migrated from the previous WordPress site to Next.js.

## Content

- 13 public WordPress posts preserved at `/archives/{post_id}`
- 1 private post under `/private/`
- Private content is protected server-side using environment variables
- Private routes are excluded from robots/sitemap and served with no-store headers
- 58 WordPress media attachments are still pending migration

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `PRIVATE_PASSWORD` and `PRIVATE_COOKIE_SECRET` in `.env.local` locally and in Vercel Environment Variables for deployments.

## Deploy

Connect this repository to Vercel. Preview deployments are created for non-production branches/PRs; the production branch deploys production.
