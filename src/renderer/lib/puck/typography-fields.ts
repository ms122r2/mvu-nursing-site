/**
 * Shared typography fields for heading components.
 * Spread into any component: { ...typographyFields }
 * Apply via: <HeadingWrapper {...typographyProps}>content</HeadingWrapper>
 */

import { ColorField } from "../../components/puck/fields/ColorField";
import { FontField, getFontFamily } from "../../components/puck/fields/FontField";
import { SectionDivider } from "../../components/puck/fields/SectionDivider";
import { AiWriteField } from "../../components/puck/fields/AiWriteField";

export const typographyFields = {
  _aiWriter: {
    type: "custom" as const,
    label: "✨ AI Content Writer",
    render: AiWriteField,
  },
  _sectionTypography: {
    type: "custom" as const,
    label: "Typography",
    render: SectionDivider,
  },
  _headingFont: {
    type: "custom" as const,
    label: "Heading Font",
    render: FontField,
  },
  _headingSize: {
    type: "select" as const,
    label: "Heading Size",
    options: [
      { label: "Small (xl)", value: "xl" },
      { label: "Medium (2xl)", value: "2xl" },
      { label: "Large (3xl)", value: "3xl" },
      { label: "XL (4xl)", value: "4xl" },
      { label: "2XL (5xl)", value: "5xl" },
      { label: "Display (6xl)", value: "6xl" },
    ],
  },
  _headingWeight: {
    type: "select" as const,
    label: "Heading Weight",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Medium", value: "medium" },
      { label: "Semibold", value: "semibold" },
      { label: "Bold", value: "bold" },
      { label: "Extra Bold", value: "extrabold" },
    ],
  },
  _headingColor: {
    type: "custom" as const,
    label: "Heading Color",
    render: ColorField,
  },
  _bodySize: {
    type: "select" as const,
    label: "Body Text Size",
    options: [
      { label: "Small (sm)", value: "sm" },
      { label: "Base", value: "base" },
      { label: "Large (lg)", value: "lg" },
      { label: "XL", value: "xl" },
    ],
  },
  _letterSpacing: {
    type: "select" as const,
    label: "Letter Spacing",
    options: [
      { label: "Default", value: "" },
      { label: "Tight", value: "tight" },
      { label: "Normal", value: "normal" },
      { label: "Wide", value: "wide" },
    ],
  },
  _lineHeight: {
    type: "select" as const,
    label: "Line Height",
    options: [
      { label: "Default", value: "" },
      { label: "Tight (1.25)", value: "tight" },
      { label: "Normal (1.5)", value: "normal" },
      { label: "Relaxed (1.75)", value: "relaxed" },
      { label: "Loose (2)", value: "loose" },
    ],
  },
  _textTransform: {
    type: "select" as const,
    label: "Text Transform",
    options: [
      { label: "Default", value: "" },
      { label: "Uppercase", value: "uppercase" },
      { label: "Lowercase", value: "lowercase" },
      { label: "Capitalize", value: "capitalize" },
    ],
  },
};

export const typographyDefaults = {
  _headingFont: "",
  _headingSize: "",
  _headingWeight: "",
  _headingColor: "",
  _bodySize: "",
  _letterSpacing: "",
  _lineHeight: "",
  _textTransform: "",
};

export type TypographyProps = typeof typographyDefaults;

const sizeClasses: Record<string, string> = {
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
};

const weightClasses: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const bodySizeClasses: Record<string, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

/**
 * Get Tailwind classes for heading typography overrides.
 * Returns empty string if no overrides set (component uses its own defaults).
 */
const letterSpacingClasses: Record<string, string> = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
};

const lineHeightClasses: Record<string, string> = {
  tight: "leading-tight",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

export function getHeadingClasses(props: TypographyProps): string {
  const classes: string[] = [];
  if (props._headingSize && sizeClasses[props._headingSize])
    classes.push(sizeClasses[props._headingSize]);
  if (props._headingWeight && weightClasses[props._headingWeight])
    classes.push(weightClasses[props._headingWeight]);
  if (props._letterSpacing && letterSpacingClasses[props._letterSpacing])
    classes.push(letterSpacingClasses[props._letterSpacing]);
  if (props._lineHeight && lineHeightClasses[props._lineHeight])
    classes.push(lineHeightClasses[props._lineHeight]);
  if (props._textTransform) classes.push(props._textTransform);
  return classes.join(" ");
}

export function getHeadingStyle(props: TypographyProps): React.CSSProperties | undefined {
  const style: React.CSSProperties = {};
  if (props._headingColor) style.color = props._headingColor;
  if (props._headingFont) style.fontFamily = getFontFamily(props._headingFont);
  return Object.keys(style).length > 0 ? style : undefined;
}

export function getBodyClasses(props: TypographyProps): string {
  if (props._bodySize && bodySizeClasses[props._bodySize])
    return bodySizeClasses[props._bodySize];
  return "";
}

export function extractTypographyProps(
  props: Record<string, unknown>
): TypographyProps {
  return {
    _headingFont: (props._headingFont as string) ?? "",
    _headingSize: (props._headingSize as string) ?? "",
    _headingWeight: (props._headingWeight as string) ?? "",
    _headingColor: (props._headingColor as string) ?? "",
    _bodySize: (props._bodySize as string) ?? "",
    _letterSpacing: (props._letterSpacing as string) ?? "",
    _lineHeight: (props._lineHeight as string) ?? "",
    _textTransform: (props._textTransform as string) ?? "",
  };
}