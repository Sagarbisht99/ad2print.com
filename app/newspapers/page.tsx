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
  const topPapers = filtered.slice(0, 3);

  return (
    <>
      <div className="mt-10 grid gap-4 border border-line bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <input
          type="search"
          placeholder="Search paper or city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-line bg-paper px-4 py-3 text-sm outline-none ring-maroon/30 focus:ring-2"
        />
        <p className="text-sm text-charcoal">
          <span className="font-semibold text-ink">{filtered.length}</span> newspapers found
        </p>
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

      {topPapers.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {topPapers.map((paper, index) => (
            <div key={paper.slug} className="border border-line bg-paper-2 px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                {index === 0 ? "Top reach" : index === 1 ? "Popular pick" : "Regional choice"}
              </p>
              <p className="mt-2 font-display text-xl text-ink">{paper.name}</p>
              <p className="mt-1 text-sm text-charcoal">
                {paper.language}
                {paper.region ? ` · ${paper.region}` : ""}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 border border-line bg-white p-4 sm:p-5">
        <NewspaperWall papers={filtered} maxHeight={640} />
      </div>
    </>
  );
}

export default function NewspapersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="section-kicker">Newspapers</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-6xl">
        National & regional papers
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-charcoal">
        Browse titles with logos, language, region, and circulation. Filter by language or search a
        city — then enquire to book.
      </p>
      <Suspense fallback={<p className="mt-8 text-charcoal">Loading newspapers…</p>}>
        <NewspapersContent />
      </Suspense>
    </div>
  );
}
