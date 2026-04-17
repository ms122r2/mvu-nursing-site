"use client";

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
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

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  heading: string;
  items: FAQItem[];
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const faqSectionConfig: ComponentConfig<FAQSectionProps> = {
  label: "FAQ / Accordion",
  fields: {
    heading: { type: "richtext", label: "Section Heading", contentEditable: true },
    items: {
      type: "array",
      label: "FAQ Items",
      arrayFields: {
        question: { type: "text", label: "Question" },
        answer: { type: "textarea", label: "Answer" },
      },
      defaultItemProps: {
        question: "Frequently asked question?",
        answer: "The answer to this question goes here.",
      },
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
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What are the admission requirements?",
        answer:
          "Requirements vary by program. Generally, you'll need a bachelor's degree and relevant transcripts. Some programs may require GRE scores or professional experience.",
      },
      {
        question: "Is financial aid available?",
        answer:
          "Yes, eligible students can apply for federal financial aid, scholarships, and employer tuition reimbursement programs.",
      },
      {
        question: "How long does the program take to complete?",
        answer:
          "Most programs can be completed in 12-24 months, depending on course load and prior credits.",
      },
    ],
    animationVariant: "stagger",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: FAQSection,
};

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-slate-200">
      <button
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-slate-900 pr-4">{item.question}</span>
        <m.span
          className="flex-shrink-0 text-slate-400"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2 }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </m.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-slate-600 leading-relaxed">{item.answer}</p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection(allProps: FAQSectionProps) {
  const { heading, items, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const editing = puck?.isEditing;
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
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
          className="divide-y divide-slate-200 border-t border-slate-200"
          variants={staggerContainer}
          {...mp}
          transition={transition}
        >
          {(items ?? []).map((item, i) => (
            <m.div key={i} variants={animationVariants.stagger} custom={i}>
              <FAQAccordionItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
    </StyleWrapper>
  );
}