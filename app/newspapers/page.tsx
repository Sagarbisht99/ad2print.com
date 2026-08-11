"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NewspaperWall } from "@/components/NewspaperWall";
import { getLanguages, getNewspapers } from "@/lib/data";

function NewspapersContent() {
  const searchParams = useSearchParams();
  const newspapers = getNewspapers();
  const languages = ["All", ...getLanguages()];
  const [lang, setLang] = useState("All");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const filtered = useMemo(() => {
    return newspapers
      .filter((n) => {
        const matchLang = lang === "All" || n.language === lang;
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          n.name.toLowerCase().includes(q) ||
          n.cities.some((c) => c.toLowerCase().includes(q)) ||
          (n.region?.toLowerCase().includes(q) ?? false);
        return matchLang && matchQ;
      })
      .sort((a, b) => (b.copies ?? 0) - (a.copies ?? 0));
  }, [newspapers, lang, query]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search paper or city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none ring-maroon/30 focus:ring-2"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {languages.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`rounded-sm px-3 py-1.5 text-sm transition ${
              lang === l
                ? "bg-maroon text-white"
                : "border border-line bg-white text-charcoal hover:border-maroon hover:text-maroon"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-line bg-paper-2/50 p-4 sm:p-5">
        <NewspaperWall papers={filtered} maxHeight={640} />
      </div>
    </>
  );
}

export default function NewspapersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Newspapers</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
        National & regional papers
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-charcoal">
        Browse titles with logos, language, region, and circulation. Filter by language or search a
        city — then book in a few clicks.
      </p>
      <Suspense fallback={<p className="mt-8 text-charcoal">Loading newspapers…</p>}>
        <NewspapersContent />
      </Suspense>
    </div>
  );
}
