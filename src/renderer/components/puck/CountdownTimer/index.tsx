"use client";

import { useEffect, useState } from "react";
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

type CountdownTimerProps = {
  heading: string;
  targetDate: string;
  expiredMessage: string;
  style: "dark" | "light" | "brand";
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const countdownTimerConfig: ComponentConfig<CountdownTimerProps> = {
  label: "Countdown Timer",
  fields: {
    heading: {
      type: "richtext",
      label: "Heading",
      contentEditable: true,
    },
    targetDate: {
      type: "text",
      label: "Target Date (YYYY-MM-DD or ISO)",
    },
    expiredMessage: {
      type: "text",
      label: "Expired Message",
    },
    style: {
      type: "select",
      label: "Style",
      options: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
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
    heading: "Application Deadline",
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    expiredMessage: "The deadline has passed.",
    style: "dark",
    animationVariant: "fadeUp",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: CountdownTimer,
};

const styleClasses = {
  dark: "bg-slate-900 text-white",
  light: "bg-white text-slate-900 border border-slate-200",
  brand: "bg-indigo-600 text-white",
};

const unitBoxStyles = {
  dark: "bg-slate-800",
  light: "bg-slate-50",
  brand: "bg-indigo-700",
};

function getTimeRemaining(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function CountdownTimer(allProps: CountdownTimerProps) {
  const {
    heading,
    targetDate,
    expiredMessage,
    style: variant,
    animationVariant,
    puck,
    ...rest
  } = allProps;
  const reduce = useReducedMotion();
  const anim = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  // Server + first client paint render a zero placeholder so hydration stays
  // stable (Date.now() drifts between the two). Real countdown starts on mount.
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<ReturnType<typeof getTimeRemaining>>(null);

  useEffect(() => {
    if (puck?.isEditing) return;
    setMounted(true);
    setTime(getTimeRemaining(targetDate));
    const interval = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, puck?.isEditing]);

  // In the editor, always show sample time. Pre-mount on the public page,
  // show a zero placeholder (identical layout as server). Post-mount, use
  // `time` — null means the target date has passed.
  const display = puck?.isEditing
    ? { days: 14, hours: 8, minutes: 32, seconds: 15 }
    : !mounted
      ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
      : time;

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <m.section
        className={`px-6 py-12 ${styleClasses[variant]}`}
        variants={animationVariants[anim]}
        {...mp}
        transition={transition}
        {...scrollMotion}
      >
        <div className="mx-auto max-w-3xl text-center">
          {heading && (
            <div className="mb-6 text-lg font-semibold">{heading}</div>
          )}
          {display ? (
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {(() => {
                // Urgency pulse kicks in under a minute (mounted real countdown only).
                // Editor preview stays calm so the designer isn't distracted.
                const isUrgent =
                  !puck?.isEditing &&
                  mounted &&
                  !reduce &&
                  display.days === 0 &&
                  display.hours === 0 &&
                  display.minutes === 0 &&
                  display.seconds > 0;

                return [
                  { value: display.days, label: "Days" },
                  { value: display.hours, label: "Hours" },
                  { value: display.minutes, label: "Min" },
                  { value: display.seconds, label: "Sec" },
                ].map((unit, i) => (
                  <div key={unit.label} className="text-center">
                    <m.div
                      className={`rounded-xl px-4 py-3 sm:px-6 sm:py-4 ${unitBoxStyles[variant]}`}
                      animate={
                        isUrgent
                          ? { scale: [1, 1.05, 1] }
                          : { scale: 1 }
                      }
                      transition={
                        isUrgent
                          ? {
                              duration: 0.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.08,
                            }
                          : { duration: 0.2 }
                      }
                    >
                      <span className="text-3xl font-bold tabular-nums sm:text-5xl">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                    </m.div>
                    <span className="mt-2 block text-xs font-medium uppercase tracking-wider opacity-70">
                      {unit.label}
                    </span>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <p className="text-lg">{expiredMessage}</p>
          )}
        </div>
      </m.section>
    </StyleWrapper>
  );
}