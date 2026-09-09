"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NewspaperLogo } from "@/components/NewspaperWall";
import type { Newspaper } from "@/lib/data";
import { slugifyCity } from "@/lib/data";
import { SITE } from "@/lib/site";

type Option = {
  id: string;
  slugs: string[];
  label: string;
  papers: Newspaper[];
  unit: string;
};

function buildOptions(papers: Newspaper[]): Option[] {
  const english = papers.filter((p) => p.language === "English");
  const regional = papers.filter((p) => p.language !== "English");
  const combos: Option[] = [];
  const firsts = english.length ? english : papers;

  for (let i = 0; i < Math.min(firsts.length, 4); i += 1) {
    const first = firsts[i];
    const second = regional.length
      ? (regional[i] ?? regional[0])
      : papers[i + 1];
    if (!first || !second || second.slug === first.slug) continue;
    const pair = [first, second];
    combos.push({
      id: `combo-${pair.map((p) => p.slug).join("-")}`,
      slugs: pair.map((p) => p.slug),
      label: pair.map((p) => `${p.name} (${p.language})`).join(" + "),
      papers: pair,
      unit: "Both ads",
    });
  }

  const singles: Option[] = papers.map((paper) => ({
    id: paper.slug,
    slugs: [paper.slug],
    label: `${paper.name} (${paper.language})`,
    papers: [paper],
    unit: "Per ad",
  }));

  const seen = new Set<string>();
  return [...combos, ...singles].filter((option) => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
}

export function NewspaperPicker({
  city,
  papers,
}: {
  city: string;
  papers: Newspaper[];
}) {
  const router = useRouter();
  const options = useMemo(() => buildOptions(papers), [papers]);
  const [selected, setSelected] = useState<string>(options[0]?.id ?? "");
  const [error, setError] = useState("");

  function toggle(id: string) {
    setError("");
    setSelected(id);
  }

  function proceed() {
    const option = options.find((item) => item.id === selected);
    if (!option) {
      setError("Select a newspaper to continue.");
      return;
    }
    const citySlug = slugifyCity(city);
    const query = new URLSearchParams({ papers: option.slugs.join(",") });
    router.push(`/name-change/${citySlug}/compose?${query.toString()}`);
  }

  return (
    <div>
      <div className="border border-maroon/25 bg-maroon/8 px-4 py-3 text-sm text-ink">
        All newspapers below are commonly accepted for passport, Gazette, Aadhaar and PAN. For
        passport, two newspapers (English + regional) are usually required.
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">
          Choose newspaper(s): {city}
        </h1>
        <p className="text-xs text-charcoal">Desk confirms the amount before booking</p>
      </div>

      <div className="mt-6 flex justify-center">
        <button type="button" onClick={proceed} className="btn-primary w-full sm:w-auto">
          Proceed to compose ad →
        </button>
      </div>
      {error ? <p className="mt-2 text-center text-sm text-maroon">{error}</p> : null}

      <div className="mt-6 hidden grid-cols-[1fr_6rem] gap-3 border-b border-line px-2 py-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal sm:grid">
        <span>Publication</span>
        <span className="text-right">Select</span>
      </div>

      <ul className="divide-y divide-line border-y border-line">
        {options.map((option) => {
          const active = selected === option.id;
          return (
            <li key={option.id}>
              <label
                className={`grid cursor-pointer items-center gap-3 px-2 py-4 sm:grid-cols-[1fr_6rem] ${
                  active ? "bg-maroon/6" : "bg-white hover:bg-paper-2/70"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{option.label}</p>
                  <p className="mt-1 text-xs text-charcoal">{option.unit}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {option.papers.map((paper) => (
                      <span key={paper.slug} className="inline-flex h-8 items-center">
                        <NewspaperLogo paper={paper} />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <input
                    type="radio"
                    name="newspaper"
                    checked={active}
                    onChange={() => toggle(option.id)}
                    className="h-4 w-4 accent-maroon"
                    aria-label={`Select ${option.label}`}
                  />
                </div>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex justify-center">
        <button type="button" onClick={proceed} className="btn-primary w-full sm:w-auto">
          Proceed to compose ad →
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-charcoal">
        Urgent booking? Call{" "}
        <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
          {SITE.phone}
        </a>
      </p>
    </div>
  );
}
