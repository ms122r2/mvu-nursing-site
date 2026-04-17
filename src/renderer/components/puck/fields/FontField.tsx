import { createElement } from "react";
export function FontField() { return createElement("div"); }
export function getFontFamily(fontName: string): string | undefined {
  if (!fontName) return undefined;
  return `'${fontName}', sans-serif`;
}
export function getFontUrl(fontName: string): string | null {
  if (!fontName) return null;
  return `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
}
