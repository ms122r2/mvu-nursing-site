"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import {
  animationVariants,
  animationVariantOptions,
  getMotionProps,
  type AnimationVariant,
} from "../../../lib/motion/variants";
import { AssetField } from "../fields/AssetField";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type ImageBlockProps = {
  src: string;
  alt: string;
  caption: string;
  width: "full" | "wide" | "medium";
  rounded: boolean;
  shadow: boolean;
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const imageBlockConfig: ComponentConfig<ImageBlockProps> = {
  label: "Image",
  fields: {
    src: {
      type: "custom",
      label: "Image",
      render: AssetField,
    },
    alt: { type: "text", label: "Alt Text" },
    caption: { type: "richtext", label: "Caption", contentEditable: true },
    width: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Full Width", value: "full" },
        { label: "Wide", value: "wide" },
        { label: "Medium", value: "medium" },
      ],
    },
    rounded: {
      type: "radio",
      label: "Rounded Corners",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    shadow: {
      type: "radio",
      label: "Shadow",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    animationVariant: {
      type: "select",
      label: "Animation",
      options: animationVariantOptions,
    },
    ...animationEnhancedFields,
    ...scrollFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    src: "",
    alt: "",
    caption: "",
    width: "wide",
    rounded: true,
    shadow: true,
    animationVariant: "fadeUp",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: ImageBlock,
};

const widthClasses = {
  full: "max-w-full",
  wide: "max-w-5xl",
  medium: "max-w-3xl",
};

export function ImageBlock(allProps: ImageBlockProps) {
  const { src, alt, caption, width, rounded, shadow, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="px-6 py-8">
      <m.figure
        className={`mx-auto ${widthClasses[width]}`}
        variants={animationVariants[variant]}
        {...mp}
        transition={transition}
        {...scrollMotion}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`w-full ${rounded ? "rounded-xl" : ""} ${shadow ? "shadow-lg" : ""}`}
          />
        ) : (
          <div
            className={`flex aspect-video items-center justify-center bg-slate-100 text-slate-400 ${rounded ? "rounded-xl" : ""}`}
          >
            No image set
          </div>
        )}
        {(caption || puck?.isEditing) && (
          <figcaption className="mt-3 text-center">
            <span
              className="text-sm text-slate-500"
            >{caption}</span>
          </figcaption>
        )}
      </m.figure>
    </section>
    </StyleWrapper>
  );
}
