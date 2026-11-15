import type { MetadataRoute } from "next";
import { getCategoryRoute } from "@/lib/category-routes";
import {
  getCategoriesOrdered,
  getNameChangeCities,
  getNewspapers,
  slugifyCity,
} from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Legal/utility pages change rarely — don't tell search engines they are "modified" on every build.
  const LEGAL_UPDATED = new Date("2026-11-01T00:00:00.000Z");
  const staticPaths = [
    "",
    "/newspaper-classified",
    "/newspapers",
    "/categories",
    "/change-my-name",
    "/matrimonial",
    "/tender-notice",
    "/recruitment",
    "/obituary",
    "/property",
    "/lost-and-found",
    "/about",
    "/contact",
    "/sitemap",
    "/terms",
    "/refund",
    "/privacy",
    "/disclaimer",
  ];
  const isLegalPath = (path: string) =>
    ["/terms", "/refund", "/privacy", "/disclaimer", "/sitemap"].includes(path);

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: isLegalPath(path) ? LEGAL_UPDATED : now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority:
      path === ""
        ? 1
        : path === "/newspaper-classified"
          ? 0.96
          : path === "/change-my-name" || path === "/matrimonial" || path === "/tender-notice" || path === "/recruitment" || path === "/obituary" || path === "/property" || path === "/lost-and-found"
            ? 0.94
            : path === "/newspapers" || path === "/categories" || path === "/contact"
              ? 0.9
              : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategoriesOrdered()
    .filter((cat) => !getCategoryRoute(cat.slug))
    .map((cat) => ({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  const newspaperEntries: MetadataRoute.Sitemap = getNewspapers().map((paper) => ({
    url: `${SITE_URL}/newspapers/${paper.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const nameChangeCityEntries: MetadataRoute.Sitemap = getNameChangeCities().map((city) => ({
    url: `${SITE_URL}/name-change/${slugifyCity(city)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const classifiedCityEntries: MetadataRoute.Sitemap = getNameChangeCities().map((city) => ({
    url: `${SITE_URL}/newspaper-classified/${slugifyCity(city)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.78,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...newspaperEntries,
    ...nameChangeCityEntries,
    ...classifiedCityEntries,
  ];
}
