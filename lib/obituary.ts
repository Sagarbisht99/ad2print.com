import obituaryPackages from "@/data/obituary-packages.json";
import { getNewspapersBySlugs, type Newspaper } from "@/lib/data";

export type ObituaryGroupId = "single" | "pair";

type RawPackage = {
  id: string;
  name: string;
  label: string;
  cities: string;
  slugs: string[];
  size: string;
  bw?: boolean;
  rate?: number;
  group: ObituaryGroupId;
  tag?: string;
};

export type ObituaryPackage = {
  id: string;
  name: string;
  label: string;
  cities: string;
  slugs: string[];
  papers: Newspaper[];
  size: string;
  bw: boolean;
  rate?: number;
  group: ObituaryGroupId;
  unit: string;
  bestSeller: boolean;
  tag?: string;
};

const RAW = obituaryPackages as RawPackage[];

function toPackage(row: RawPackage): ObituaryPackage | null {
  const papers = getNewspapersBySlugs(row.slugs);
  if (papers.length !== row.slugs.length) return null;

  return {
    id: row.id,
    name: row.name,
    label: row.label,
    cities: row.cities,
    slugs: papers.map((paper) => paper.slug),
    papers,
    size: row.size,
    bw: Boolean(row.bw),
    rate: row.rate,
    group: row.group === "pair" ? "pair" : "single",
    unit: papers.length <= 1 ? "Per ad" : "Both ads",
    bestSeller: false,
    tag: row.tag ?? (papers.length === 1 ? papers[0].language : undefined),
  };
}

export function getObituaryPackages(): ObituaryPackage[] {
  return RAW.map(toPackage).filter(
    (row): row is ObituaryPackage => Boolean(row),
  );
}

export function getObituarySelection(packageId: string | undefined) {
  return getObituaryPackages().find((pkg) => pkg.id === packageId) ?? null;
}
