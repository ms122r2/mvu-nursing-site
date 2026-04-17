/**
 * Shared background fields for container components.
 * Supports: solid color, image, gradient, overlay.
 */

import { AssetField } from "../../components/puck/fields/AssetField";
import { ColorField } from "../../components/puck/fields/ColorField";
import { SectionDivider } from "../../components/puck/fields/SectionDivider";

export const backgroundFields = {
  _sectionBackground: {
    type: "custom" as const,
    label: "Background",
    render: SectionDivider,
  },
  _bgColor: {
    type: "custom" as const,
    label: "Background Color",
    render: ColorField,
  },
  _bgImage: {
    type: "custom" as const,
    label: "Background Image",
    render: AssetField,
  },
  _bgImagePosition: {
    type: "select" as const,
    label: "Image Position",
    options: [
      { label: "Center", value: "center" },
      { label: "Top", value: "top" },
      { label: "Bottom", value: "bottom" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },
  _bgImageSize: {
    type: "select" as const,
    label: "Image Size",
    options: [
      { label: "Cover", value: "cover" },
      { label: "Contain", value: "contain" },
      { label: "Auto", value: "auto" },
    ],
  },
  _bgOverlayColor: {
    type: "custom" as const,
    label: "Overlay Color",
    render: ColorField,
  },
  _bgOverlayOpacity: {
    type: "select" as const,
    label: "Overlay Opacity",
    options: [
      { label: "None", value: "0" },
      { label: "10%", value: "10" },
      { label: "20%", value: "20" },
      { label: "30%", value: "30" },
      { label: "40%", value: "40" },
      { label: "50%", value: "50" },
      { label: "60%", value: "60" },
      { label: "70%", value: "70" },
      { label: "80%", value: "80" },
      { label: "90%", value: "90" },
    ],
  },
  _bgGradient: {
    type: "select" as const,
    label: "Gradient",
    options: [
      { label: "None", value: "none" },
      { label: "To Right", value: "to-r" },
      { label: "To Bottom", value: "to-b" },
      { label: "To Bottom Right", value: "to-br" },
      { label: "To Top", value: "to-t" },
    ],
  },
  _bgGradientFrom: {
    type: "custom" as const,
    label: "Gradient From",
    render: ColorField,
  },
  _bgGradientTo: {
    type: "custom" as const,
    label: "Gradient To",
    render: ColorField,
  },
};

export const backgroundDefaults = {
  _bgColor: "",
  _bgImage: "",
  _bgImagePosition: "center",
  _bgImageSize: "cover",
  _bgOverlayColor: "#000000",
  _bgOverlayOpacity: "0",
  _bgGradient: "none",
  _bgGradientFrom: "",
  _bgGradientTo: "",
};

export type BackgroundProps = typeof backgroundDefaults;
