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
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import { buttonFields, buttonDefaults } from "../../../lib/puck/button-fields";
import { StyledButton } from "../shared/StyledButton";
import { SplitTextReveal } from "../shared/SplitTextReveal";

type HeroSectionProps = {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: string;
  backgroundOverlay: boolean;
  alignment: "left" | "center";
  animationVariant: AnimationVariant;
  headingReveal: "default" | "words" | "letters";
  puck?: { isEditing: boolean };
};

export const heroSectionConfig: ComponentConfig<HeroSectionProps> = {
  label: "Hero Section",
  fields: {
    heading: {
      type: "richtext",
      label: "Heading",
      contentEditable: true,
    },
    subheading: {
      type: "richtext",
      label: "Subheading",
      contentEditable: true,
    },
    ctaLabel: { type: "text", label: "CTA Button Label" },
    ctaHref: { type: "text", label: "CTA Link" },
    ...buttonFields,
    backgroundImage: {
      type: "custom",
      label: "Background Image",
      render: AssetField,
    },
    backgroundOverlay: {
      type: "radio",
      label: "Dark Overlay",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    alignment: {
      type: "radio",
      label: "Text Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
    animationVariant: {
      type: "select",
      label: "Animation",
      options: animationVariantOptions,
    },
    headingReveal: {
      type: "select",
      label: "Heading Reveal (plain text only)",
      options: [
        { label: "Default (whole line)", value: "default" },
        { label: "Word-by-word", value: "words" },
        { label: "Letter-by-letter", value: "letters" },
      ],
    },
    ...animationEnhancedFields,
    ...scrollFields,
    ...typographyFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Your Heading Here",
    subheading: "Describe what makes this program unique",
    ctaLabel: "Get Started",
    ctaHref: "#",
    backgroundImage: "",
    backgroundOverlay: true,
    alignment: "center",
    animationVariant: "fadeUp",
    headingReveal: "default",
    ...buttonDefaults,
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: HeroSection,
};

export function HeroSection(allProps: HeroSectionProps) {
  const { heading, subheading, ctaLabel, ctaHref, backgroundImage, backgroundOverlay, alignment, animationVariant, headingReveal = "default", puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const variants = animationVariants[variant];
  const mp = getMotionProps(puck?.isEditing);
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const bodyExtra = getBodyClasses(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section
        className="relative flex min-h-[480px] items-center overflow-hidden px-6 py-24"
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { backgroundColor: "#1e293b" }
        }
      >
        {backgroundOverlay && (
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        )}
        <div
          className={`relative z-10 mx-auto w-full max-w-5xl ${
            alignment === "center" ? "text-center" : "text-left"
          }`}
        >
          <m.div
            className={`text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl${headingExtra ? ` ${headingExtra}` : ""}`}
            // If headingReveal is on, SplitTextReveal handles its own
            // per-token animation on scroll and we skip the outer variants
            // so the two don't fight. In edit mode we always render plain.
            variants={headingReveal === "default" ? variants : undefined}
            {...(headingReveal === "default" ? mp : {})}
            transition={transition}
            {...(headingReveal === "default" ? scrollMotion : {})}
            {...(headingStyle ? { style: headingStyle } : {})}
          >
            {headingReveal !== "default" && !puck?.isEditing ? (
              <SplitTextReveal mode={headingReveal}>{heading}</SplitTextReveal>
            ) : (
              heading
            )}
          </m.div>
          {subheading && (
            <m.div
              className={`mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl${bodyExtra ? ` ${bodyExtra}` : ""}`}
              variants={variants}
              {...mp}
              transition={transition}
            >{subheading}</m.div>
          )}
          {ctaLabel && (
            <m.div className="mt-10" variants={variants} {...mp} transition={transition}>
              <StyledButton
                label={ctaLabel}
                href={puck?.isEditing ? "#" : ctaHref}
                _btnSize={(rest as Record<string, unknown>)._btnSize as string ?? "lg"}
                _btnVariant={(rest as Record<string, unknown>)._btnVariant as string ?? "solid"}
                _btnColor={(rest as Record<string, unknown>)._btnColor as string ?? "#ffffff"}
                _btnRadius={(rest as Record<string, unknown>)._btnRadius as string ?? "md"}
                _btnHoverColor={(rest as Record<string, unknown>)._btnHoverColor as string ?? ""}
                _btnHoverScale={(rest as Record<string, unknown>)._btnHoverScale as string ?? "1.02"}
              />
            </m.div>
          )}
        </div>
      </section>
    </StyleWrapper>
  );
}
