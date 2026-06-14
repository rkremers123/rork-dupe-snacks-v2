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

The schema targets **Postgres** (the production database). For local dev you can
either point `DATABASE_URL` at any Postgres instance, or — for the quickest
start with no database to install — temporarily set the datasource `provider`
in `prisma/schema.prisma` to `"sqlite"` and use `DATABASE_URL="file:./dev.db"`.

```bash
npm install
cp .env.example .env        # then edit values
npm run db:push             # create tables from the schema
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

The schema already targets Postgres and `vercel.json` runs
`prisma migrate deploy` during every build, so the database schema is created
and kept in sync automatically. To go live:

1. Push this repo to GitHub and **import the project into Vercel**, setting the
   **Root Directory** to `web`.
2. Add a **Vercel Postgres** database to the project (Storage → Create →
   Postgres). Vercel injects `DATABASE_URL` automatically.
3. Add the remaining environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG` = `dupesnacks-20`
   - `ADMIN_PASSWORD` = a strong password
   - `ADMIN_SESSION_SECRET` = a long random string
4. Deploy. The build runs the migration and the tables are created.
5. (Optional) Load the sample catalog once, from your machine with the
   production `DATABASE_URL` exported:

   ```bash
   npm run db:seed
   ```

6. Add `dupesnacks.com` under the project's **Domains**.

Schema changes later: edit `prisma/schema.prisma`, run
`npx prisma migrate dev --name <change>` locally to create a migration, commit
it, and the next deploy applies it automatically.

## Future: Amazon Product Advertising API

Product data is entered manually today. When the Associates account qualifies
for PA-API access, a sync job can populate/refresh `imageUrl`, `price`,
`rating`, and `asin` — every outbound link already flows through
`amazonAffiliateUrl()`, so only the data source changes.
