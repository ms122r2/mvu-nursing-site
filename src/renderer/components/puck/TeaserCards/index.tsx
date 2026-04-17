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

type TeaserCard = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

type TeaserCardsProps = {
  heading: string;
  cards: TeaserCard[];
  columns: "2" | "3" | "4";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const teaserCardsConfig: ComponentConfig<TeaserCardsProps> = {
  label: "Teaser Cards",
  fields: {
    heading: { type: "richtext", label: "Section Heading", contentEditable: true },
    cards: {
      type: "array",
      label: "Cards",
      arrayFields: {
        image: { type: "text", label: "Image URL" },
        imageAlt: { type: "text", label: "Image Alt" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        ctaLabel: { type: "text", label: "CTA Label" },
        ctaHref: { type: "text", label: "CTA URL" },
      },
      defaultItemProps: {
        image: "",
        imageAlt: "",
        title: "Card Title",
        description: "Card description goes here.",
        ctaLabel: "Learn More",
        ctaHref: "#",
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
    heading: "",
    cards: [
      {
        image: "",
        imageAlt: "",
        title: "Program One",
        description: "Equip yourself with the skills for a rewarding career.",
        ctaLabel: "Learn More",
        ctaHref: "#",
      },
      {
        image: "",
        imageAlt: "",
        title: "Program Two",
        description: "Prepare to make a difference in your community.",
        ctaLabel: "Learn More",
        ctaHref: "#",
      },
    ],
    columns: "2",
    animationVariant: "stagger",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...hoverDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: TeaserCards,
};

const colClasses = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

export function TeaserCards(allProps: TeaserCardsProps) {
  const { heading, cards, columns, animationVariant, puck, ...rest } = allProps;
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
  const interaction = extractInteractionProps(rest as Record<string, unknown>);
  const hoverAnim = getHoverAnimation(interaction._hoverEffect);
  const tapAnim = getTapAnimation(interaction._tapScale);
  const focusAnim = getFocusAnimation(interaction._focusRing, interaction._hoverEffect);

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="bg-white px-6 py-16">
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
              className={`text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >{heading}</h2>
          </m.div>
        )}
        <m.div
          className={`grid gap-8 ${colClasses[columns]}`}
          variants={staggerContainer}
          {...mp}
          transition={transition}
        >
          {(cards ?? []).map((card, i) => (
            <m.div
              key={i}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              variants={animationVariants.stagger}
              custom={i}
              whileHover={hoverAnim}
              whileTap={tapAnim}
              whileFocus={focusAnim}
            >
              {card.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.imageAlt || card.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                )}
                {card.ctaLabel && (
                  <a
                    href={editing ? "#" : card.ctaHref}
                    className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {card.ctaLabel} &rarr;
                  </a>
                )}
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
    </StyleWrapper>
  );
}