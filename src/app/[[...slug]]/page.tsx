import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { PuckRenderer } from "@ms122r2/puck-renderer";
import type { Data } from "@ms122r2/puck-renderer";

interface Manifest {
  pages: Array<{
    id: string;
    slug: string;
    path: string;
    file: string;
    title: string;
  }>;
}

async function readManifest(): Promise<Manifest> {
  const raw = await fs.readFile(
    path.join(process.cwd(), "_data/manifest.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

async function readPageData(filePath: string): Promise<Data> {
  const jsonPath = filePath.replace(/\.html$/, ".json");
  const dataPath = path.join(process.cwd(), "_data/pages", jsonPath);
  const raw = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function generateStaticParams() {
  try {
    const manifest = await readManifest();
    return manifest.pages.map((p) => ({
      slug: p.path === "/" ? [] : p.path.slice(1).split("/"),
    }));
  } catch {
    return [{ slug: [] }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const urlPath = "/" + (slug ?? []).join("/");
  try {
    const manifest = await readManifest();
    const entry = manifest.pages.find(
      (p) => p.path === urlPath || (urlPath === "/" && p.path === "/")
    );
    if (!entry) return {};
    const data = await readPageData(entry.file);
    const rootProps = (data.root as Record<string, unknown>)?.props as
      | Record<string, string>
      | undefined;
    const config = JSON.parse(await fs.readFile(path.join(process.cwd(), "_data/config.json"), "utf-8"));
    const siteDomain = config.siteDomain || "";
    const canonicalUrl = siteDomain ? `https://${siteDomain}${entry.path === "/" ? "" : entry.path}` : undefined;
    const title = rootProps?.title || entry.title;
    const description = rootProps?.description || undefined;

    return {
      title,
      description,
      ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
      openGraph: {
        title,
        description,
        type: "website",
        ...(canonicalUrl ? { url: canonicalUrl } : {}),
        ...(rootProps?.ogImage ? { images: [{ url: rootProps.ogImage }] } : {}),
      },
      twitter: {
        card: rootProps?.ogImage ? "summary_large_image" : "summary",
        title,
        description,
        ...(rootProps?.ogImage ? { images: [rootProps.ogImage] } : {}),
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const urlPath = "/" + (slug ?? []).join("/");

  let manifest: Manifest;
  try {
    manifest = await readManifest();
  } catch {
    return notFound();
  }

  const entry = manifest.pages.find(
    (p) => p.path === urlPath || (urlPath === "/" && p.path === "/")
  );
  if (!entry) return notFound();

  let data: Data;
  try {
    data = await readPageData(entry.file);
  } catch {
    return notFound();
  }

  return <PuckRenderer data={data} />;
}
