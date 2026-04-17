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
import { typographyFields, typographyDefaults, getHeadingClasses, getHeadingStyle, getBodyClasses, extractTypographyProps } from "../../../lib/puck/typography-fields";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { hoverFields, hoverDefaults, getHoverAnimation, getTapAnimation, getFocusAnimation, extractInteractionProps } from "../../../lib/puck/hover-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type ContentBlockProps = {
  heading: string;
  body: string;
  image: string;
  imagePosition: "left" | "right" | "none";
  backgroundColor: "white" | "gray" | "dark";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const contentBlockConfig: ComponentConfig<ContentBlockProps> = {
  label: "Content Block",
  fields: {
    heading: {
      type: "richtext",
      label: "Heading",
      contentEditable: true,
    },
    body: {
      type: "richtext",
      label: "Body Text",
      contentEditable: true,
    },
    image: {
      type: "custom",
      label: "Image",
      render: AssetField,
    },
    imagePosition: {
      type: "radio",
      label: "Image Position",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
        { label: "No Image", value: "none" },
      ],
    },
    backgroundColor: {
      type: "select",
      label: "Background",
      options: [
        { label: "White", value: "white" },
        { label: "Light Gray", value: "gray" },
        { label: "Dark", value: "dark" },
      ],
    },
    animationVariant: {
      type: "select",
      label: "Animation",
      options: animationVariantOptions,
    },
    ...animationEnhancedFields,
    ...scrollFields,
    ...typographyFields,
    ...hoverFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Section Heading",
    body: "Add your content here. This block supports text alongside an optional image.",
    image: "",
    imagePosition: "right",
    backgroundColor: "white",
    animationVariant: "fadeUp",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...hoverDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: ContentBlock,
};

const bgClasses = {
  white: "bg-white text-slate-900",
  gray: "bg-slate-50 text-slate-900",
  dark: "bg-slate-900 text-white",
};

export function ContentBlock(allProps: ContentBlockProps) {
  const { heading, body, image, imagePosition, backgroundColor, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const variants = animationVariants[variant];
  const mp = getMotionProps(puck?.isEditing);
  const showImage = imagePosition !== "none" && image;
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const bodyExtra = getBodyClasses(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));
  const interaction = extractInteractionProps(rest as Record<string, unknown>);
  const hoverAnim = getHoverAnimation(interaction._hoverEffect);
  const tapAnim = getTapAnimation(interaction._tapScale);
  const focusAnim = getFocusAnimation(interaction._focusRing, interaction._hoverEffect);

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className={`px-6 py-16 ${bgClasses[backgroundColor]}`}>
      <div
        className={`mx-auto flex max-w-6xl items-center gap-12 ${
          showImage ? "flex-col lg:flex-row" : "flex-col"
        } ${imagePosition === "left" && showImage ? "lg:flex-row-reverse" : ""}`}
      >
        <m.div
          className={showImage ? "flex-1" : "max-w-3xl mx-auto text-center"}
          variants={variants}
          {...mp}
          transition={transition}
          {...scrollMotion}
          whileHover={hoverAnim}
          whileTap={tapAnim}
          whileFocus={focusAnim}
        >
          {heading && (
            <div
              className={`text-3xl font-bold tracking-tight sm:text-4xl${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >{heading}</div>
          )}
          {body && (
            <div
              className={`mt-4 text-lg leading-relaxed opacity-80 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1${bodyExtra ? ` ${bodyExtra}` : ""}`}
            >{body}</div>
          )}
        </m.div>
        {showImage && (
          <m.div
            className="flex-1"
            variants={
              animationVariants[
                reduce
                  ? "none"
                  : imagePosition === "left"
                    ? "slideLeft"
                    : "slideRight"
              ]
            }
            {...mp}
            transition={transition}
          >
            <img
              src={image}
              alt={heading || ""}
              className="w-full rounded-xl shadow-lg"
            />
          </m.div>
        )}
      </div>
    </section>
    </StyleWrapper>
  );
}