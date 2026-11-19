This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Name-change rates

Name-change newspaper rates live in `data/name-change-packages.json`.
`scripts/scraper.js` crawls the public rate pages, and `scripts/syncRates.js`
merges them into that file (and optionally MongoDB).

### 1. Crawl rates

```bash
npm run rates:scrape
# or, for a quick test:
node scripts/scraper.js --city=1,4 --delay=0 --verbose
```

The crawler discovers every `newspaper.php?city_id=N` link, fetches each city
page with a 1.5 s gap and a standard User-Agent, retries transient failures and
writes `scraped_rates.json` atomically. Useful flags:

| Flag | Meaning |
| --- | --- |
| `--out=FILE` | Output file (default `scraped_rates.json`) |
| `--delay=MS` | Gap between city pages (default `1500`) |
| `--city=1,4` | Crawl only these city IDs |
| `--max-cities=N` | Stop after N cities |
| `--strict` | Leave line fields null when the source hides them |
| `--base-lines=N` | Fallback included lines (default `5`) |
| `--extra-line-percent=N` | Fallback extra-line rate as % of base (default `20`) |
| `--extra-line-flat=RUPEES` | Fallback flat extra-line rate |

The target site publishes **flat per-ad rates only** — it has no public
per-line API, inline JS or data attribute that exposes an incremental line
charge. The crawler still scans page text, inline scripts and `data-*`
attributes for a real line rate and records it when found. Otherwise it derives
one with this documented policy:

```text
base_lines     = 5
extra_line_rate = round(base_rate × 20%)
```

Every row records `pricing_model` and `pricing_source` (`target_page`,
`derived_percent_of_base`, `derived_flat`, `unavailable`) plus a human-readable
`pricing_note`, so derived values are never mistaken for published ones.

### 2. Sync into the site

```bash
npm run rates:sync              # dry run: prints the diff
node scripts/syncRates.js --write
node scripts/syncRates.js --write --mongo   # + MongoDB `namechangerates`
```

Matching is normalised and case-insensitive. City labels are mapped
(`Delhi-NCR` → `Delhi`, `Gurgaon` → `Gurugram`, …) and package labels are
matched by slug set, normalised label and fuzzy score. New packages are created
only when every paper resolves to `data/newspapers.json`; unresolved papers are
reported and skipped. Duplicate publication labels on a city page are kept as
`editions[]` on the main package rather than overwriting it.

Useful flags: `--input=FILE`, `--packages=FILE`, `--newspapers=FILE`,
`--mongo`, `--verbose`, `--base-lines=N`, `--extra-line-percent=N`.

The sync also backfills hand-curated packages that are not in the crawl with
the same 5-line / 20% default, so every package has `baseLines` and
`extraLineRate`.

### 3. Pricing rule

`lib/name-change-pricing.ts` is the single source of truth used by both the
client preview and `app/api/create-order/route.ts`:

```ts
totalPrice = base_rate + Math.max(0, totalLines - base_lines) * extra_line_rate
```

`totalLines` comes from `countNameChangeLines()` in `lib/text-lines.ts`, which
greedily wraps the ad matter at 45 characters per line — the same wrap used by
the preview. When a package has no `extraLineRate`, the helper falls back to
20% of its rate so the preview and the server charge always agree.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
