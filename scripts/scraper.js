#!/usr/bin/env node
"use strict";
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Crawl MyNameChangeAds city pages and extract name-change publication rates.
 *
 * What it does
 * 1. Discovers every `newspaper.php?city_id=N` link from the site index.
 * 2. Crawls each city page politely (default 1.5s gap, retries, timeout).
 * 3. Extracts the publication label, final (discounted) rate, MRP, unit,
 *    language and any line-pricing information the page publishes.
 * 4. Detects per-line / slab pricing from visible text, inline scripts and
 *    data-* attributes. The target currently publishes only flat per-ad rates,
 *    so a configurable fallback derives an effective extra-line rate.
 * 5. Writes a flat, deduplicated `scraped_rates.json` plus a summary.
 *
 * Usage
 *   node scripts/scraper.js
 *   node scripts/scraper.js --max-cities=2 --delay=0 --verbose
 *   node scripts/scraper.js --extra-line-percent=20 --base-lines=5
 *   node scripts/scraper.js --strict   # keep null when the target hides it
 */

const { load } = require("cheerio");
const {
  atomicWriteJson,
  cleanText,
  compactKey,
  normalizeKey,
  parseArgs,
  parseMoney,
  sleep,
} = require("./lib/common");

const BASE_URL = "https://mynamechangeads.com";
const START_CITY_ID = 1;
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0.0.0 Safari/537.36 AD2PRINT-RateSync/1.0 (+https://ad2print.in)";

const DEFAULTS = {
  out: "scraped_rates.json",
  delayMs: 1500,
  timeoutMs: 20000,
  retries: 3,
  baseLines: 5,
  extraLinePercent: 20,
  extraLineFlat: null,
  strict: false,
};

function log(message) {
  process.stdout.write(`${message}\n`);
}

function normalizeUnit(raw, publicationName) {
  const value = String(raw ?? "").trim();
  if (value) {
    const lower = value.toLowerCase();
    if (lower.includes("both")) return "Both Ads";
    if (lower.includes("per ad")) return "Per Ad";
    if (lower.includes("ads") || lower.includes("ad")) return value;
  }
  const papers = String(publicationName ?? "")
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);
  if (papers.length === 1) return "Per Ad";
  if (papers.length === 2) return "Both Ads";
  return `${papers.length} Ads`;
}

function extractLanguage(publicationName) {
  const match = String(publicationName).match(
    /\((English|Hindi|Marathi|Kannada|Telugu|Tamil|Malayalam|Gujarati|Punjabi|Urdu|Bengali)\)/i,
  );
  return match ? match[1][0].toUpperCase() + match[1].slice(1).toLowerCase() : null;
}

function extractLinesFromName(publicationName) {
  const match = String(publicationName).match(/(\d{1,2})\s*(?:printed\s*)?lines?/i);
  return match ? Number(match[1]) : null;
}

/**
 * The rate cell contains:
 *   <span style="text-decoration: line-through">MRP</span>
 *   <span>10% off</span><br>FINAL / Per Ad
 * Some rows omit the unit, so the last number after the final <br> wins.
 */
function parseRateCell($, cell) {
  const html = cell.html() || "";
  const text = cleanText(html);
  const mrp =
    parseMoney(cell.find('span[style*="line-through"]').first().text()) ||
    parseMoney((html.match(/line-through[^>]*>\s*([\d.,]+)/i) || [])[1]);
  const discountMatch = text.match(/([\d.]+)\s*%\s*off/i);
  const discountPercent = discountMatch ? Number(discountMatch[1]) : null;

  const withoutDiscount = text.replace(/[\d.]+\s*%\s*off/gi, "").trim();
  const segments = withoutDiscount
    .split("\n")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const candidate = segments[segments.length - 1] || withoutDiscount;

  let rate = null;
  let unitRaw = null;
  const tail = candidate.match(/([\d,]+(?:\.\d+)?)\s*(?:\/\s*([A-Za-z ]+))?/);
  if (tail) {
    rate = parseMoney(tail[1]);
    unitRaw = tail[2] ? tail[2].trim() : null;
  }
  if (rate == null) {
    const any = text.match(/([\d,]+(?:\.\d+)?)\s*\/\s*(Both Ads?|Per Ad)/i);
    if (any) {
      rate = parseMoney(any[1]);
      unitRaw = any[2];
    }
  }

  return { mrp, discountPercent, rate, unitRaw };
}

function detectLinePricing(html) {
  const $ = load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const scriptText = $("script")
    .map((_, element) => $(element).html() || "")
    .get()
    .join("\n");

  const evidence = [];
  let baseLines = null;
  let extraLineRate = null;
  let extraLinePercent = null;
  const slabs = [];

  const basePatterns = [
    /(?:minimum|min\.?|first|includes?|included|up to)\s*(?:of\s*)?(\d{1,2})\s*(?:printed\s*)?lines?/i,
    /(\d{1,2})\s*(?:printed\s*)?lines?\s*(?:included|free|minimum)/i,
  ];
  for (const pattern of basePatterns) {
    const match = bodyText.match(pattern);
    if (match) {
      baseLines = Number(match[1]);
      evidence.push(match[0]);
      break;
    }
  }

  const flatPatterns = [
    /(?:extra|additional|each)\s+(?:printed\s+)?lines?[^.\n]{0,50}?(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)/i,
    /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(?:per|\/)\s*(?:extra\s+)?line/i,
    /(?:line\s*(?:rate|charge)|per\s*line\s*(?:rate|charge))[^0-9₹]{0,30}([\d,]+(?:\.\d+)?)/i,
  ];
  for (const pattern of flatPatterns) {
    const match = bodyText.match(pattern);
    if (match) {
      extraLineRate = parseMoney(match[1]);
      evidence.push(match[0]);
      break;
    }
  }

  const percentPatterns = [
    /([\d.]+)\s*%\s*(?:of\s*(?:the\s*)?(?:base|package)\s*rate\s*)?(?:per|for each|each)\s*(?:extra\s*)?line/i,
    /(?:extra|additional)\s+(?:printed\s+)?lines?[^%\n]{0,40}?([\d.]+)\s*%/i,
  ];
  for (const pattern of percentPatterns) {
    const match = bodyText.match(pattern);
    if (match) {
      extraLinePercent = Number(match[1]);
      evidence.push(match[0]);
      break;
    }
  }

  const slabPattern =
    /(\d+)\s*[-–]\s*(\d+)\s*lines?[^₹\n]{0,30}(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)/gi;
  let slabMatch;
  while ((slabMatch = slabPattern.exec(bodyText))) {
    slabs.push({
      from: Number(slabMatch[1]),
      to: Number(slabMatch[2]),
      rate: parseMoney(slabMatch[3]),
    });
    evidence.push(slabMatch[0]);
  }

  const variablePattern =
    /(?:extra[_-]?line[_-]?rate|extraLineRate|per[_-]?line[_-]?rate|perLineRate|line[_-]?rate|lineRate|pricePerLine)\s*[:=]\s*["']?([\d.]+)/gi;
  let variableMatch;
  while ((variableMatch = variablePattern.exec(scriptText))) {
    const value = parseMoney(variableMatch[1]);
    if (value != null) {
      extraLineRate = extraLineRate ?? value;
      evidence.push(variableMatch[0]);
    }
  }

  $(
    "[data-extra-line-rate], [data-extra-line], [data-line-rate], [data-per-line-rate]",
  ).each((_, element) => {
    const value = parseMoney(
      $(element).attr("data-extra-line-rate") ??
        $(element).attr("data-extra-line") ??
        $(element).attr("data-line-rate") ??
        $(element).attr("data-per-line-rate"),
    );
    if (value != null) {
      extraLineRate = extraLineRate ?? value;
      evidence.push(`data-attribute=${value}`);
    }
  });

  let model = null;
  if (slabs.length) model = "slab";
  else if (extraLinePercent != null) model = "per_line_percent";
  else if (extraLineRate != null) model = "per_line_flat";
  else if (baseLines != null) model = "base_lines_only";

  return {
    baseLines,
    extraLineRate,
    extraLinePercent,
    slabs,
    model,
    evidence: [...new Set(evidence)].slice(0, 5).join(" | ") || null,
  };
}

function applyPricingPolicy(row, pagePricing, options) {
  // Base lines are used from the page/name when published. Otherwise the
  // configurable fallback applies, unless --strict keeps the field null.
  const detectedBaseLines = row.lines_in_name ?? pagePricing?.baseLines ?? null;
  const baseLines =
    detectedBaseLines ?? (options.strict ? null : (options.baseLines ?? DEFAULTS.baseLines));
  let extraLineRate = pagePricing?.extraLineRate ?? null;
  let extraLinePercent = pagePricing?.extraLinePercent ?? null;
  let model = pagePricing?.model ?? null;
  let source = pagePricing && (extraLineRate != null || extraLinePercent != null || pagePricing.slabs.length)
    ? "target_page"
    : null;
  let note = pagePricing?.evidence
    ? `Detected on target page: ${pagePricing.evidence}`
    : null;

  if (extraLinePercent != null && extraLineRate == null && row.base_rate != null) {
    // Derived per-line rates are quoted in whole rupees, like the base rate.
    extraLineRate = Math.round((row.base_rate * extraLinePercent) / 100);
    model = "per_line_percent";
    source = "target_page";
  }

  if (extraLineRate == null && options.strict) {
    model = "flat_per_ad";
    source = "unavailable";
    note =
      note ||
      "The target page does not publish a per-line rate and --strict was passed.";
  } else if (extraLineRate == null) {
    if (options.extraLineFlat != null) {
      extraLineRate = options.extraLineFlat;
      model = "per_line_flat";
      source = "derived_flat";
      note =
        note ||
        `Target page does not publish a per-line rate; flat ₹${extraLineRate} per line applied from config.`;
    } else if (row.base_rate != null) {
      // Derived per-line rates are quoted in whole rupees, like the base rate.
      extraLineRate = Math.round((row.base_rate * options.extraLinePercent) / 100);
      model = "per_line_flat";
      source = "derived_percent_of_base";
      note =
        note ||
        `Target page does not publish a per-line rate; derived as ${options.extraLinePercent}% of the base rate.`;
    }
  }

  if (model == null) model = extraLineRate != null ? "per_line_flat" : "flat_per_ad";

  return {
    baseLines: baseLines == null ? null : Math.max(1, Math.round(baseLines)),
    extraLineRate,
    extraLinePercent,
    pricingModel: model,
    pricingSource: source ?? "unavailable",
    pricingNote: note,
  };
}

async function fetchText(url, { timeoutMs, retries, verbose }) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml",
          "accept-language": "en-IN,en;q=0.9",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("retry-after")) || 5;
        if (verbose) log(`  rate limited; waiting ${retryAfter}s`);
        await sleep(retryAfter * 1000);
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const backoff = 500 * 2 ** (attempt - 1);
      if (verbose) log(`  retry ${attempt}/${retries} after ${backoff}ms: ${error.message}`);
      await sleep(backoff);
    }
  }
  throw lastError;
}

async function discoverCities(options) {
  const urls = [`${BASE_URL}/index.php`, `${BASE_URL}/newspaper.php?city_id=${START_CITY_ID}`];
  const cities = new Map();

  for (const url of urls) {
    try {
      const html = await fetchText(url, options);
      const $ = load(html);

      $('a[href*="newspaper.php?city_id="]').each((_, element) => {
        const href = $(element).attr("href") || "";
        const match = href.match(/city_id=(\d+)/);
        if (!match) return;
        const id = Number(match[1]);
        const name = cleanText($(element).text() || $(element).find("span").text());
        if (!cities.has(id) || (!cities.get(id).city && name)) {
          cities.set(id, { city_id: id, city: name || `City ${id}` });
        }
      });

      if (cities.size <= 1) {
        const regex = /newspaper\.php\?city_id=(\d+)[\s\S]{0,400}?<span[^>]*>([^<]+)<\/span>/gi;
        let match;
        while ((match = regex.exec(html))) {
          const id = Number(match[1]);
          const name = cleanText(match[2]);
          if (!cities.has(id)) cities.set(id, { city_id: id, city: name });
        }
      }
    } catch (error) {
      log(`City discovery failed for ${url}: ${error.message}`);
    }
  }

  if (!cities.has(START_CITY_ID)) {
    cities.set(START_CITY_ID, { city_id: START_CITY_ID, city: "Delhi-NCR" });
  }

  return [...cities.values()].sort((a, b) => a.city_id - b.city_id);
}

function parseCityPage(html, cityId, options) {
  const $ = load(html);
  const cityMatch = html.match(/Choose Newspaper\(s\):\s*([^<]+)/i);
  const city = cityMatch ? cleanText(cityMatch[1]) : null;
  const pagePricing = detectLinePricing(html);
  const rows = [];
  const seen = new Set();

  $('input[name="news_id[]"]').each((_, element) => {
    const $input = $(element);
    const sourceId = Number($input.attr("value"));
    if (!Number.isFinite(sourceId)) return;

    const $row = $input.closest("tr");
    const $cells = $row.find("td");
    if ($cells.length < 2) return;

    const publicationName = cleanText($cells.eq(0).html() || "");
    if (!publicationName) return;

    const parsed = parseRateCell($, $cells.eq(1));
    if (parsed.rate == null) return;

    const dedupeKey = `${cityId}:${sourceId}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    const row = {
      city_id: cityId,
      city,
      edition: city,
      source_id: sourceId,
      newspaper_name: publicationName,
      package_label: publicationName,
      newspaper_key: normalizeKey(publicationName),
      newspaper_compact_key: compactKey(publicationName),
      language: extractLanguage(publicationName),
      lines_in_name: extractLinesFromName(publicationName),
      base_rate: parsed.rate,
      mrp: parsed.mrp,
      discount_percent: parsed.discountPercent,
      unit: normalizeUnit(parsed.unitRaw, publicationName),
    };

    const pricing = applyPricingPolicy(row, pagePricing, options);
    rows.push({
      ...row,
      base_lines: pricing.baseLines,
      extra_line_rate: pricing.extraLineRate,
      extra_line_percent: pricing.extraLinePercent,
      pricing_model: pricing.pricingModel,
      pricing_source: pricing.pricingSource,
      pricing_note: pricing.pricingNote,
      source_url: `${BASE_URL}/newspaper.php?city_id=${cityId}`,
      scraped_at: new Date().toISOString(),
    });
  });

  return { city, pagePricing, rows };
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    log(
      [
        "Usage: node scripts/scraper.js [options]",
        "",
        "  --out=FILE                 output file (default scraped_rates.json)",
        "  --delay=MS                 gap between city requests (default 1500)",
        "  --city=1,4,19              only crawl these city ids",
        "  --max-cities=N             stop after N cities (useful for testing)",
        "  --base-lines=N             fallback included lines (default 5)",
        "  --extra-line-percent=N     fallback extra-line % of base (default 20)",
        "  --extra-line-flat=RUPEES   fallback flat extra-line rate",
        "  --strict                   leave line fields null when target hides them",
        "  --verbose                  log retries and per-city details",
      ].join("\n"),
    );
    return;
  }

  const options = {
    out: typeof args.out === "string" ? args.out : DEFAULTS.out,
    delayMs:
      args.delay !== undefined ? Math.max(0, Number(args.delay)) : DEFAULTS.delayMs,
    timeoutMs:
      args.timeout !== undefined ? Math.max(1000, Number(args.timeout)) : DEFAULTS.timeoutMs,
    retries:
      args.retries !== undefined ? Math.max(1, Number(args.retries)) : DEFAULTS.retries,
    baseLines:
      args["base-lines"] !== undefined ? Number(args["base-lines"]) : DEFAULTS.baseLines,
    extraLinePercent:
      args["extra-line-percent"] !== undefined
        ? Number(args["extra-line-percent"])
        : DEFAULTS.extraLinePercent,
    extraLineFlat:
      args["extra-line-flat"] !== undefined ? Number(args["extra-line-flat"]) : null,
    strict: Boolean(args.strict),
    verbose: Boolean(args.verbose),
  };

  log("Discovering cities…");
  const discovered = await discoverCities(options);
  let cities = discovered;

  if (args.city) {
    const wanted = new Set(
      String(args.city)
        .split(",")
        .map((value) => Number(value.trim()))
        .filter(Number.isFinite),
    );
    cities = cities.filter((city) => wanted.has(city.city_id));
  }
  if (args["max-cities"]) {
    cities = cities.slice(0, Math.max(1, Number(args["max-cities"])));
  }

  log(
    `Crawling ${cities.length} city page${cities.length === 1 ? "" : "s"} ` +
      `(delay ${options.delayMs}ms, fallback ${options.baseLines} lines / ${options.extraLinePercent}% extra)…`,
  );

  const rates = [];
  const failed = [];
  const empty = [];
  let targetLineRates = 0;
  let derivedLineRates = 0;

  for (let index = 0; index < cities.length; index += 1) {
    const city = cities[index];
    const url = `${BASE_URL}/newspaper.php?city_id=${city.city_id}`;
    try {
      const html = await fetchText(url, options);
      const parsed = parseCityPage(html, city.city_id, options);
      const cityName = parsed.city || city.city;
      const rows = parsed.rows.map((row) => ({ ...row, city: row.city || cityName }));

      if (rows.length === 0) {
        empty.push({ city_id: city.city_id, city: cityName, url });
      } else {
        rates.push(...rows);
      }

      targetLineRates += rows.filter((row) => row.pricing_source === "target_page").length;
      derivedLineRates += rows.filter((row) => row.pricing_source.startsWith("derived")).length;

      log(
        `[${index + 1}/${cities.length}] ${cityName} (${city.city_id}) — ${rows.length} publication${
          rows.length === 1 ? "" : "s"
        }`,
      );
    } catch (error) {
      failed.push({ city_id: city.city_id, city: city.city, url, error: error.message });
      log(`[${index + 1}/${cities.length}] ${city.city} (${city.city_id}) — FAILED: ${error.message}`);
    }

    if (index < cities.length - 1 && options.delayMs > 0) {
      await sleep(options.delayMs);
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const row of rates) {
    const key = `${row.city_id}:${row.source_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }

  const generatedAt = new Date().toISOString();
  const output = {
    meta: {
      source: `${BASE_URL}/newspaper.php?city_id={city_id}`,
      generated_at: generatedAt,
      crawl_delay_ms: options.delayMs,
      pricing_policy: {
        base_lines_fallback: options.baseLines,
        extra_line_percent_fallback: options.extraLinePercent,
        extra_line_flat_fallback: options.extraLineFlat,
        strict: options.strict,
        note:
          "The target page publishes flat per-ad rates only. Line fields are taken from the page when present; otherwise they are derived with this policy. Use --strict to keep them null.",
      },
      totals: {
        cities_discovered: discovered.length,
        cities_crawled: cities.length - failed.length,
        cities_failed: failed.length,
        cities_empty: empty.length,
        newspapers: deduped.length,
        target_line_rates: targetLineRates,
        derived_line_rates: derivedLineRates,
      },
    },
    failed_cities: failed,
    empty_cities: empty,
    rates: deduped,
  };

  atomicWriteJson(options.out, output);

  log("");
  log("Crawl complete");
  log(`  Cities discovered : ${discovered.length}`);
  log(`  Cities crawled    : ${cities.length - failed.length}`);
  log(`  Cities failed     : ${failed.length}${failed.length ? ` (${failed.map((f) => f.city_id).join(", ")})` : ""}`);
  log(`  Cities with 0 rows: ${empty.length}${empty.length ? ` (${empty.map((c) => c.city_id).join(", ")})` : ""}`);
  log(`  Publications      : ${deduped.length}`);
  log(`  Target line rates : ${targetLineRates}`);
  log(`  Derived line rates: ${derivedLineRates}`);
  log(`  Output            : ${options.out}`);
}

main().catch((error) => {
  console.error("Scraper failed:", error);
  process.exitCode = 1;
});
