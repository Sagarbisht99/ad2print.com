#!/usr/bin/env node
"use strict";
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Shared helpers for the rate-sync scripts.
 * No app code is imported here so the scripts can run standalone.
 */

const fs = require("fs");
const path = require("path");

function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (const raw of argv) {
    if (!raw.startsWith("--")) {
      args._.push(raw);
      continue;
    }
    const [key, ...rest] = raw.slice(2).split("=");
    const value = rest.length ? rest.join("=") : true;
    args[key] = value;
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Decode the handful of entities used by the target pages and collapse whitespace. */
function cleanText(value) {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** Lowercase, strip punctuation and language/edition suffixes for stable matching. */
function normalizeKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\((?:english|hindi|marathi|kannada|telugu|tamil|malayalam|gujarati|punjabi|urdu|bengali)\)/gi, " ")
    .replace(/\([^)]*\beditions?\b[^)]*\)/gi, " ")
    .replace(/\b(?:english|hindi|marathi|kannada|telugu|tamil|malayalam|gujarati|punjabi|urdu|bengali)\b/gi, " ")
    .replace(/\b(?:all|city|main)\s+editions?\b/gi, " ")
    .replace(/\bthe\b/gi, " ")
    .replace(/[^a-z0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactKey(value) {
  return normalizeKey(value).replace(/\s+/g, "");
}

function parseMoney(value) {
  if (value == null) return null;
  const match = String(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function atomicWriteJson(file, data) {
  const target = path.resolve(file);
  const tmp = `${target}.${process.pid}.tmp`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, target);
}

/** Minimal .env loader so `node scripts/syncRates.js` works without dotenv. */
function loadEnv(file = ".env") {
  const target = path.resolve(file);
  if (!fs.existsSync(target)) return;
  const lines = fs.readFileSync(target, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

function similarity(a, b) {
  const left = normalizeKey(a);
  const right = normalizeKey(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

module.exports = {
  atomicWriteJson,
  cleanText,
  compactKey,
  loadEnv,
  normalizeKey,
  parseArgs,
  parseMoney,
  roundMoney,
  similarity,
  sleep,
};
