import matrimonialPackages from "@/data/matrimonial-packages.json";
import { getNewspapersBySlugs, type Newspaper } from "@/lib/data";

type RawPackage = {
  id: string;
  name: string;
  label: string;
  cities: string;
  slugs: string[];
  group?: string;
  bestSeller?: boolean;
  tag?: string;
  rate?: number;
};

export type MatrimonialGroupId = "times" | "hindustan";

export type MatrimonialPackage = {
  id: string;
  name: string;
  label: string;
  cities: string;
  slugs: string[];
  papers: Newspaper[];
  group: MatrimonialGroupId;
  unit: string;
  bestSeller: boolean;
  tag?: string;
  rate?: number;
};

export type MatrimonialGroup = {
  id: MatrimonialGroupId;
  title: string;
  packages: MatrimonialPackage[];
};

const GROUP_TITLES: Record<MatrimonialGroupId, string> = {
  times: "Times of India Packages",
  hindustan: "Hindustan Times Packages",
};

const RAW_PACKAGES = matrimonialPackages as RawPackage[];

function toPackage(row: RawPackage): MatrimonialPackage | null {
  const papers = getNewspapersBySlugs(row.slugs);
  if (papers.length !== row.slugs.length) return null;

  return {
    id: row.id,
    name: row.name,
    label: row.label,
    cities: row.cities,
    slugs: papers.map((paper) => paper.slug),
    papers,
    group: row.group === "hindustan" ? "hindustan" : "times",
    unit:
      papers.length <= 1 ? "Per ad" : papers.length === 2 ? "Both ads" : `${papers.length} ads`,
    bestSeller: Boolean(row.bestSeller),
    tag: row.tag ?? (papers.length === 1 ? papers[0].language : undefined),
    rate: row.rate,
  };
}

export function getMatrimonialPackages(): MatrimonialPackage[] {
  return RAW_PACKAGES.map(toPackage).filter(
    (row): row is MatrimonialPackage => Boolean(row),
  );
}

export function getMatrimonialGroups(): MatrimonialGroup[] {
  const packages = getMatrimonialPackages();
  return (Object.keys(GROUP_TITLES) as MatrimonialGroupId[])
    .map((id) => ({
      id,
      title: GROUP_TITLES[id],
      packages: packages.filter((pkg) => pkg.group === id),
    }))
    .filter((group) => group.packages.length > 0);
}

export function getMatrimonialPackage(id?: string): MatrimonialPackage | null {
  if (!id) return null;
  return getMatrimonialPackages().find((row) => row.id === id) ?? null;
}

/**
 * Resolves the named package on the server so the payable amount always comes
 * from our own data, never from the client.
 */
export type MatrimonialSelection = MatrimonialPackage & { rate: number };

export function getMatrimonialSelection(id?: string): MatrimonialSelection | null {
  const pkg = getMatrimonialPackage(id);
  if (!pkg || !pkg.rate || pkg.rate <= 0) return null;
  return { ...pkg, rate: pkg.rate };
}
