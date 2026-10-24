import type { MetadataRoute } from "next";
import { getCategories, getNameChangeCities, slugifyCity } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/categories",
    "/about",
    "/contact",
    "/sitemap",
    "/terms",
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
        : path === "/contact" || path === "/categories"
          ? 0.9
          : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories().map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const nameChangeCityEntries: MetadataRoute.Sitemap = getNameChangeCities().map((city) => ({
    url: `${SITE_URL}/name-change/${slugifyCity(city)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticEntries, ...categoryEntries, ...nameChangeCityEntries];
}
