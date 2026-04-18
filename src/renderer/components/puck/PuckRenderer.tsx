"use client";

import { useMemo } from "react";
import { Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import type { Data } from "@puckeditor/core";
import { puckConfig } from "../../config";
import {
  getResponsiveStyles,
  extractResponsiveProps,
} from "../../lib/puck/responsive-fields";

function getFontUrl(fontName: string): string | null {
  if (!fontName) return null;
  return `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
}

function extractFonts(data: Data): string[] {
  const fonts = new Set<string>();
  const rootProps = (data.root as Record<string, unknown>)?.props as
    | Record<string, string>
    | undefined;
  if (rootProps?.headingFont) fonts.add(rootProps.headingFont);
  if (rootProps?.bodyFont) fonts.add(rootProps.bodyFont);
  for (const item of data.content ?? []) {
    const props = item.props as Record<string, unknown>;
    if (typeof props._headingFont === "string" && props._headingFont) {
      fonts.add(props._headingFont);
    }
  }
  return Array.from(fonts);
}

function extractResponsiveCSS(data: Data): string {
  const rules: string[] = [];
  for (const item of data.content ?? []) {
    const props = item.props as Record<string, unknown>;
    const id = props.id as string;
    if (!id) continue;
    const responsive = extractResponsiveProps(props);
    const css = getResponsiveStyles(id, responsive);
    if (css) rules.push(css);
  }
  return rules.join("\n");
}

export function PuckRenderer({ data }: { data: Data }) {
  const fonts = useMemo(() => extractFonts(data), [data]);
  const responsiveCSS = useMemo(() => extractResponsiveCSS(data), [data]);

  return (
    <>
      {fonts.map((font) => {
        const url = getFontUrl(font);
        return url ? (
          <link key={font} rel="stylesheet" href={url} />
        ) : null;
      })}
      {responsiveCSS && <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />}
      <Render config={puckConfig} data={data} />
    </>
  );
}
