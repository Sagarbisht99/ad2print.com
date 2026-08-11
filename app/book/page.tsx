"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import {
  formatPrice,
  getCategories,
  getCities,
  getNewspapers,
} from "@/lib/data";
import { AD_TYPES, SITE } from "@/lib/site";

function BookForm() {
  const params = useSearchParams();
  const categories = getCategories();
  const newspapers = getNewspapers();
  const adTypes = AD_TYPES;
  const cities = getCities();

  const [category, setCategory] = useState(params.get("category") ?? categories[0]?.slug ?? "");
  const [paper, setPaper] = useState(params.get("paper") ?? newspapers[0]?.slug ?? "");
  const [type, setType] = useState(params.get("type") ?? adTypes[0]?.slug ?? "");
  const [city, setCity] = useState(cities[0] ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [matter, setMatter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedCat = useMemo(
    () => categories.find((c) => c.slug === category),
    [categories, category],
  );
  const selectedPaper = useMemo(
    () => newspapers.find((n) => n.slug === paper),
    [newspapers, paper],
  );
  const selectedType = useMemo(() => adTypes.find((t) => t.slug === type), [adTypes, type]);

  const estimate = Math.max(
    selectedCat?.fromPrice ?? 0,
    selectedPaper?.fromPrice ?? 0,
    selectedType?.fromPrice ?? 0,
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-maroon/30 bg-white/80 p-8 text-center">
        <h2 className="font-display text-3xl text-maroon">Request received</h2>
        <p className="mx-auto mt-4 max-w-md text-charcoal">
          Thanks{name ? `, ${name}` : ""}. Our desk will confirm the exact rate for{" "}
          <strong>{selectedPaper?.name}</strong> ({city}) and share a proof before print.
        </p>
        <p className="mt-4 text-sm text-charcoal">
          Prefer WhatsApp?{" "}
          <a
            className="font-semibold text-maroon hover:underline"
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            Chat now
          </a>
        </p>
        <Link href="/" className="mt-8 inline-block text-sm font-semibold text-maroon hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6 border border-line bg-white/70 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold text-ink">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
              required
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold text-ink">Ad format</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
              required
            >
              {adTypes.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold text-ink">Newspaper</span>
            <select
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
              required
            >
              {newspapers.map((n) => (
                <option key={n.slug} value={n.slug}>
                  {n.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold text-ink">City / edition</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
              required
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-ink">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-ink">Phone / WhatsApp</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-ink">Ad matter or brief</span>
          <textarea
            value={matter}
            onChange={(e) => setMatter(e.target.value)}
            rows={6}
            placeholder="Paste wording, or describe what you need. We can draft & translate."
            className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-sm bg-maroon px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-maroon-deep sm:w-auto"
        >
          Request rate & proof
        </button>
      </div>

      <aside className="h-fit border border-line bg-paper-2/90 p-6">
        <h2 className="font-display text-2xl text-ink">Estimate</h2>
        {selectedType?.image && (
          <div className="mt-4 overflow-hidden border border-line bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedType.image}
              alt={`Sample ${selectedType.name}`}
              width={234}
              height={166}
              className="mx-auto h-auto w-full max-w-[220px] object-contain"
            />
          </div>
        )}
        <p className="mt-4 text-sm text-charcoal">
          Indicative starting rate based on your selections. Final quote includes GST and edition rules.
        </p>
        <p className="mt-6 font-display text-4xl text-maroon">{formatPrice(estimate)}</p>
        <ul className="mt-6 space-y-3 text-sm text-charcoal">
          <li>
            <span className="font-medium text-ink">Category:</span> {selectedCat?.name}
          </li>
          <li>
            <span className="font-medium text-ink">Format:</span> {selectedType?.name}
          </li>
          <li>
            <span className="font-medium text-ink">Paper:</span> {selectedPaper?.name}
          </li>
          <li>
            <span className="font-medium text-ink">City:</span> {city}
          </li>
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-charcoal/80">
          Need help now? Call{" "}
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
            {SITE.phone}
          </a>
        </p>
      </aside>
    </form>
  );
}

export default function BookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Book an ad</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Request your print booking</h1>
      <p className="mt-4 max-w-2xl text-lg text-charcoal">
        Choose category, paper, and city. Send your matter — we confirm the rate and share a proof
        before anything goes to press.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-charcoal">Loading booking form…</p>}>
          <BookForm />
        </Suspense>
      </div>
    </div>
  );
}
