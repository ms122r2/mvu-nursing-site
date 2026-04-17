"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import {
  animationVariants,
  staggerContainer,
  animationVariantOptions,
  getMotionProps,
  type AnimationVariant,
} from "../../../lib/motion/variants";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { typographyFields, typographyDefaults, getHeadingClasses, getHeadingStyle, extractTypographyProps } from "../../../lib/puck/typography-fields";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { hoverFields, hoverDefaults, getHoverAnimation, getTapAnimation, getFocusAnimation, extractInteractionProps } from "../../../lib/puck/hover-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type Feature = {
  icon: string;
  heading: string;
  description: string;
};

type FeatureGridProps = {
  sectionHeading: string;
  features: Feature[];
  columns: "2" | "3" | "4";
  iconStyle: "emoji" | "circle" | "none";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const featureGridConfig: ComponentConfig<FeatureGridProps> = {
  label: "Feature Grid",
  fields: {
    sectionHeading: {
      type: "richtext",
      label: "Section Heading",
      contentEditable: true,
    },
    features: {
      type: "array",
      label: "Features",
      arrayFields: {
        icon: { type: "text", label: "Icon (emoji or text)" },
        heading: { type: "text", label: "Heading" },
        description: { type: "textarea", label: "Description" },
      },
      defaultItemProps: {
        icon: "✨",
        heading: "Feature Name",
        description: "Brief description of this feature or benefit.",
      },
    },
    columns: {
      type: "radio",
      label: "Columns",
      options: [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    iconStyle: {
      type: "select",
      label: "Icon Style",
      options: [
        { label: "Emoji", value: "emoji" },
        { label: "Circle Background", value: "circle" },
        { label: "No Icon", value: "none" },
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
    sectionHeading: "Why Choose Us",
    features: [
      { icon: "🎓", heading: "Expert Faculty", description: "Learn from industry professionals with real-world experience." },
      { icon: "💻", heading: "100% Online", description: "Complete your coursework from anywhere, on your schedule." },
      { icon: "🏆", heading: "Accredited Programs", description: "Nationally recognized accreditation for career readiness." },
      { icon: "🤝", heading: "1:1 Advising", description: "Personal enrollment advisors guide you every step of the way." },
    ],
    columns: "4",
    iconStyle: "circle",
    animationVariant: "stagger",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...hoverDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: FeatureGrid,
};

const colClasses = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid(allProps: FeatureGridProps) {
  const { sectionHeading, features, columns, iconStyle, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));
  const interaction = extractInteractionProps(rest as Record<string, unknown>);
  const hoverAnim = getHoverAnimation(interaction._hoverEffect);
  const tapAnim = getTapAnimation(interaction._tapScale);
  const focusAnim = getFocusAnimation(interaction._focusRing, interaction._hoverEffect);

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {sectionHeading && (
          <m.div
            className="mb-12 text-center"
            variants={animationVariants[variant]}
            {...mp}
            transition={transition}
            {...scrollMotion}
          >
            <div
              className={`text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >
              {sectionHeading}
            </div>
          </m.div>
        )}
        <m.div
          className={`grid gap-8 ${colClasses[columns]}`}
          variants={staggerContainer}
          {...mp}
          transition={transition}
        >
          {(features ?? []).map((f, i) => (
            <m.div
              key={i}
              className="text-center"
              variants={animationVariants.stagger}
              custom={i}
              whileHover={hoverAnim}
              whileTap={tapAnim}
              whileFocus={focusAnim}
            >
              {iconStyle !== "none" && f.icon && (
                <div className="mb-4 flex justify-center">
                  {iconStyle === "circle" ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
                      {f.icon}
                    </div>
                  ) : (
                    <span className="text-3xl">{f.icon}</span>
                  )}
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-900">
                {f.heading}
              </h3>
              {f.description && (
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              )}
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
    </StyleWrapper>
  );
}
