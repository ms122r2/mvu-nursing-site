"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";
import { ColorField } from "../fields/ColorField";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import {
  animationVariants,
  animationVariantOptions,
  getMotionProps,
  type AnimationVariant,
} from "../../../lib/motion/variants";
import {
  animationEnhancedFields,
  animationEnhancedDefaults,
  getTransition,
  extractAnimationEnhancedProps,
} from "../../../lib/puck/animation-fields";

type SectionProps = {
  backgroundColor: "white" | "gray" | "dark" | "brand" | "custom";
  customBgColor: string;
  paddingY: "none" | "sm" | "md" | "lg" | "xl";
  paddingX: "none" | "sm" | "md";
  maxWidth: "full" | "7xl" | "6xl" | "5xl" | "4xl" | "3xl";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const sectionConfig: ComponentConfig<SectionProps> = {
  label: "Section",
  fields: {
    backgroundColor: {
      type: "select",
      label: "Background",
      options: [
        { label: "White", value: "white" },
        { label: "Light Gray", value: "gray" },
        { label: "Dark", value: "dark" },
        { label: "Brand", value: "brand" },
        { label: "Custom", value: "custom" },
      ],
    },
    customBgColor: {
      type: "custom",
      label: "Custom Background Color",
      render: ColorField,
    },
    paddingY: {
      type: "select",
      label: "Vertical Padding",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ],
    },
    paddingX: {
      type: "select",
      label: "Horizontal Padding",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
      ],
    },
    maxWidth: {
      type: "select",
      label: "Max Width",
      options: [
        { label: "Full Width", value: "full" },
        { label: "7xl (1280px)", value: "7xl" },
        { label: "6xl (1152px)", value: "6xl" },
        { label: "5xl (1024px)", value: "5xl" },
        { label: "4xl (896px)", value: "4xl" },
        { label: "3xl (768px)", value: "3xl" },
      ],
    },
    animationVariant: {
      type: "select",
      label: "Animation",
      options: animationVariantOptions,
    },
    ...animationEnhancedFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    backgroundColor: "white",
    customBgColor: "",
    paddingY: "lg",
    paddingX: "md",
    maxWidth: "6xl",
    animationVariant: "fadeIn",
    ...animationEnhancedDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: Section,
};

const bgClasses: Record<string, string> = {
  white: "bg-white",
  gray: "bg-slate-50",
  dark: "bg-slate-900 text-white",
  brand: "bg-indigo-600 text-white",
  custom: "",
};

const pyClasses: Record<string, string> = {
  none: "",
  sm: "py-6",
  md: "py-12",
  lg: "py-16",
  xl: "py-24",
};

const pxClasses: Record<string, string> = {
  none: "",
  sm: "px-4",
  md: "px-6",
};

const maxWidthClasses: Record<string, string> = {
  full: "",
  "7xl": "max-w-7xl",
  "6xl": "max-w-6xl",
  "5xl": "max-w-5xl",
  "4xl": "max-w-4xl",
  "3xl": "max-w-3xl",
};

export function Section(allProps: SectionProps) {
  const { backgroundColor, customBgColor, paddingY, paddingX, maxWidth, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const transition = getTransition(
    extractAnimationEnhancedProps(rest as Record<string, unknown>)
  );

  const bgStyle =
    backgroundColor === "custom" && customBgColor
      ? { backgroundColor: customBgColor }
      : undefined;

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <m.section
        className={`${bgClasses[backgroundColor]} ${pyClasses[paddingY]} ${pxClasses[paddingX]}`}
        style={bgStyle}
        variants={animationVariants[variant]}
        {...mp}
        transition={transition}
      >
        <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
          <DropZone zone="content" />
        </div>
      </m.section>
    </StyleWrapper>
  );
}
