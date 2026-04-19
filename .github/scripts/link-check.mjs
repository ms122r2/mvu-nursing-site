import fs from "fs/promises";
import path from "path";

const manifest = JSON.parse(await fs.readFile("_data/manifest.json", "utf-8"));
const paths = new Set(manifest.pages.map((p) => p.path));
const broken = [];

for (const p of manifest.pages) {
  const jsonPath = path.join("_data/pages", p.file.replace(/\\.html$/, ".json"));
  let data;
  try { data = JSON.parse(await fs.readFile(jsonPath, "utf-8")); }
  catch { continue; }
  const str = JSON.stringify(data);
  const matches = [...str.matchAll(/"href"\\s*:\\s*"(\\/[^"#?]+)/g)];
  for (const m of matches) {
    const link = m[1];
    if (!paths.has(link) && !link.startsWith("/api") && !link.startsWith("/_next")) {
      broken.push({ page: p.path, link });
    }
  }
}

if (broken.length > 0) {
  console.error("Broken internal links:");
  console.error(JSON.stringify(broken, null, 2));
  process.exit(1);
}
console.log(\`All internal links resolve (checked \${manifest.pages.length} pages)\`);
