import fs from "fs/promises";
import path from "path";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let sitemap;
  try {
    const config = JSON.parse(await fs.readFile(path.join(process.cwd(), "_data/config.json"), "utf-8"));
    if (config.siteDomain) sitemap = `https://${config.siteDomain}/sitemap.xml`;
  } catch {}
  return { rules: [{ userAgent: "*", allow: "/" }], ...(sitemap ? { sitemap } : {}) };
}
