/**
 * Universal style fields for all Puck components.
 * Spread into any component's fields config: { ...styleFields }
 * Then wrap the component's render output: <StyleWrapper {...styleProps}>...</StyleWrapper>
 */

import { SectionDivider } from "../../components/puck/fields/SectionDivider";
import { StylePresetsField } from "../../components/puck/fields/StylePresetsField";

export const styleFields = {
  _stylePresets: {
    type: "custom" as const,
    label: "",
    render: StylePresetsField,
  },
  _sectionSpacing: {
    type: "custom" as const,
    label: "Spacing & Layout",
    render: SectionDivider,
  },
  _paddingTop: {
    type: "select" as const,
    label: "Padding Top",
    options: [
      { label: "None", value: "0" },
      { label: "XS (4px)", value: "1" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
      { label: "2XL (64px)", value: "16" },
      { label: "3XL (96px)", value: "24" },
    ],
  },
  _paddingBottom: {
    type: "select" as const,
    label: "Padding Bottom",
    options: [
      { label: "None", value: "0" },
      { label: "XS (4px)", value: "1" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
      { label: "2XL (64px)", value: "16" },
      { label: "3XL (96px)", value: "24" },
    ],
  },
  _paddingX: {
    type: "select" as const,
    label: "Padding Horizontal",
    options: [
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
    ],
  },
  _marginTop: {
    type: "select" as const,
    label: "Margin Top",
    options: [
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
      { label: "2XL (64px)", value: "16" },
      { label: "Auto", value: "auto" },
    ],
  },
  _marginBottom: {
    type: "select" as const,
    label: "Margin Bottom",
    options: [
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
      { label: "2XL (64px)", value: "16" },
      { label: "Auto", value: "auto" },
    ],
  },
  _sectionAppearance: {
    type: "custom" as const,
    label: "Appearance",
    render: SectionDivider,
  },
  _borderRadius: {
    type: "select" as const,
    label: "Border Radius",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
      { label: "XL", value: "xl" },
      { label: "2XL", value: "2xl" },
      { label: "Full", value: "full" },
    ],
  },
  _shadow: {
    type: "select" as const,
    label: "Shadow",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
      { label: "XL", value: "xl" },
      { label: "2XL", value: "2xl" },
    ],
  },
  _opacity: {
    type: "select" as const,
    label: "Opacity",
    options: [
      { label: "100%", value: "100" },
      { label: "90%", value: "90" },
      { label: "80%", value: "80" },
      { label: "70%", value: "70" },
      { label: "50%", value: "50" },
      { label: "30%", value: "30" },
      { label: "0%", value: "0" },
    ],
  },
  _sectionVisibility: {
    type: "custom" as const,
    label: "Visibility",
    render: SectionDivider,
  },
  _hideOnMobile: {
    type: "radio" as const,
    label: "Hide on Mobile",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
  },
  _hideOnDesktop: {
    type: "radio" as const,
    label: "Hide on Desktop",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
  },

  // ── Responsive overrides ──────────────────────────────────────────────
  // Empty string = inherit from base (desktop) value. Any other value
  // takes effect only at the target breakpoint via a scoped media query
  // emitted by StyleWrapper.
  _sectionResponsiveTablet: {
    type: "custom" as const,
    label: "Tablet Overrides (≤1023px)",
    render: SectionDivider,
  },
  _paddingTop_tablet: {
    type: "select" as const,
    label: "Padding Top — Tablet",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "XS (4px)", value: "1" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
      { label: "2XL (64px)", value: "16" },
    ],
  },
  _paddingBottom_tablet: {
    type: "select" as const,
    label: "Padding Bottom — Tablet",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "XS (4px)", value: "1" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
      { label: "2XL (64px)", value: "16" },
    ],
  },
  _paddingX_tablet: {
    type: "select" as const,
    label: "Padding Horizontal — Tablet",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
    ],
  },
  _marginTop_tablet: {
    type: "select" as const,
    label: "Margin Top — Tablet",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "Auto", value: "auto" },
    ],
  },
  _marginBottom_tablet: {
    type: "select" as const,
    label: "Margin Bottom — Tablet",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "Auto", value: "auto" },
    ],
  },
  _sectionResponsiveMobile: {
    type: "custom" as const,
    label: "Mobile Overrides (≤767px)",
    render: SectionDivider,
  },
  _paddingTop_mobile: {
    type: "select" as const,
    label: "Padding Top — Mobile",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "XS (4px)", value: "1" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
    ],
  },
  _paddingBottom_mobile: {
    type: "select" as const,
    label: "Padding Bottom — Mobile",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "XS (4px)", value: "1" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "LG (24px)", value: "6" },
      { label: "XL (48px)", value: "12" },
    ],
  },
  _paddingX_mobile: {
    type: "select" as const,
    label: "Padding Horizontal — Mobile",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
    ],
  },
  _marginTop_mobile: {
    type: "select" as const,
    label: "Margin Top — Mobile",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "Auto", value: "auto" },
    ],
  },
  _marginBottom_mobile: {
    type: "select" as const,
    label: "Margin Bottom — Mobile",
    options: [
      { label: "Inherit", value: "" },
      { label: "None", value: "0" },
      { label: "SM (8px)", value: "2" },
      { label: "MD (16px)", value: "4" },
      { label: "Auto", value: "auto" },
    ],
  },
};

export const styleDefaults = {
  _paddingTop: "",
  _paddingBottom: "",
  _paddingX: "",
  _marginTop: "",
  _marginBottom: "",
  _borderRadius: "none",
  _shadow: "none",
  _opacity: "100",
  _hideOnMobile: false,
  _hideOnDesktop: false,
  _paddingTop_tablet: "",
  _paddingBottom_tablet: "",
  _paddingX_tablet: "",
  _marginTop_tablet: "",
  _marginBottom_tablet: "",
  _paddingTop_mobile: "",
  _paddingBottom_mobile: "",
  _paddingX_mobile: "",
  _marginTop_mobile: "",
  _marginBottom_mobile: "",
};

export type StyleProps = typeof styleDefaults;
