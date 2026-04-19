import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

const baseUrl = process.argv[2];
if (!baseUrl) { console.error("Usage: visual-diff.mjs <base-url>"); process.exit(1); }

const manifest = JSON.parse(await fs.readFile("_data/manifest.json", "utf-8"));
const outDir = "visual-diff-artifacts";
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

for (const page of manifest.pages) {
  const url = baseUrl + (page.path === "/" ? "" : page.path);
  const p = await context.newPage();
  try {
    await p.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const slug = page.path.replace(/\//g, "_") || "home";
    await p.screenshot({ path: path.join(outDir, slug + ".png"), fullPage: true });
  } catch (err) {
    console.error("Failed:", url, err.message);
    process.exitCode = 1;
  } finally {
    await p.close();
  }
}

await browser.close();
console.log("Screenshots written to", outDir);
