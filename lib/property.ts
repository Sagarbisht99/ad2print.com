import propertyPackages from "@/data/property-packages.json";
import { getNewspapersBySlugs, type Newspaper } from "@/lib/data";

export type PropertyGroupId = "single" | "combo";

type RawPackage = {
  id: string;
  name: string;
  label: string;
  cities: string;
  slugs: string[];
  rate?: number;
  lines?: number;
  words?: number;
  unitType: "lines" | "words";
  group: PropertyGroupId;
  tag?: string;
  bestSeller?: boolean;
  purposeOnly?: string;
};

export type PropertyPackage = {
  id: string;
  name: string;
  label: string;
  cities: string;
  slugs: string[];
  papers: Newspaper[];
  rate?: number;
  lines: number;
  unitType: "lines" | "words";
  group: PropertyGroupId;
  unit: string;
  unitNote: string;
  bestSeller: boolean;
  tag?: string;
  purposeOnly?: string;
};

const RAW = propertyPackages as RawPackage[];

function toPackage(row: RawPackage): PropertyPackage | null {
  const papers = getNewspapersBySlugs(row.slugs);
  if (papers.length !== row.slugs.length) return null;

  return {
    id: row.id,
    name: row.name,
    label: row.label,
    cities: row.cities,
    slugs: papers.map((paper) => paper.slug),
    papers,
    rate: row.rate,
    lines: row.lines ?? 5,
    unitType: row.unitType === "words" ? "words" : "lines",
    group: row.group === "combo" ? "combo" : "single",
    unit:
      papers.length <= 1
        ? `First ${row.lines ?? 5} lines`
        : papers.length === 2
          ? "Both papers"
          : `${papers.length} papers`,
    unitNote: `First ${row.lines ?? 5} lines`,
    bestSeller: Boolean(row.bestSeller),
    tag: row.tag ?? (papers.length === 1 ? papers[0].language : undefined),
    purposeOnly: row.purposeOnly,
  };
}

export function getPropertyPackages(): PropertyPackage[] {
  return RAW.map(toPackage).filter(
    (row): row is PropertyPackage => Boolean(row),
  );
}

export function getPropertySelection(packageId: string | undefined) {
  return getPropertyPackages().find((pkg) => pkg.id === packageId) ?? null;
}
