import categories from "@/data/categories.json";
import newspapers from "@/data/newspapers.json";
import nameChangePackages from "@/data/name-change-packages.json";

export type Category = (typeof categories)[number];
export type Newspaper = (typeof newspapers)[number];

export function getCategories() {
  return categories;
}

export function getPopularCategories() {
  return categories.filter((c) => c.popular);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getNewspapers() {
  return newspapers;
}

export function getNewspaper(slug: string) {
  return newspapers.find((n) => n.slug === slug);
}

export function getRelatedNewspapers(slug: string, limit = 8) {
  const paper = getNewspaper(slug);
  if (!paper) return [];
  return newspapers
    .filter((n) => n.slug !== slug && n.language === paper.language)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function getLanguages() {
  return [...new Set(newspapers.map((n) => n.language))].sort();
}

const METRO_CITIES = ["Delhi", "Mumbai", "Kolkata", "Chennai"];
const NAME_CHANGE_HIDDEN_CITIES = new Set(["Goa", "Guwahati"]);

export function getCities() {
  return [...new Set(newspapers.flatMap((n) => n.cities))].sort((a, b) => {
    const aMetro = METRO_CITIES.indexOf(a);
    const bMetro = METRO_CITIES.indexOf(b);
    const aRank = aMetro === -1 ? METRO_CITIES.length : aMetro;
    const bRank = bMetro === -1 ? METRO_CITIES.length : bMetro;
    if (aRank !== bRank) return aRank - bRank;
    return a.localeCompare(b);
  });
}

export function getNameChangeCities() {
  return getCities().filter((city) => !NAME_CHANGE_HIDDEN_CITIES.has(city));
}

export function slugifyCity(city: string) {
  return city
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCityFromSlug(slug: string) {
  return getCities().find((city) => slugifyCity(city) === slug);
}

export function getNameChangeCityFromSlug(slug: string) {
  return getNameChangeCities().find((city) => slugifyCity(city) === slug);
}

export function getNewspapersByCity(city: string) {
  return getNewspapers()
    .filter((paper) => paper.cities.includes(city))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getNewspapersBySlugs(slugs: string[]) {
  const unique = [...new Set(slugs.map((slug) => slug.trim()).filter(Boolean))];
  return unique
    .map((slug) => getNewspaper(slug))
    .filter((paper): paper is Newspaper => Boolean(paper));
}

export function getNameChangePackages(city: string) {
  const packages = nameChangePackages as Record<
    string,
    { slugs: string[]; label: string; bestSeller?: boolean; tag?: string }[]
  >;
  const rows = packages[city];
  if (!rows?.length) return [];
  return rows
    .map((row) => {
      const papers = getNewspapersBySlugs(row.slugs);
      if (papers.length !== row.slugs.length) return null;
      return {
        id: row.slugs.join("-"),
        slugs: papers.map((paper) => paper.slug),
        label: row.label,
        papers,
        unit:
          papers.length <= 1 ? "Per ad" : papers.length === 2 ? "Both ads" : `${papers.length} ads`,
        bestSeller: Boolean(row.bestSeller),
        tag: row.tag ?? (papers.length === 1 ? papers[0].language : undefined),
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
}

export function getNameChangeSelection(slugs: string[]) {
  const papers = getNewspapersBySlugs(slugs);
  if (papers.length === 0) return null;
  return {
    papers,
    label: papers.map((paper) => `${paper.name} (${paper.language})`).join(" + "),
    unit: papers.length <= 1 ? "Per ad" : papers.length === 2 ? "Both ads" : `${papers.length} ads`,
  };
}
