import fs from "fs/promises";
import path from "path";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const manifest = JSON.parse(
      await fs.readFile(path.join(process.cwd(), "_data/manifest.json"), "utf-8")
    );
    const config = JSON.parse(
      await fs.readFile(path.join(process.cwd(), "_data/config.json"), "utf-8")
    );
    const domain = config.siteDomain || "";
    if (!domain) return [];

    return manifest.pages.map((p: { path: string; publishedAt?: string }) => ({
      url: `https://${domain}${p.path === "/" ? "" : p.path}`,
      lastModified: p.publishedAt || new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: p.path === "/" ? 1 : 0.8,
    }));
  } catch {
    return [];
  }
}
