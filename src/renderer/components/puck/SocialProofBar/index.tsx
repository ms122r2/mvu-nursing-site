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
import {
  StyleWrapper,
  extractStyleProps,
} from "../shared/StyleWrapper";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type ProofItem = {
  icon: string;
  text: string;
};

type SocialProofBarProps = {
  items: ProofItem[];
  style: "light" | "dark" | "brand";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const socialProofBarConfig: ComponentConfig<SocialProofBarProps> = {
  label: "Social Proof Bar",
  fields: {
    items: {
      type: "array",
      label: "Proof Items",
      arrayFields: {
        icon: { type: "text", label: "Icon (emoji)" },
        text: { type: "text", label: "Text" },
      },
      defaultItemProps: { icon: "⭐", text: "4.8/5 Student Rating" },
    },
    style: {
      type: "select",
      label: "Style",
      options: [
        { label: "Light", value: "light" },
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
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    items: [
      { icon: "🏆", text: "CACREP Accredited" },
      { icon: "⭐", text: "4.8/5 Student Rating" },
      { icon: "📊", text: "95% Employment Rate" },
      { icon: "🎓", text: "10,000+ Graduates" },
    ],
    style: "light",
    animationVariant: "fadeIn",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: SocialProofBar,
};

const styleClasses = {
  light: "bg-slate-50 text-slate-700 border-y border-slate-200",
  dark: "bg-slate-900 text-white",
  brand: "bg-indigo-600 text-white",
};

export function SocialProofBar(allProps: SocialProofBarProps) {
  const { items, style: variant, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const anim = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const animEnhProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animEnhProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <m.section
        className={`px-6 py-4 ${styleClasses[variant]}`}
        variants={animationVariants[anim]}
        {...mp}
        transition={transition}
        {...scrollMotion}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {(items ?? []).map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm font-medium"
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </m.section>
    </StyleWrapper>
  );
}
