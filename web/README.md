# DupeSnacks — Web

Affiliate ecommerce site for gluten-free "dupes" of popular snacks. Built with
**Next.js (App Router)**, **Prisma**, and **Tailwind CSS**.

## Features

- **Hybrid catalog** — browse by category, full-text search, sort (Popular / Top
  Rated / Price), and filter by allergen / price / GF-certified.
- **Dupe mappings** — every product can be tagged as the gluten-free dupe of a
  mainstream snack (e.g. _Goldfish → Annie's Cheddar Bunnies_).
- **Collections** — curated groupings (e.g. Lunchbox Favorites, Holiday) for
  seasonal merchandising.
- **Product pages** — image, price, rating, allergen badges, GF-certified badge,
  description, related products, and Product JSON-LD for SEO.
- **Affiliate links** — every "Buy on Amazon" link is built through
  `src/lib/affiliate.ts` and carries the Associates tag (`dupesnacks-20`).
- **Admin dashboard** — password-protected `/admin` to add/edit/delete products,
  set dupe mappings, allergens, and featured/collection placement.
- **SEO** — sitemap, robots, per-page metadata.

## Local development

```bash
npm install
cp .env.example .env        # then edit values
npm run db:push             # create the SQLite dev database
npm run db:seed             # load sample categories + dupes
npm run dev
```

Visit http://localhost:3000. The admin lives at `/admin` (password from
`ADMIN_PASSWORD`).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | DB connection. Dev: `file:./dev.db` (SQLite). Prod: Vercel Postgres URL. |
| `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG` | Amazon Associates tag appended to every product link. |
| `ADMIN_PASSWORD` | Password for the `/admin` dashboard. |
| `ADMIN_SESSION_SECRET` | Random string used to sign the admin session cookie. |

## Deploying to Vercel + Vercel Postgres

The app is developed against SQLite locally and is **Postgres-ready**. To go live:

1. Push this repo to GitHub and import the `web/` directory as a Vercel project
   (set the project root to `web`).
2. Add a **Vercel Postgres** database to the project. Vercel injects
   `DATABASE_URL` automatically.
3. In `prisma/schema.prisma`, change the datasource provider from `sqlite` to
   `postgresql` (the `url = env("DATABASE_URL")` line stays the same).
4. Set the remaining env vars (`NEXT_PUBLIC_AMAZON_AFFILIATE_TAG`,
   `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) in the Vercel dashboard.
5. Run the initial schema push + seed against the production database:

   ```bash
   npx prisma db push
   npm run db:seed     # optional: load sample data
   ```

6. Deploy, then point `dupesnacks.com` at the Vercel project.

## Future: Amazon Product Advertising API

Product data is entered manually today. When the Associates account qualifies
for PA-API access, a sync job can populate/refresh `imageUrl`, `price`,
`rating`, and `asin` — every outbound link already flows through
`amazonAffiliateUrl()`, so only the data source changes.
