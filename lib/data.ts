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
    .sort((a, b) => (b.copies ?? 0) - (a.copies ?? 0))
    .slice(0, limit);
}

export function formatCopies(copies: number) {
  if (!copies || copies <= 0) return null;
  if (copies >= 100000) return `${(copies / 100000).toFixed(1)}L copies`;
  return `${copies.toLocaleString("en-IN")} copies`;
}

export function getLanguages() {
  return [...new Set(newspapers.map((n) => n.language))].sort();
}

export function getCities() {
  return [...new Set(newspapers.flatMap((n) => n.cities))].sort();
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
