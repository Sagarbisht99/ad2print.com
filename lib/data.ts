import categories from "@/data/categories.json";
import newspapers from "@/data/newspapers.json";

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

export function getCities() {
  return [...new Set(newspapers.flatMap((n) => n.cities))].sort();
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

export function getNameChangeSelection(slugs: string[]) {
  const papers = getNewspapersBySlugs(slugs);
  if (papers.length === 0) return null;
  const combo = papers.length > 1;
  return {
    papers,
    label: papers.map((paper) => `${paper.name} (${paper.language})`).join(" + "),
    unit: combo ? "Both ads" : "Per ad",
  };
}
