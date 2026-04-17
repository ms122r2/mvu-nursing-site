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
import {
  StyleWrapper,
  extractStyleProps,
} from "../shared/StyleWrapper";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type PricingTier = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string;
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
};

type PricingTableProps = {
  heading: string;
  subheading: string;
  tiers: PricingTier[];
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const pricingTableConfig: ComponentConfig<PricingTableProps> = {
  label: "Pricing Table",
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
    tiers: {
      type: "array",
      label: "Tiers",
      arrayFields: {
        name: { type: "text", label: "Tier Name" },
        price: { type: "text", label: "Price (e.g. $299)" },
        period: { type: "text", label: "Period (e.g. /month)" },
        description: { type: "textarea", label: "Description" },
        features: {
          type: "textarea",
          label: "Features (one per line)",
        },
        ctaLabel: { type: "text", label: "CTA Label" },
        ctaHref: { type: "text", label: "CTA URL" },
        highlighted: {
          type: "radio",
          label: "Highlight",
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ],
        },
      },
      defaultItemProps: {
        name: "Plan",
        price: "$99",
        period: "/semester",
        description: "Perfect for getting started.",
        features: "Feature one\nFeature two\nFeature three",
        ctaLabel: "Get Started",
        ctaHref: "#",
        highlighted: false,
      },
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
    heading: "Choose Your Path",
    subheading: "Flexible options to fit your schedule and budget.",
    tiers: [
      {
        name: "Certificate",
        price: "$2,499",
        period: "total",
        description: "Focused credential in 6 months.",
        features:
          "Industry-recognized credential\n100% online\nSelf-paced learning\nCareer services access",
        ctaLabel: "Apply Now",
        ctaHref: "#",
        highlighted: false,
      },
      {
        name: "Master's Degree",
        price: "$18,900",
        period: "total",
        description: "Comprehensive 24-month program.",
        features:
          "CACREP accredited\n100% online\nClinical practicum support\n1:1 faculty advising\nCareer placement assistance",
        ctaLabel: "Apply Now",
        ctaHref: "#",
        highlighted: true,
      },
      {
        name: "Doctoral",
        price: "$32,000",
        period: "total",
        description: "Advanced practice and research.",
        features:
          "Terminal degree\nDissertation support\nResearch opportunities\nTeaching assistantship\nFull career services",
        ctaLabel: "Apply Now",
        ctaHref: "#",
        highlighted: false,
      },
    ],
    animationVariant: "stagger",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: PricingTable,
};

export function PricingTable(allProps: PricingTableProps) {
  const { heading, subheading, tiers, animationVariant, puck, ...rest } =
    allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {heading && (
            <m.div
              className="text-center mb-4"
              variants={animationVariants[variant]}
              {...mp}
              transition={transition}
              {...scrollMotion}
            >
              <div className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {heading}
              </div>
            </m.div>
          )}
          {subheading && (
            <m.div
              className="text-center mb-12"
              variants={animationVariants[variant]}
              {...mp}
              transition={transition}
            >
              <div className="text-lg text-slate-600">{subheading}</div>
            </m.div>
          )}
          <m.div
            className={`grid gap-8 ${
              (tiers ?? []).length === 2
                ? "sm:grid-cols-2 max-w-3xl mx-auto"
                : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
            variants={staggerContainer}
            {...mp}
            transition={transition}
          >
            {(tiers ?? []).map((tier, i) => (
              <m.div
                key={i}
                className={`flex flex-col rounded-2xl p-8 ${
                  tier.highlighted
                    ? "bg-indigo-600 text-white ring-2 ring-indigo-600 scale-105"
                    : "bg-white text-slate-900 border border-slate-200"
                }`}
                variants={animationVariants.stagger}
                custom={i}
              >
                <div className="mb-4">
                  <h3
                    className={`text-lg font-semibold ${
                      tier.highlighted ? "text-indigo-100" : "text-slate-500"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span
                        className={`text-sm ${
                          tier.highlighted
                            ? "text-indigo-200"
                            : "text-slate-500"
                        }`}
                      >
                        {tier.period}
                      </span>
                    )}
                  </div>
                  {tier.description && (
                    <p
                      className={`mt-3 text-sm ${
                        tier.highlighted ? "text-indigo-100" : "text-slate-600"
                      }`}
                    >
                      {tier.description}
                    </p>
                  )}
                </div>
                <ul className="mb-8 flex-1 space-y-2.5">
                  {tier.features
                    .split("\n")
                    .filter(Boolean)
                    .map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <svg
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            tier.highlighted
                              ? "text-indigo-200"
                              : "text-indigo-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                </ul>
                <a
                  href={puck?.isEditing ? "#" : tier.ctaHref}
                  className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {tier.ctaLabel}
                </a>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>
    </StyleWrapper>
  );
}
