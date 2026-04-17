"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import {
  animationVariants,
  animationVariantOptions,
  getMotionProps,
  type AnimationVariant,
} from "../../../lib/motion/variants";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { typographyFields, typographyDefaults, getHeadingClasses, getHeadingStyle, getBodyClasses, extractTypographyProps } from "../../../lib/puck/typography-fields";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import { buttonFields, buttonDefaults } from "../../../lib/puck/button-fields";
import { StyledButton } from "../shared/StyledButton";

type CTABannerProps = {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  backgroundColor: "brand" | "dark" | "gradient";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const ctaBannerConfig: ComponentConfig<CTABannerProps> = {
  label: "CTA Banner",
  fields: {
    heading: {
      type: "richtext",
      label: "Heading",
      contentEditable: true,
    },
    description: {
      type: "richtext",
      label: "Description",
      contentEditable: true,
    },
    ctaLabel: { type: "text", label: "Primary Button Label" },
    ctaHref: { type: "text", label: "Primary Button Link" },
    secondaryLabel: { type: "text", label: "Secondary Button Label" },
    secondaryHref: { type: "text", label: "Secondary Button Link" },
    ...buttonFields,
    backgroundColor: {
      type: "select",
      label: "Style",
      options: [
        { label: "Brand Color", value: "brand" },
        { label: "Dark", value: "dark" },
        { label: "Gradient", value: "gradient" },
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
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Ready to Get Started?",
    description: "Take the next step in your educational journey today.",
    ctaLabel: "Apply Now",
    ctaHref: "#",
    secondaryLabel: "Learn More",
    secondaryHref: "#",
    ...buttonDefaults,
    backgroundColor: "brand",
    animationVariant: "fadeUp",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: CTABanner,
};

const bgClasses = {
  brand: "bg-indigo-600",
  dark: "bg-slate-900",
  gradient: "bg-gradient-to-r from-indigo-600 to-purple-600",
};

export function CTABanner(allProps: CTABannerProps) {
  const { heading, description, ctaLabel, ctaHref, secondaryLabel, secondaryHref, backgroundColor, animationVariant, puck, ...rest } = allProps;
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
    <section className={`px-6 py-20 ${bgClasses[backgroundColor]}`}>
      <m.div
        className="mx-auto max-w-4xl text-center"
        variants={variants}
        {...mp}
        transition={transition}
        {...scrollMotion}
      >
        <div
          className={`text-3xl font-bold tracking-tight text-white sm:text-4xl${headingExtra ? ` ${headingExtra}` : ""}`}
          {...(headingStyle ? { style: headingStyle } : {})}
        >{heading}</div>
        {description && (
          <div
            className={`mt-4 text-lg text-white/80${bodyExtra ? ` ${bodyExtra}` : ""}`}
          >{description}</div>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          {ctaLabel && (
            <StyledButton
              label={ctaLabel}
              href={puck?.isEditing ? "#" : ctaHref}
              _btnSize={(rest as Record<string, unknown>)._btnSize as string ?? "md"}
              _btnVariant={(rest as Record<string, unknown>)._btnVariant as string ?? "solid"}
              _btnColor={(rest as Record<string, unknown>)._btnColor as string ?? "#ffffff"}
              _btnRadius={(rest as Record<string, unknown>)._btnRadius as string ?? "md"}
              _btnHoverColor={(rest as Record<string, unknown>)._btnHoverColor as string ?? ""}
              _btnHoverScale={(rest as Record<string, unknown>)._btnHoverScale as string ?? "1.03"}
            />
          )}
          {secondaryLabel && (
            <StyledButton
              label={secondaryLabel}
              href={puck?.isEditing ? "#" : secondaryHref}
              _btnSize={(rest as Record<string, unknown>)._btnSize as string ?? "md"}
              _btnVariant="outline"
              _btnColor="#ffffff"
              _btnRadius={(rest as Record<string, unknown>)._btnRadius as string ?? "md"}
              _btnHoverColor=""
              _btnHoverScale="1.02"
            />
          )}
        </div>
      </m.div>
    </section>
    </StyleWrapper>
  );
}