"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import {
  animationVariants,
  animationVariantOptions,
  getMotionProps,
  type AnimationVariant,
} from "../../../lib/motion/variants";
import { AssetField } from "../fields/AssetField";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type LogoItem = {
  image: string;
  alt: string;
  href: string;
};

type LogoStripProps = {
  heading: string;
  logos: LogoItem[];
  grayscale: boolean;
  size: "sm" | "md" | "lg";
  layout: "grid" | "marquee";
  marqueeSpeed: "slow" | "medium" | "fast";
  marqueePauseOnHover: boolean;
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const logoStripConfig: ComponentConfig<LogoStripProps> = {
  label: "Logo Strip",
  fields: {
    heading: {
      type: "richtext",
      label: "Heading",
      contentEditable: true,
    },
    logos: {
      type: "array",
      label: "Logos",
      arrayFields: {
        image: { type: "text", label: "Logo URL" },
        alt: { type: "text", label: "Alt Text" },
        href: { type: "text", label: "Link URL (optional)" },
      },
      defaultItemProps: { image: "", alt: "Partner", href: "" },
    },
    grayscale: {
      type: "radio",
      label: "Grayscale",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    size: {
      type: "radio",
      label: "Logo Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    layout: {
      type: "radio",
      label: "Layout",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Marquee", value: "marquee" },
      ],
    },
    marqueeSpeed: {
      type: "select",
      label: "Marquee Speed",
      options: [
        { label: "Slow (40s)", value: "slow" },
        { label: "Medium (25s)", value: "medium" },
        { label: "Fast (15s)", value: "fast" },
      ],
    },
    marqueePauseOnHover: {
      type: "radio",
      label: "Pause on Hover",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
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
    heading: "Trusted by leading institutions",
    logos: [],
    grayscale: true,
    size: "md",
    layout: "grid",
    marqueeSpeed: "medium",
    marqueePauseOnHover: true,
    animationVariant: "fadeIn",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: LogoStrip,
};

const sizeClasses = { sm: "h-6", md: "h-10", lg: "h-14" };

const marqueeDuration: Record<"slow" | "medium" | "fast", number> = {
  slow: 40,
  medium: 25,
  fast: 15,
};

function LogoCell({
  logo,
  size,
  grayscale,
  isEditing,
}: {
  logo: LogoItem;
  size: "sm" | "md" | "lg";
  grayscale: boolean;
  isEditing?: boolean;
}) {
  const img = logo.image ? (
    <img
      src={logo.image}
      alt={logo.alt}
      className={`${sizeClasses[size]} w-auto object-contain ${
        grayscale
          ? "opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
          : ""
      }`}
    />
  ) : (
    <div
      className={`${sizeClasses[size]} w-24 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-400`}
    >
      Logo
    </div>
  );

  return logo.href && !isEditing ? (
    <a href={logo.href} target="_blank" rel="noopener noreferrer">
      {img}
    </a>
  ) : (
    <>{img}</>
  );
}

export function LogoStrip(allProps: LogoStripProps) {
  const {
    heading,
    logos,
    grayscale,
    size,
    layout,
    marqueeSpeed,
    marqueePauseOnHover,
    animationVariant,
    puck,
    ...rest
  } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  const items = logos ?? [];
  const isMarquee = layout === "marquee" && items.length > 0 && !reduce;
  // Reduced motion users get the grid layout even if marquee was picked —
  // infinite horizontal scroll is exactly the kind of vestibular trigger
  // prefers-reduced-motion is supposed to suppress.

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-slate-50 px-6 py-12 overflow-hidden">
        <m.div
          className="mx-auto max-w-6xl"
          variants={animationVariants[variant]}
          {...mp}
          transition={transition}
          {...scrollMotion}
        >
          {heading && (
            <div className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-slate-500">
              {heading}
            </div>
          )}

          {isMarquee ? (
            <div
              className={`group relative flex gap-12 ${
                marqueePauseOnHover ? "hover:[--marquee-play:paused]" : ""
              }`}
              // Double the track so the wrap-around is seamless.
              style={{
                ["--marquee-duration" as string]: `${marqueeDuration[marqueeSpeed]}s`,
              }}
            >
              <div
                className="marquee-track flex shrink-0 items-center gap-12 md:gap-16"
                aria-hidden="false"
              >
                {items.map((logo, i) => (
                  <LogoCell
                    key={`a-${i}`}
                    logo={logo}
                    size={size}
                    grayscale={grayscale}
                    isEditing={puck?.isEditing}
                  />
                ))}
              </div>
              <div
                className="marquee-track flex shrink-0 items-center gap-12 md:gap-16"
                aria-hidden="true"
              >
                {items.map((logo, i) => (
                  <LogoCell
                    key={`b-${i}`}
                    logo={logo}
                    size={size}
                    grayscale={grayscale}
                    isEditing={puck?.isEditing}
                  />
                ))}
              </div>
              <style
                dangerouslySetInnerHTML={{
                  __html: `
@keyframes logo-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-100%); }
}
.marquee-track {
  animation: logo-marquee var(--marquee-duration, 25s) linear infinite;
  animation-play-state: var(--marquee-play, running);
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
`,
                }}
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {items.map((logo, i) => (
                <div key={i}>
                  <LogoCell
                    logo={logo}
                    size={size}
                    grayscale={grayscale}
                    isEditing={puck?.isEditing}
                  />
                </div>
              ))}
              {items.length === 0 && puck?.isEditing && (
                <p className="text-sm text-slate-400">
                  Add logos in the sidebar →
                </p>
              )}
            </div>
          )}
        </m.div>
      </section>
    </StyleWrapper>
  );
}