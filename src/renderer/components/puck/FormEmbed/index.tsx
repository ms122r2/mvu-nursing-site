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

type FormEmbedProps = {
  heading: string;
  description: string;
  embedType: "iframe" | "widget" | "scheduler";
  embedUrl: string;
  widgetId: string;
  height: number;
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const formEmbedConfig: ComponentConfig<FormEmbedProps> = {
  label: "Form / Embed",
  fields: {
    heading: { type: "richtext", label: "Heading", contentEditable: true },
    description: { type: "richtext", label: "Description", contentEditable: true },
    embedType: {
      type: "select",
      label: "Embed Type",
      options: [
        { label: "iFrame URL", value: "iframe" },
        { label: "LXS Widget", value: "widget" },
        { label: "Scheduler", value: "scheduler" },
      ],
    },
    embedUrl: { type: "text", label: "Embed URL (for iframe/scheduler)" },
    widgetId: { type: "text", label: "Widget ID (for LXS widget)" },
    height: { type: "number", label: "Height (px)", min: 200, max: 1200 },
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
    description: "",
    embedType: "iframe",
    embedUrl: "",
    widgetId: "",
    height: 600,
    animationVariant: "fadeUp",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: FormEmbed,
};

export function FormEmbed(allProps: FormEmbedProps) {
  const { heading, description, embedType, embedUrl, widgetId, height, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const isEditing = puck?.isEditing;
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const bodyExtra = getBodyClasses(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="bg-white px-6 py-16">
      <m.div
        className="mx-auto max-w-4xl"
        variants={animationVariants[variant]}
        {...mp}
        transition={transition}
        {...scrollMotion}
      >
        {(heading || isEditing) && (
          <div className="mb-4 text-center">
            <h2
              className={`text-3xl font-bold tracking-tight text-slate-900${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >{heading}</h2>
          </div>
        )}
        {(description || isEditing) && (
          <div className="mb-8 text-center">
            <div
              className={`text-lg text-slate-600${bodyExtra ? ` ${bodyExtra}` : ""}`}
            >{description}</div>
          </div>
        )}
        <div
          className="overflow-hidden rounded-xl border border-slate-200"
          style={{ height }}
        >
          {isEditing ? (
            <div className="flex h-full items-center justify-center bg-slate-50 text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {embedType === "scheduler" ? "📅" : embedType === "widget" ? "🧩" : "📄"}
                </div>
                <p className="font-medium">
                  {embedType === "iframe" && "iFrame Embed"}
                  {embedType === "widget" && `LXS Widget: ${widgetId || "(not set)"}`}
                  {embedType === "scheduler" && "Scheduler Embed"}
                </p>
                <p className="text-sm mt-1">{embedUrl || "No URL configured"}</p>
              </div>
            </div>
          ) : embedType === "iframe" || embedType === "scheduler" ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                className="h-full w-full border-0"
                title={heading || "Embedded content"}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                No embed URL configured
              </div>
            )
          ) : (
            <div
              id={`lxs-widget-${widgetId}`}
              data-lxs-widget={widgetId}
              className="h-full"
            />
          )}
        </div>
      </m.div>
    </section>
    </StyleWrapper>
  );
}