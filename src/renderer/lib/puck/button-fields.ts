/**
 * Shared button style fields for CTA components.
 */

import { ColorField } from "../../components/puck/fields/ColorField";
import { SectionDivider } from "../../components/puck/fields/SectionDivider";

export const buttonFields = {
  _sectionButton: {
    type: "custom" as const,
    label: "Button Style",
    render: SectionDivider,
  },
  _btnSize: {
    type: "select" as const,
    label: "Button Size",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
  },
  _btnVariant: {
    type: "select" as const,
    label: "Button Style",
    options: [
      { label: "Solid", value: "solid" },
      { label: "Outline", value: "outline" },
      { label: "Ghost", value: "ghost" },
      { label: "Link", value: "link" },
    ],
  },
  _btnColor: {
    type: "custom" as const,
    label: "Button Color",
    render: ColorField,
  },
  _btnRadius: {
    type: "select" as const,
    label: "Button Radius",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Full (pill)", value: "full" },
    ],
  },
  _btnHoverColor: {
    type: "custom" as const,
    label: "Button Hover Color",
    render: ColorField,
  },
  _btnHoverScale: {
    type: "select" as const,
    label: "Hover Scale",
    options: [
      { label: "None", value: "1" },
      { label: "Subtle (1.02)", value: "1.02" },
      { label: "Medium (1.05)", value: "1.05" },
      { label: "Large (1.08)", value: "1.08" },
    ],
  },
  _btnMagnetic: {
    type: "select" as const,
    label: "Magnetic Hover",
    options: [
      { label: "Off", value: "off" },
      { label: "Subtle", value: "subtle" },
      { label: "Medium", value: "medium" },
      { label: "Strong", value: "strong" },
    ],
  },
};

export const buttonDefaults = {
  _btnSize: "md",
  _btnVariant: "solid",
  _btnColor: "#4f46e5",
  _btnRadius: "md",
  _btnHoverColor: "",
  _btnHoverScale: "1.02",
  _btnMagnetic: "off",
};

export type ButtonStyleProps = typeof buttonDefaults;
