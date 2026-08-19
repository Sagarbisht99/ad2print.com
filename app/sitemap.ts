import type { MetadataRoute } from "next";
import { getCategories, getNewspapers } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/categories",
    "/newspapers",
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
    priority: path === "" ? 1 : path === "/contact" || path === "/categories" ? 0.9 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories().map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const newspaperEntries: MetadataRoute.Sitemap = getNewspapers().map((paper) => ({
    url: `${SITE_URL}/newspapers/${paper.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticEntries, ...categoryEntries, ...newspaperEntries];
}
