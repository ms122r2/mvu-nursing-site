/**
 * Responsive/breakpoint override fields.
 * Adds mobile-specific overrides for key visual properties.
 *
 * These use CSS classes that apply at specific breakpoints,
 * layered on top of the base style fields.
 */

import { SectionDivider } from "../../components/puck/fields/SectionDivider";

export const responsiveFields = {
  _sectionResponsive: {
    type: "custom" as const,
    label: "Mobile Overrides",
    render: SectionDivider,
  },
  _mobileTextAlign: {
    type: "select" as const,
    label: "Mobile Text Align",
    options: [
      { label: "Default (inherit)", value: "" },
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ],
  },
  _mobileColumns: {
    type: "select" as const,
    label: "Mobile Columns",
    options: [
      { label: "Default (stack)", value: "" },
      { label: "1 column", value: "1" },
      { label: "2 columns", value: "2" },
    ],
  },
  _mobilePaddingY: {
    type: "select" as const,
    label: "Mobile Vertical Padding",
    options: [
      { label: "Default (inherit)", value: "" },
      { label: "None", value: "0" },
      { label: "Small", value: "2" },
      { label: "Medium", value: "4" },
      { label: "Large", value: "8" },
    ],
  },
  _mobileHeadingSize: {
    type: "select" as const,
    label: "Mobile Heading Size",
    options: [
      { label: "Default (inherit)", value: "" },
      { label: "Small (lg)", value: "lg" },
      { label: "Medium (xl)", value: "xl" },
      { label: "Large (2xl)", value: "2xl" },
      { label: "XL (3xl)", value: "3xl" },
    ],
  },
};

export const responsiveDefaults = {
  _mobileTextAlign: "",
  _mobileColumns: "",
  _mobilePaddingY: "",
  _mobileHeadingSize: "",
};

export type ResponsiveProps = typeof responsiveDefaults;

const paddingMap: Record<string, string> = {
  "0": "0px",
  "2": "8px",
  "4": "16px",
  "8": "32px",
};

const headingSizeMap: Record<string, string> = {
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
};

/**
 * Generate a <style> tag with media-query overrides for a component.
 * Uses a unique selector based on the component's DOM ID.
 */
export function getResponsiveStyles(
  containerId: string,
  props: ResponsiveProps
): string | null {
  const rules: string[] = [];

  if (props._mobileTextAlign) {
    rules.push(`text-align: ${props._mobileTextAlign};`);
  }
  if (props._mobilePaddingY) {
    const val = paddingMap[props._mobilePaddingY] ?? "0px";
    rules.push(`padding-top: ${val}; padding-bottom: ${val};`);
  }
  if (props._mobileHeadingSize) {
    const val = headingSizeMap[props._mobileHeadingSize];
    if (val) rules.push(`& h1, & h2, & h3, & [class*="font-bold"] { font-size: ${val}; }`);
  }
  if (props._mobileColumns) {
    const cols = props._mobileColumns;
    rules.push(`& [class*="grid"] { grid-template-columns: repeat(${cols}, 1fr); }`);
  }

  if (rules.length === 0) return null;

  return `@media (max-width: 767px) { [data-responsive-id="${containerId}"] { ${rules.join(" ")} } }`;
}

export function extractResponsiveProps(
  props: Record<string, unknown>
): ResponsiveProps {
  return {
    _mobileTextAlign: (props._mobileTextAlign as string) ?? "",
    _mobileColumns: (props._mobileColumns as string) ?? "",
    _mobilePaddingY: (props._mobilePaddingY as string) ?? "",
    _mobileHeadingSize: (props._mobileHeadingSize as string) ?? "",
  };
}