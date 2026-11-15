import type { MetadataRoute } from "next";
import { getCategoryRoute } from "@/lib/category-routes";
import {
  getCategories,
  getNameChangeCities,
  getNewspapers,
  slugifyCity,
} from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/newspaper-classified",
    "/newspapers",
    "/categories",
    "/change-my-name",
    "/matrimonial",
    "/tender-notice",
    "/about",
    "/contact",
    "/sitemap",
    "/terms",
    "/refund",
    "/privacy",
    "/disclaimer",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority:
      path === ""
        ? 1
        : path === "/newspaper-classified"
          ? 0.96
          : path === "/change-my-name" || path === "/matrimonial" || path === "/tender-notice"
            ? 0.94
            : path === "/newspapers" || path === "/categories" || path === "/contact"
              ? 0.9
              : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories()
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

  return [
    ...staticEntries,
    ...categoryEntries,
    ...newspaperEntries,
    ...nameChangeCityEntries,
  ];
}
