"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
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

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

type TestimonialSectionProps = {
  heading: string;
  testimonials: Testimonial[];
  layout: "grid" | "carousel";
  columns: "2" | "3";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const testimonialSectionConfig: ComponentConfig<TestimonialSectionProps> =
  {
    label: "Testimonials",
    fields: {
      heading: { type: "richtext", label: "Section Heading", contentEditable: true },
      testimonials: {
        type: "array",
        label: "Testimonials",
        arrayFields: {
          quote: { type: "textarea", label: "Quote" },
          name: { type: "text", label: "Name" },
          role: { type: "text", label: "Role / Program" },
          image: { type: "text", label: "Photo URL" },
        },
        defaultItemProps: {
          quote: "This program changed my career trajectory.",
          name: "Jane Doe",
          role: "Graduate, 2025",
          image: "",
        },
      },
      layout: {
        type: "radio",
        label: "Layout",
        options: [
          { label: "Grid", value: "grid" },
          { label: "Carousel (swipe)", value: "carousel" },
        ],
      },
      columns: {
        type: "radio",
        label: "Columns (grid only)",
        options: [
          { label: "2 Columns", value: "2" },
          { label: "3 Columns", value: "3" },
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
      heading: "What Our Students Say",
      testimonials: [
        {
          quote:
            "The flexibility of the online program allowed me to advance my career while still working full-time.",
          name: "Sarah Johnson",
          role: "BSN Graduate, 2025",
          image: "",
        },
        {
          quote:
            "The faculty were incredibly supportive and the curriculum was rigorous and relevant.",
          name: "Michael Chen",
          role: "MBA Graduate, 2024",
          image: "",
        },
      ],
      layout: "grid",
      columns: "2",
      animationVariant: "stagger",
      ...animationEnhancedDefaults,
      ...scrollDefaults,
      ...typographyDefaults,
      ...hoverDefaults,
      ...styleDefaults,
      ...responsiveDefaults,
    },
    render: TestimonialSection,
  };

function TestimonialCard({
  t,
  hoverAnim,
  tapAnim,
  focusAnim,
}: {
  t: Testimonial;
  hoverAnim: ReturnType<typeof getHoverAnimation>;
  tapAnim: ReturnType<typeof getTapAnimation>;
  focusAnim: ReturnType<typeof getFocusAnimation>;
}) {
  return (
    <m.blockquote
      className="rounded-xl border border-slate-200 bg-slate-50 p-6"
      whileHover={hoverAnim}
      whileTap={tapAnim}
      whileFocus={focusAnim}
    >
      <p className="text-slate-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
      <footer className="mt-4 flex items-center gap-3">
        {t.image && (
          <img
            src={t.image}
            alt={t.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold text-slate-900">{t.name}</div>
          {t.role && <div className="text-sm text-slate-500">{t.role}</div>}
        </div>
      </footer>
    </m.blockquote>
  );
}

function TestimonialCarousel({
  testimonials,
  hoverAnim,
  tapAnim,
  focusAnim,
  reduce,
}: {
  testimonials: Testimonial[];
  hoverAnim: ReturnType<typeof getHoverAnimation>;
  tapAnim: ReturnType<typeof getTapAnimation>;
  focusAnim: ReturnType<typeof getFocusAnimation>;
  reduce: boolean | null;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = testimonials.length;
  if (count === 0) return null;

  const goTo = (next: number) => {
    const clamped = ((next % count) + count) % count;
    setDirection(next > index ? 1 : -1);
    setIndex(clamped);
  };

  return (
    <div className="relative">
      {/* Slide */}
      <div className="relative overflow-hidden px-1 py-2">
        <AnimatePresence mode="wait" custom={direction}>
          <m.div
            key={index}
            custom={direction}
            initial={reduce ? false : { opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x > 60) goTo(index - 1);
              else if (info.offset.x < -60) goTo(index + 1);
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <TestimonialCard t={testimonials[index]} hoverAnim={hoverAnim} tapAnim={tapAnim} focusAnim={focusAnim} />
          </m.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous testimonial"
          className="rounded-full border border-slate-300 p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next testimonial"
          className="rounded-full border border-slate-300 p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function TestimonialSection(allProps: TestimonialSectionProps) {
  const { heading, testimonials, layout, columns, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const editing = puck?.isEditing;
  const gridCols = columns === "3" ? "lg:grid-cols-3" : "lg:grid-cols-2";
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

  // Force grid in the editor so designer can see + inline-edit every item.
  const useCarousel = layout === "carousel" && !editing;

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          {(heading || editing) && (
            <m.div
              className="mb-12 text-center"
              variants={animationVariants[variant]}
              {...mp}
              transition={transition}
              {...scrollMotion}
            >
              <h2
                className={`text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl${headingExtra ? ` ${headingExtra}` : ""}`}
                {...(headingStyle ? { style: headingStyle } : {})}
              >
                {heading}
              </h2>
            </m.div>
          )}

          {useCarousel ? (
            <TestimonialCarousel
              testimonials={testimonials ?? []}
              hoverAnim={hoverAnim}
              tapAnim={tapAnim}
              focusAnim={focusAnim}
              reduce={reduce}
            />
          ) : (
            <m.div
              className={`grid gap-8 ${gridCols}`}
              variants={staggerContainer}
              {...mp}
              transition={transition}
            >
              {(testimonials ?? []).map((t, i) => (
                <m.div
                  key={i}
                  variants={animationVariants.stagger}
                  custom={i}
                  transition={transition}
                >
                  <TestimonialCard
                    t={t}
                    hoverAnim={hoverAnim}
                    tapAnim={tapAnim}
                    focusAnim={focusAnim}
                  />
                </m.div>
              ))}
            </m.div>
          )}
        </div>
      </section>
    </StyleWrapper>
  );
}