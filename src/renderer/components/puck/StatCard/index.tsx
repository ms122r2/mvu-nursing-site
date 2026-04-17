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
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import { AnimatedNumber } from "../shared/AnimatedNumber";

type Stat = {
  value: string;
  label: string;
};

type StatCardProps = {
  heading: string;
  stats: Stat[];
  backgroundColor: "white" | "gray" | "dark" | "brand";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const statCardConfig: ComponentConfig<StatCardProps> = {
  label: "Stats Row",
  fields: {
    heading: { type: "richtext", label: "Section Heading", contentEditable: true },
    stats: {
      type: "array",
      label: "Stats",
      arrayFields: {
        value: { type: "text", label: "Value (e.g. 95%)" },
        label: { type: "text", label: "Label" },
      },
      defaultItemProps: { value: "100+", label: "Stat Label" },
    },
    backgroundColor: {
      type: "select",
      label: "Background",
      options: [
        { label: "White", value: "white" },
        { label: "Light Gray", value: "gray" },
        { label: "Dark", value: "dark" },
        { label: "Brand", value: "brand" },
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
    heading: "",
    stats: [
      { value: "95%", label: "Employment Rate" },
      { value: "$65K", label: "Average Salary" },
      { value: "12mo", label: "Average Completion" },
      { value: "4.8/5", label: "Student Rating" },
    ],
    backgroundColor: "dark",
    animationVariant: "stagger",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: StatCard,
};

const bgClasses = {
  white: "bg-white text-slate-900",
  gray: "bg-slate-50 text-slate-900",
  dark: "bg-slate-900 text-white",
  brand: "bg-indigo-600 text-white",
};

export function StatCard(allProps: StatCardProps) {
  const { heading, stats, backgroundColor, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const editing = puck?.isEditing;
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className={`px-6 py-16 ${bgClasses[backgroundColor]}`}>
      <div className="mx-auto max-w-6xl">
        {(heading || editing) && (
          <m.div
            className="mb-10 text-center"
            variants={animationVariants[variant]}
            {...mp}
            transition={transition}
            {...scrollMotion}
          >
            <h2
              className={`text-3xl font-bold tracking-tight${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >{heading}</h2>
          </m.div>
        )}
        <m.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          {...mp}
          transition={transition}
        >
          {(stats ?? []).map((stat, i) => (
            <m.div
              key={i}
              className="text-center"
              variants={animationVariants.stagger}
              custom={i}
              transition={transition}
            >
              <div className="text-4xl font-bold tracking-tight">
                <AnimatedNumber
                  value={stat.value}
                  animated={!editing}
                  delay={i * 0.15}
                />
              </div>
              <div className="mt-2 text-sm font-medium opacity-70">
                {stat.label}
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
    </StyleWrapper>
  );
}
