# BiteKaro 🍛

A mood-based food ordering platform built on a "circular economy" model — vendors keep 88% of every order (12% commission, not the industry-standard 30%), customers earn Karo Points for every rupee spent and bonus points for bringing their own tiffin (BYOT), and home cooks earn ongoing royalties when restaurants put their recipes on the menu.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Prisma 7** + SQLite (via `@prisma/adapter-libsql`)
- **NextAuth** (credentials provider, JWT sessions)
- **Zustand** for persisted cart state
- **Tailwind CSS** + hand-rolled CSS for the 3D thali hero / tiffin-stack visuals

## Getting started

Install dependencies:

```bash
npm install
```

Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Seed the database with demo restaurants, menu items, recipes and users:

```bash
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

All seeded accounts use the password `demo1234`.

| Role | Email |
|---|---|
| Customer (Bloom tier, 620 Karo Points) | `priya@bitekaro.in` |
| Vendor — Dabbawala Kitchen | `ravi@dabbawala.in` |
| Vendor — Spice Route | `anita@spiceroute.in` |
| Vendor — Green Leaf Bistro | `arjun@greenleaf.in` |
| Rider | `rider@bitekaro.in` |

### Resetting the database

```bash
npm run db:reset
```

This wipes `prisma/dev.db`, re-runs migrations, and reseeds demo data. **Do not run this against a production database.**

## Core features

- **Mood Menu** — pick a mood (Stressed, Heartbroken, Celebrating, Lazy Sunday, Homesick, Adventurous) and the menu filters live across all restaurants.
- **Karo Circle loyalty** — points = `floor(orderTotal / 10) × tierMultiplier`, with tiers Sprout (0–500) → Bloom (501–1500) → Harvest (1501–4000) → Legacy (4000+), visualized as a stacked tiffin carrier.
- **BYOT (Bring Your Own Tiffin)** — ₹15 discount at checkout plus a Karo Points bonus.
- **Recipe Royalty** — submit a recipe, any vendor or admin can approve it, and once it's linked to a menu item the original cook earns a royalty on every order placed.
- **Order tracking** — simulated Placed → Preparing → Out for Delivery → Delivered progression.
- **Vendor dashboard** — menu CRUD with mood tagging, order list, pending recipe review, and a live 12% vs 30% commission comparison.
- **Rider view** — signup and a mocked delivery list.

## Project structure

- `prisma/schema.prisma` — data models (User, Restaurant, MenuItem, Order, Recipe, LoyaltyTransaction)
- `prisma/seed.ts` — demo data seed script
- `src/lib/` — Prisma client, NextAuth config, tier/points logic, cart store
- `src/app/api/` — REST API routes
- `src/app/` — pages (mood picker, restaurants/menu, cart, checkout, orders, Karo Circle, recipe royalty, vendor, rider, profile)
- `src/components/` — shared UI (navbar, hero, menu cards, tiffin stack, cart sidebar, order status tracker)
