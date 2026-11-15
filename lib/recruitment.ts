import recruitmentPackages from "@/data/recruitment-packages.json";
import { getNewspapersBySlugs, type Newspaper } from "@/lib/data";

export type RecruitmentGroupId = "single" | "combo";

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
  group: RecruitmentGroupId;
  tag?: string;
  bestSeller?: boolean;
};

export type RecruitmentPackage = {
  id: string;
  name: string;
  label: string;
  cities: string;
  slugs: string[];
  papers: Newspaper[];
  rate?: number;
  lines: number;
  words: number;
  unitType: "lines" | "words";
  group: RecruitmentGroupId;
  unit: string;
  unitNote: string;
  bestSeller: boolean;
  tag?: string;
};

export type RecruitmentGroup = {
  id: RecruitmentGroupId;
  title: string;
  note: string;
  packages: RecruitmentPackage[];
};

const GROUP_TITLES: Record<RecruitmentGroupId, { title: string; note: string }> = {
  single: {
    title: "Delhi & NCR — single newspaper packages",
    note: "One insertion · first lines or words included in the rate",
  },
  combo: {
    title: "Multi-day & multi-paper packages",
    note: "Weekday + Sunday insertions and multi-city combinations",
  },
};

const RAW = recruitmentPackages as RawPackage[];

function toPackage(row: RawPackage): RecruitmentPackage | null {
  const papers = getNewspapersBySlugs(row.slugs);
  if (papers.length !== row.slugs.length) return null;

  const lines = row.lines ?? 0;
  const words = row.words ?? 0;
  const unitNote =
    row.unitType === "lines"
      ? `First ${lines} lines`
      : `First ${words} words`;

  return {
    id: row.id,
    name: row.name,
    label: row.label,
    cities: row.cities,
    slugs: papers.map((paper) => paper.slug),
    papers,
    rate: row.rate,
    lines: lines || (row.words ? 0 : 5),
    words,
    unitType: row.unitType,
    group: row.group === "combo" ? "combo" : "single",
    unit:
      papers.length <= 1
        ? row.unitType === "lines"
          ? `First ${lines} lines`
          : `First ${words} words`
        : papers.length === 2
          ? "Both papers"
          : `${papers.length} papers`,
    unitNote,
    bestSeller: Boolean(row.bestSeller),
    tag: row.tag ?? (papers.length === 1 ? papers[0].language : undefined),
  };
}

export function getRecruitmentPackages(): RecruitmentPackage[] {
  return RAW.map(toPackage).filter(
    (row): row is RecruitmentPackage => Boolean(row),
  );
}

export function getRecruitmentGroups(): RecruitmentGroup[] {
  const packages = getRecruitmentPackages();
  return (["single", "combo"] as RecruitmentGroupId[])
    .map((id) => ({
      id,
      title: GROUP_TITLES[id].title,
      note: GROUP_TITLES[id].note,
      packages: packages.filter((pkg) => pkg.group === id),
    }))
    .filter((group) => group.packages.length > 0);
}

export function getRecruitmentSelection(packageId: string | undefined) {
  const selection = getRecruitmentPackages().find((pkg) => pkg.id === packageId);
  return selection ?? null;
}
