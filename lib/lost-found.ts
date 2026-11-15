import lostFoundPackages from "@/data/lost-found-packages.json";
import { getNewspapersBySlugs, type Newspaper } from "@/lib/data";

export type LostFoundGroupId = "single";

type RawPackage = {
  id: string;
  city: string;
  cityId: number;
  name: string;
  slugs: string[];
  rate?: number;
  lines?: number;
  unitType: "lines";
  group: LostFoundGroupId;
};

export type LostFoundPackage = {
  id: string;
  city: string;
  name: string;
  label: string;
  slugs: string[];
  papers: Newspaper[];
  rate?: number;
  lines: number;
  unitType: "lines";
  unit: string;
  unitNote: string;
};

const RAW = lostFoundPackages as RawPackage[];

function toPackage(row: RawPackage): LostFoundPackage | null {
  const papers = getNewspapersBySlugs(row.slugs);
  if (papers.length !== row.slugs.length) return null;

  const lines = row.lines ?? 5;

  return {
    id: row.id,
    city: row.city,
    name: row.name,
    label: `${row.name} — ${row.city}`,
    slugs: papers.map((paper) => paper.slug),
    papers,
    rate: row.rate,
    lines,
    unitType: "lines",
    unit: `First ${lines} lines`,
    unitNote: `First ${lines} lines`,
  };
}

export function getLostFoundPackages(): LostFoundPackage[] {
  return RAW.map(toPackage).filter(
    (row): row is LostFoundPackage => Boolean(row),
  );
}

export function getLostFoundSelection(packageId: string | undefined) {
  return getLostFoundPackages().find((pkg) => pkg.id === packageId) ?? null;
}
