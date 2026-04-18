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
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import {
  animationEnhancedFields,
  animationEnhancedDefaults,
  getTransition,
  extractAnimationEnhancedProps,
} from "../../../lib/puck/animation-fields";
import { AnimatedNumber } from "../shared/AnimatedNumber";

type OutcomeWidgetProps = {
  heading: string;
  employmentRate: string;
  medianSalary: string;
  completionRate: string;
  roiYears: string;
  style: "cards" | "bar" | "compact";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const outcomeWidgetConfig: ComponentConfig<OutcomeWidgetProps> = {
  label: "Program Outcomes",
  fields: {
    heading: { type: "richtext", label: "Heading", contentEditable: true },
    employmentRate: { type: "text", label: "Employment Rate (e.g. 95%)" },
    medianSalary: { type: "text", label: "Median Salary (e.g. $65,000)" },
    completionRate: { type: "text", label: "Completion Rate (e.g. 89%)" },
    roiYears: { type: "text", label: "ROI Break-even (e.g. 2.3 years)" },
    style: {
      type: "select",
      label: "Display Style",
      options: [
        { label: "Cards", value: "cards" },
        { label: "Progress Bars", value: "bar" },
        { label: "Compact Row", value: "compact" },
      ],
    },
    animationVariant: { type: "select", label: "Animation", options: animationVariantOptions },
    ...animationEnhancedFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Program Outcomes",
    employmentRate: "95%",
    medianSalary: "$65,000",
    completionRate: "89%",
    roiYears: "2.3 years",
    style: "cards",
    animationVariant: "stagger",
    ...animationEnhancedDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: OutcomeWidget,
};

export function OutcomeWidget(allProps: OutcomeWidgetProps) {
  const { heading, employmentRate, medianSalary, completionRate, roiYears, style: variant, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const anim = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const transition = getTransition(
    extractAnimationEnhancedProps(rest as Record<string, unknown>)
  );

  const metrics = [
    { icon: "📊", label: "Employment Rate", value: employmentRate, color: "text-emerald-600" },
    { icon: "💰", label: "Median Salary", value: medianSalary, color: "text-indigo-600" },
    { icon: "🎓", label: "Completion Rate", value: completionRate, color: "text-blue-600" },
    { icon: "📈", label: "ROI Break-even", value: roiYears, color: "text-amber-600" },
  ].filter((metric) => metric.value);

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {heading && (
            <m.div
              className="mb-8 text-center font-bold text-2xl text-slate-900"
              variants={animationVariants[anim]}
              {...mp}
              transition={transition}
            >
              {heading}
            </m.div>
          )}

          {variant === "cards" && (
            <m.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              {...mp}
            >
              {metrics.map((metric, i) => (
                <m.div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center"
                  variants={animationVariants.stagger}
                  custom={i}
                  transition={transition}
                >
                  <div className="text-2xl mb-2">{metric.icon}</div>
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    <AnimatedNumber
                      value={metric.value}
                      animated={!puck?.isEditing}
                      delay={i * 0.15}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{metric.label}</div>
                </m.div>
              ))}
            </m.div>
          )}

          {variant === "bar" && (
            <div className="space-y-4">
              {metrics.map((metric, i) => (
                <m.div
                  key={i}
                  className="flex items-center gap-4"
                  variants={animationVariants[anim]}
                  {...mp}
                  transition={transition}
                >
                  <span className="w-36 text-sm text-slate-600">{metric.label}</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                    <m.div
                      className="h-full bg-indigo-500 rounded-full flex items-center justify-end pr-3"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${parseInt(metric.value) || 50}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
                    >
                      <span className="text-xs font-bold text-white">{metric.value}</span>
                    </m.div>
                  </div>
                </m.div>
              ))}
            </div>
          )}

          {variant === "compact" && (
            <m.div
              className="flex flex-wrap items-center justify-center gap-6"
              variants={animationVariants[anim]}
              {...mp}
              transition={transition}
            >
              {metrics.map((metric, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{metric.icon}</span>
                  <span className={`font-bold ${metric.color}`}>
                    <AnimatedNumber
                      value={metric.value}
                      animated={!puck?.isEditing}
                      delay={i * 0.1}
                    />
                  </span>
                  <span className="text-xs text-slate-500">{metric.label}</span>
                </div>
              ))}
            </m.div>
          )}

          <div className="mt-6 text-center text-[10px] text-slate-400">
            Outcome data based on program graduates and BLS projections
          </div>
        </div>
      </section>
    </StyleWrapper>
  );
}
