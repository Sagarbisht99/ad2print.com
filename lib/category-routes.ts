/**
 * Some categories have a dedicated, conversion-focused landing page in
 * addition to the generic /categories/[slug] page. This file keeps the links
 * consistent everywhere the category is listed.
 */

export type CategoryRoute = {
  href: string;
  label: string;
};

const CATEGORY_ROUTE_OVERRIDES: Record<string, CategoryRoute> = {
  matrimonial: {
    href: "/matrimonial",
    label: "Compare matrimonial packages",
  },
  "change-of-name": {
    href: "/change-my-name",
    label: "Start a name-change notice",
  },
  "court-notice": {
    href: "/tender-notice",
    label: "Compare tender & court notice rates",
  },
};

export function getCategoryRoute(slug: string): CategoryRoute | undefined {
  return CATEGORY_ROUTE_OVERRIDES[slug];
}

export function getCategoryHref(slug: string) {
  return CATEGORY_ROUTE_OVERRIDES[slug]?.href ?? `/categories/${slug}`;
}
