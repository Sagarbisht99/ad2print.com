#!/usr/bin/env node
"use strict";
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Sync `scraped_rates.json` into the site's rate store.
 *
 * This project keeps its live name-change packages in
 * `data/name-change-packages.json` (not a SQL table), so that file is the
 * primary target. Pass `--mongo` to also upsert the same rows into a
 * `namechangerates` MongoDB collection using the schema defined below.
 *
 * Matching rules
 * - City names are normalised and mapped through CITY_ALIASES
 *   (Delhi-NCR -> Delhi, Gurgaon -> Gurugram, Vishaka Patnam -> Visakhapatnam…).
 * - Existing packages are matched by slug set, then normalised label, then a
 *   fuzzy label score, so rates update instead of duplicating rows.
 * - New packages are created only when every paper in a `+` combo resolves to
 *   a newspaper already present in `data/newspapers.json`.
 *
 * Usage
 *   node scripts/syncRates.js                       # dry run, prints diff
 *   node scripts/syncRates.js --write               # write JSON store
 *   node scripts/syncRates.js --write --mongo       # JSON + MongoDB
 *   node scripts/syncRates.js --input=scraped_rates.json --verbose
 */

const fs = require("fs");
const path = require("path");
const {
  atomicWriteJson,
  compactKey,
  loadEnv,
  normalizeKey,
  parseArgs,
  similarity,
} = require("./lib/common");

const DEFAULTS = {
  input: "scraped_rates.json",
  packages: "data/name-change-packages.json",
  newspapers: "data/newspapers.json",
  baseLines: 5,
  extraLinePercent: 20,
};

/** Target city labels that differ from the site's city names. */
const CITY_ALIASES = {
  "delhi ncr": "Delhi",
  delhi: "Delhi",
  bangalore: "Bangalore",
  bengaluru: "Bangalore",
  gurgaon: "Gurugram",
  gurugram: "Gurugram",
  "vishaka patnam": "Visakhapatnam",
  visakhapatnam: "Visakhapatnam",
  bhaglpur: "Bhagalpur",
  bhagalpur: "Bhagalpur",
  vijaywada: "Vijayawada",
  vijayawada: "Vijayawada",
  mangalore: "Mangalore",
  mysore: "Mysore",
  belgaum: "Belgaum",
  ahmednagar: "Ahmednagar",
  nashik: "Nashik",
  coimbatore: "Coimbatore",
  chandigarh: "Chandigarh",
  amritsar: "Amritsar",
  ludhiana: "Ludhiana",
  patna: "Patna",
  surat: "Surat",
  lucknow: "Lucknow",
  indore: "Indore",
  bhopal: "Bhopal",
  kanpur: "Kanpur",
  guntur: "Guntur",
  ranchi: "Ranchi",
  jamshedpur: "Jamshedpur",
  meerut: "Meerut",
  varanasi: "Varanasi",
  gaya: "Gaya",
  muzaffarpur: "Muzaffarpur",
  agra: "Agra",
  thrissur: "Thrissur",
  chennai: "Chennai",
  hyderabad: "Hyderabad",
  kolkata: "Kolkata",
  pune: "Pune",
  nagpur: "Nagpur",
  ahmedabad: "Ahmedabad",
  jaipur: "Jaipur",
  mumbai: "Mumbai",
};

/** Common target spellings / edition labels that the fuzzy matcher cannot win. */
const NEWSPAPER_ALIASES = {
  "econimic times": "economic-times",
  "economics times": "economic-times",
  "economic times": "economic-times",
  "the times of india": "times-of-india",
  "times of india": "times-of-india",
  "the hindu": "the-hindu",
  hindu: "the-hindu",
  "hindustan hindi": "hindustan",
  hindustan: "hindustan",
  "hindustan times": "hindustan-times",
  "the savera times": "the-savera-times",
  "savera times": "the-savera-times",
  "dainik savera times": "dainik-savera-times",
  mirror: "mirror",
  "pune mirror": "mirror",
  "mumbai mirror": "mirror",
  "bangalore mirror": "mirror",
  "bengaluru mirror": "mirror",
  "rajsthan patrika": "rajasthan-patrika",
  "rajasthan patrika": "rajasthan-patrika",
  "nav bharat": "navbharat-times",
  navbharat: "navbharat-times",
  "navbharat times": "navbharat-times",
  "nav gujarat samay": "nav-gujarat-samay",
  "namaste telangana": "namaste-telangana",
  "telangana today": "telangana-today",
  "the siasat daily": "the-siasat-daily",
  "siasat daily": "the-siasat-daily",
  "business line": "business-line",
  "hans india": "hans-india",
  punyanagri: "punyanagari",
  punyanagari: "punyanagari",
  "punnya nagari": "punyanagari",
  "maharashtra times": "maharashtra-times",
  "indian express": "indian-express",
  "the indian express": "indian-express",
  "deccan chronicle": "deccan-chronicle",
  "deccan herald": "deccan-herald",
  "andhra prabha": "andhra-prabha",
  "adhra jyoti": "andhra-jyothi",
  "andhra jyothi": "andhra-jyothi",
  enadu: "eenadu",
  "vijay karnataka": "vijay-karnataka",
  "dainik jagaran": "dainik-jagran",
  "dainik jagran": "dainik-jagran",
  "amar ujala": "amar-ujala",
  "punjab kesari": "punjab-kesari",
  "dainik tribune": "dainik-tribune",
  "punjabi tribune": "punjabi-tribune",
  loksatta: "loksatta",
  lokmat: "lokmat",
  pudhari: "pudhari",
  sakal: "sakal",
  "active times": "active-times",
  "mumbai lakshdeep": "mumbai-lakshdeep",
  "nav shakti": "nav-shakti",
  "free press journal": "free-press-journal",
  "rashtriya sahara": "rashtriya-sahara",
  "prabhat khabar": "prabhat-khabar",
  "the samaj": "the-samaj",
  "nava bharat": "nava-bharat",
  eenadu: "eenadu",
  sakshi: "sakshi",
  dinakaran: "dinakaran",
  prajavani: "prajavani",
  dinamalar: "dinamalar",
  dinamani: "dinamani",
};

function readJson(file) {
  const target = path.resolve(file);
  if (!fs.existsSync(target)) throw new Error(`File not found: ${file}`);
  return JSON.parse(fs.readFileSync(target, "utf8"));
}

function buildNewspaperIndex(newspapers) {
  const index = new Map();
  for (const paper of newspapers) {
    for (const value of [paper.name, paper.slug, paper.abbr]) {
      if (!value) continue;
      index.set(normalizeKey(value), paper.slug);
      index.set(compactKey(value), paper.slug);
    }
  }
  return index;
}

function makeResolvers(newspapers) {
  const paperIndex = buildNewspaperIndex(newspapers);
  const paperNames = newspapers.map((paper) => ({ slug: paper.slug, name: paper.name }));

  function resolveNewspaper(rawName) {
    const raw = String(rawName ?? "").trim();
    if (!raw) return null;
    const key = normalizeKey(raw);
    if (!key) return null;
    if (NEWSPAPER_ALIASES[key]) return NEWSPAPER_ALIASES[key];
    if (paperIndex.has(key)) return paperIndex.get(key);
    if (paperIndex.has(compactKey(raw))) return paperIndex.get(compactKey(raw));

    let best = null;
    let bestScore = 0;
    for (const paper of paperNames) {
      const score = similarity(raw, paper.name);
      if (score > bestScore) {
        bestScore = score;
        best = paper;
      }
    }
    if (best && bestScore >= 0.86) return best.slug;
    return null;
  }

  const appCities = [...new Set(newspapers.flatMap((paper) => paper.cities || []))];
  const cityIndex = new Map(appCities.map((city) => [normalizeKey(city), city]));

  function resolveCity(rawCity) {
    const key = normalizeKey(rawCity);
    if (!key) return null;
    if (CITY_ALIASES[key]) return CITY_ALIASES[key];
    if (cityIndex.has(key)) return cityIndex.get(key);
    for (const [cityKey, city] of cityIndex) {
      if (compactKey(cityKey) === compactKey(key)) return city;
    }
    let best = null;
    let bestScore = 0;
    for (const city of appCities) {
      const score = similarity(rawCity, city);
      if (score > bestScore) {
        bestScore = score;
        best = city;
      }
    }
    if (best && bestScore >= 0.84) return best;
    return null;
  }

  return { resolveCity, resolveNewspaper, appCities };
}

function splitPackageLabel(label) {
  return String(label ?? "")
    .split(/\s*\+\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildPackageIndex(packages) {
  const bySlugKey = new Map();
  const byLabelKey = new Map();
  packages.forEach((pkg, index) => {
    if (Array.isArray(pkg.slugs) && pkg.slugs.length) {
      bySlugKey.set([...pkg.slugs].sort().join("|"), index);
    }
    if (pkg.label) byLabelKey.set(normalizeKey(pkg.label), index);
  });
  return { bySlugKey, byLabelKey };
}

function matchExistingPackage(packages, index, row, slugs) {
  const labelKey = normalizeKey(row.package_label);
  if (index.byLabelKey.has(labelKey)) return index.byLabelKey.get(labelKey);

  if (slugs?.length) {
    const slugKey = [...slugs].sort().join("|");
    if (index.bySlugKey.has(slugKey)) return index.bySlugKey.get(slugKey);
  }

  let bestIndex = -1;
  let bestScore = 0;
  packages.forEach((pkg, i) => {
    if (!pkg.label) return;
    const score = similarity(pkg.label, row.package_label);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  });
  if (bestIndex >= 0 && bestScore >= 0.82) return bestIndex;

  if (slugs?.length) {
    const wanted = new Set(slugs);
    for (let i = 0; i < packages.length; i += 1) {
      const pkg = packages[i];
      if (!Array.isArray(pkg.slugs) || pkg.slugs.length !== slugs.length) continue;
      if (pkg.slugs.every((slug) => wanted.has(slug))) return i;
    }
  }
  return -1;
}

/**
 * Packages that were curated by hand are not in the scraped source, so they
 * would have no line fields. Fill those with the same documented fallback the
 * pricing helper uses (5 lines included, extra line = 20% of the rate) so the
 * store is self-describing and the picker can show the extra-line price.
 * Packages written by this sync are skipped, so `--strict` scrapes keep their
 * null line fields.
 */
function backfillLinePricing(packages, baseLines, extraLinePercent, touched = new Set()) {
  let filled = 0;
  for (const list of Object.values(packages)) {
    for (const pkg of list) {
      if (pkg.rate == null || touched.has(pkg)) continue;
      let changed = false;
      if (pkg.baseLines == null) {
        pkg.baseLines = baseLines;
        changed = true;
      }
      if (pkg.extraLineRate == null) {
        pkg.extraLineRate = Math.round((pkg.rate * extraLinePercent) / 100);
        changed = true;
      }
      if (!pkg.pricingModel) {
        pkg.pricingModel = "per_line_flat";
        changed = true;
      }
      if (!pkg.pricingSource) {
        pkg.pricingSource = "derived_percent_of_base";
        changed = true;
      }
      if (changed) filled += 1;
    }
  }
  return filled;
}

function buildEditions(rows) {
  return rows.map((row) => ({
    sourceId: row.source_id,
    rate: row.base_rate,
    mrp: row.mrp ?? null,
    unit: row.unit,
    baseLines: row.base_lines ?? null,
    extraLineRate: row.extra_line_rate ?? null,
    pricingModel: row.pricing_model,
    sourceUrl: row.source_url,
  }));
}

/**
 * A city page can list the same publication label more than once (different
 * editions with no edition name in the HTML). Keep the existing rate when it
 * matches one of the rows, otherwise pick the closest/first row so a duplicate
 * does not overwrite the main edition with a cheaper one.
 */
function chooseCanonicalRow(rows, existing) {
  if (existing?.rate != null) {
    const exact = rows.find((row) => Number(row.base_rate) === Number(existing.rate));
    if (exact) return exact;
    let best = rows[0];
    let bestDiff = Infinity;
    for (const row of rows) {
      const diff = Math.abs(Number(row.base_rate) - Number(existing.rate));
      if (diff < bestDiff) {
        bestDiff = diff;
        best = row;
      }
    }
    return best;
  }
  return rows[0];
}

function rateSnapshot(pkg) {
  return JSON.stringify([
    pkg.rate,
    pkg.mrp ?? null,
    pkg.baseLines ?? null,
    pkg.extraLineRate ?? null,
    pkg.pricingModel ?? null,
    pkg.pricingSource ?? null,
    pkg.sourceId ?? null,
    (pkg.editions ?? []).map((edition) => [edition.sourceId, edition.rate]),
  ]);
}

/** Applies a scraped row and reports whether any published rate field changed. */
function applyRateToPackage(pkg, row, rows, now) {
  const before = rateSnapshot(pkg);
  pkg.rate = row.base_rate;
  if (row.mrp != null) pkg.mrp = row.mrp;
  pkg.baseLines = row.base_lines;
  pkg.extraLineRate = row.extra_line_rate;
  pkg.pricingModel = row.pricing_model;
  pkg.pricingSource = row.pricing_source;
  pkg.sourceId = row.source_id;
  pkg.lastSyncedAt = now;
  if (rows.length > 1) pkg.editions = buildEditions(rows);
  else delete pkg.editions;
  return rateSnapshot(pkg) !== before;
}

function makeNewPackage(row, slugs, rows, now) {
  const pkg = {
    slugs,
    label: row.package_label,
    rate: row.base_rate,
    baseLines: row.base_lines,
    extraLineRate: row.extra_line_rate,
    pricingModel: row.pricing_model,
    pricingSource: row.pricing_source,
    sourceId: row.source_id,
    lastSyncedAt: now,
  };
  if (row.mrp != null) pkg.mrp = row.mrp;
  if (rows.length > 1) pkg.editions = buildEditions(rows);
  return pkg;
}

async function syncMongo(docs, verbose) {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set; cannot use --mongo.");

  const mongoose = require("mongoose");
  const schema = new mongoose.Schema(
    {
      cityKey: { type: String, required: true, index: true },
      city: { type: String, required: true },
      cityId: { type: Number, required: true },
      sourceId: { type: Number, required: true },
      newspaperName: { type: String, required: true },
      packageLabel: { type: String, required: true },
      slugs: [{ type: String }],
      unit: String,
      baseRate: { type: Number, required: true },
      mrp: Number,
      baseLines: Number,
      extraLineRate: Number,
      extraLinePercent: Number,
      pricingModel: String,
      pricingSource: String,
      sourceUrl: String,
      scrapedAt: Date,
      lastSyncedAt: { type: Date, default: Date.now },
    },
    { timestamps: true, collection: "namechangerates" },
  );
  schema.index({ cityKey: 1, sourceId: 1 }, { unique: true });

  const Model =
    mongoose.models.NameChangeRate ||
    mongoose.model("NameChangeRate", schema);

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || "ad2print",
    serverSelectionTimeoutMS: 15000,
  });

  try {
    if (docs.length === 0) return { matched: 0, modified: 0, upserted: 0 };
    const operations = docs.map((doc) => ({
      updateOne: {
        filter: { cityKey: doc.cityKey, sourceId: doc.sourceId },
        update: { $set: doc },
        upsert: true,
      },
    }));
    const result = await Model.bulkWrite(operations, { ordered: false });
    if (verbose) {
      console.log(
        `  Mongo: matched ${result.matchedCount}, modified ${result.modifiedCount}, upserted ${result.upsertedCount}`,
      );
    }
    return {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    };
  } finally {
    await mongoose.disconnect();
  }
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    console.log(
      [
        "Usage: node scripts/syncRates.js [options]",
        "",
        "  --write                 save changes (default is a dry run)",
        "  --mongo                 also upsert into MongoDB `namechangerates`",
        "  --input=FILE            scraped rates file (default scraped_rates.json)",
        "  --packages=FILE         package store (default data/name-change-packages.json)",
        "  --newspapers=FILE       newspaper catalogue (default data/newspapers.json)",
        "  --verbose               print every change",
        "  --base-lines=N          included lines for hand-curated packages (default 5)",
        "  --extra-line-percent=N  extra-line fallback % of rate (default 20)",
      ].join("\n"),
    );
    return;
  }

  const inputFile = typeof args.input === "string" ? args.input : DEFAULTS.input;
  const packagesFile = typeof args.packages === "string" ? args.packages : DEFAULTS.packages;
  const newspapersFile =
    typeof args.newspapers === "string" ? args.newspapers : DEFAULTS.newspapers;
  const write = Boolean(args.write);
  const useMongo = Boolean(args.mongo);
  const verbose = Boolean(args.verbose);
  const baseLines =
    args["base-lines"] !== undefined ? Math.max(1, Number(args["base-lines"])) : DEFAULTS.baseLines;
  const extraLinePercent =
    args["extra-line-percent"] !== undefined
      ? Number(args["extra-line-percent"])
      : DEFAULTS.extraLinePercent;

  const scraped = readJson(inputFile);
  const packages = readJson(packagesFile);
  const newspapers = readJson(newspapersFile);
  const { resolveCity, resolveNewspaper, appCities } = makeResolvers(newspapers);

  const rates = Array.isArray(scraped.rates)
    ? scraped.rates
    : Array.isArray(scraped)
      ? scraped
      : [];
  if (rates.length === 0) throw new Error(`No rates found in ${inputFile}`);

  console.log(`Rate sync ${write ? "" : "(dry run) "}— ${rates.length} scraped rows`);
  console.log(`  Packages : ${packagesFile}`);
  console.log(`  Papers   : ${newspapersFile}`);
  console.log(`  Cities   : ${appCities.length} in catalogue`);

  const now = new Date().toISOString();
  const changes = [];
  const unresolvedCities = new Map();
  const unresolvedPapers = new Map();
  const mongoDocs = [];
  const groups = new Map();
  const touched = new Set();
  let skipped = 0;
  let updated = 0;
  let unchanged = 0;
  let created = 0;
  let cityCreated = 0;

  // A city page can list the same publication label more than once (different
  // editions with no edition name in the HTML). Group those rows so the main
  // package is updated once and every edition is preserved in `editions`.
  for (const row of rates) {
    if (row.base_rate == null || !Number.isFinite(Number(row.base_rate))) {
      skipped += 1;
      continue;
    }

    const city = resolveCity(row.city);
    if (!city) {
      const key = row.city || `city_id ${row.city_id}`;
      unresolvedCities.set(key, (unresolvedCities.get(key) || 0) + 1);
      skipped += 1;
      continue;
    }

    const groupKey = `${city}::${normalizeKey(row.package_label)}`;
    if (!groups.has(groupKey)) groups.set(groupKey, { city, rows: [] });
    groups.get(groupKey).rows.push(row);
  }

  for (const group of groups.values()) {
    const { city, rows } = group;
    if (!packages[city]) {
      packages[city] = [];
      cityCreated += 1;
    }
    const list = packages[city];
    const index = buildPackageIndex(list);

    const first = rows[0];
    const parts = splitPackageLabel(first.package_label);
    const slugs = [];
    const missing = [];
    for (const part of parts) {
      const slug = resolveNewspaper(part);
      if (slug) slugs.push(slug);
      else missing.push(part);
    }

    // Only match on the resolved slug set when every part of the label
    // resolved; a partial set would otherwise update a narrower package
    // (e.g. "TOI + Enadu" falling back to plain "TOI").
    const existingIndex = matchExistingPackage(
      list,
      index,
      first,
      missing.length === 0 ? slugs : null,
    );
    const existing = existingIndex >= 0 ? list[existingIndex] : null;
    const canonical = chooseCanonicalRow(rows, existing);

    if (existing) {
      touched.add(existing);
      const oldRate = existing.rate;
      const changed = applyRateToPackage(existing, canonical, rows, now);
      if (changed) {
        updated += 1;
        changes.push({
          city,
          label: existing.label,
          action: "updated",
          oldRate,
          newRate: existing.rate,
          editions: rows.length,
        });
      } else {
        unchanged += 1;
      }
    } else if (missing.length === 0 && slugs.length > 0) {
      const pkg = makeNewPackage(canonical, slugs, rows, now);
      list.push(pkg);
      touched.add(pkg);
      created += 1;
      changes.push({
        city,
        label: pkg.label,
        action: "created",
        oldRate: null,
        newRate: pkg.rate,
        editions: rows.length,
      });
    } else {
      const key = `${city} | ${first.package_label}`;
      unresolvedPapers.set(key, missing);
      skipped += rows.length;
      continue;
    }

    for (const row of rows) {
      mongoDocs.push({
        cityKey: city,
        city: row.city,
        cityId: row.city_id,
        sourceId: row.source_id,
        newspaperName: row.newspaper_name,
        packageLabel: row.package_label,
        slugs,
        unit: row.unit,
        baseRate: row.base_rate,
        mrp: row.mrp ?? undefined,
        baseLines: row.base_lines ?? undefined,
        extraLineRate: row.extra_line_rate ?? undefined,
        extraLinePercent: row.extra_line_percent ?? undefined,
        pricingModel: row.pricing_model,
        pricingSource: row.pricing_source,
        sourceUrl: row.source_url,
        scrapedAt: row.scraped_at ? new Date(row.scraped_at) : undefined,
        lastSyncedAt: new Date(now),
      });
    }
  }

  const backfilled = backfillLinePricing(packages, baseLines, extraLinePercent, touched);

  console.log("");
  console.log("Summary");
  console.log(`  Updated packages : ${updated}`);
  console.log(`  Unchanged packages: ${unchanged}`);
  console.log(`  Created packages : ${created}`);
  console.log(`  Skipped rows     : ${skipped}`);
  console.log(`  New city buckets : ${cityCreated}`);
  console.log(`  Line-field backfill: ${backfilled}`);
  if (unresolvedCities.size) {
    console.log(`  Unresolved cities: ${unresolvedCities.size}`);
    for (const [city, count] of unresolvedCities) console.log(`    - ${city} (${count})`);
  }
  if (unresolvedPapers.size) {
    console.log(`  Unresolved papers: ${unresolvedPapers.size}`);
    for (const [label, missing] of [...unresolvedPapers].slice(0, 20)) {
      console.log(`    - ${label} -> ${missing.join(", ")}`);
    }
    if (unresolvedPapers.size > 20) console.log(`    … ${unresolvedPapers.size - 20} more`);
  }

  if (changes.length) {
    console.log("");
    console.log(verbose ? "Changes" : "Changes (first 30)");
    const shown = verbose ? changes : changes.slice(0, 30);
    for (const change of shown) {
      const before = change.oldRate == null ? "—" : `₹${change.oldRate}`;
      const editions = change.editions > 1 ? ` · ${change.editions} editions` : "";
      console.log(
        `  ${change.city} | ${change.label} | ${before} -> ₹${change.newRate} (${change.action}${editions})`,
      );
    }
    if (!verbose && changes.length > 30) console.log(`  … ${changes.length - 30} more`);
  }

  if (!write) {
    console.log("");
    console.log("Dry run complete. Re-run with --write to save the JSON store.");
    return;
  }

  atomicWriteJson(packagesFile, packages);
  console.log("");
  console.log(`Wrote ${packagesFile}`);

  if (useMongo) {
    console.log("Syncing MongoDB collection `namechangerates`…");
    const result = await syncMongo(mongoDocs, verbose);
    console.log(
      `Mongo sync complete: matched ${result.matched}, modified ${result.modified}, upserted ${result.upserted}`,
    );
  }
}

main().catch((error) => {
  console.error("Rate sync failed:", error);
  process.exitCode = 1;
});
