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
import { typographyFields, typographyDefaults, getHeadingClasses, getHeadingStyle, extractTypographyProps } from "../../../lib/puck/typography-fields";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type VideoBlockProps = {
  heading: string;
  videoUrl: string;
  caption: string;
  aspectRatio: "16:9" | "4:3" | "1:1";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const videoBlockConfig: ComponentConfig<VideoBlockProps> = {
  label: "Video",
  fields: {
    heading: { type: "richtext", label: "Heading", contentEditable: true },
    videoUrl: {
      type: "text",
      label: "Video URL (YouTube or Vimeo embed URL)",
    },
    caption: { type: "text", label: "Caption" },
    aspectRatio: {
      type: "radio",
      label: "Aspect Ratio",
      options: [
        { label: "16:9", value: "16:9" },
        { label: "4:3", value: "4:3" },
        { label: "1:1", value: "1:1" },
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
    videoUrl: "",
    caption: "",
    aspectRatio: "16:9",
    animationVariant: "fadeUp",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: VideoBlock,
};

const aspectClasses = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
};

export function VideoBlock(allProps: VideoBlockProps) {
  const { heading, videoUrl, caption, aspectRatio, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const isEditing = puck?.isEditing;
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="px-6 py-16">
      <m.div
        className="mx-auto max-w-4xl"
        variants={animationVariants[variant]}
        {...mp}
        transition={transition}
        {...scrollMotion}
      >
        {(heading || isEditing) && (
          <div className="mb-8 text-center">
            <h2
              className={`text-3xl font-bold tracking-tight text-slate-900${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >{heading}</h2>
          </div>
        )}
        <div
          className={`overflow-hidden rounded-xl bg-black ${aspectClasses[aspectRatio]}`}
        >
          {isEditing ? (
            <div className="flex h-full items-center justify-center text-white/50">
              <div className="text-center">
                <div className="text-5xl mb-2">▶</div>
                <p className="text-sm">{videoUrl || "No video URL set"}</p>
              </div>
            </div>
          ) : videoUrl ? (
            <iframe
              src={videoUrl}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={heading || "Video"}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/50">
              No video URL configured
            </div>
          )}
        </div>
        {caption && (
          <p className="mt-3 text-center text-sm text-slate-500">{caption}</p>
        )}
      </m.div>
    </section>
    </StyleWrapper>
  );
}