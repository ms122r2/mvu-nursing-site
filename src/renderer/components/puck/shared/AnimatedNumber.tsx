"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";

type ParsedValue = {
  /** Leading non-digit characters (e.g. "$" in "$73,300", "~$" in "~$12,736") */
  prefix: string;
  /** The numeric value to animate to */
  target: number;
  /** Trailing non-digit characters (e.g. "%" in "98%", "+" in "12+", "K" in "$65K") */
  suffix: string;
  /** Whether the original had thousands separators (commas) */
  hasSeparators: boolean;
  /** Number of decimal places in the source */
  decimals: number;
};

/**
 * Parse a stat string like "$73,300" / "98%" / "12+" / "$32K" / "$2.5K-$32K"
 * into a structured form we can animate.
 *
 * For ranges and non-numeric values, target is NaN and the raw string is
 * used as the display fallback.
 */
export function parseStatValue(raw: string): ParsedValue | null {
  if (!raw) return null;

  // Match first "number with optional commas and decimals"
  // e.g. "73,300" from "$73,300", "115,800" from "$115,800", "12" from "12+",
  // "2.5" from "$2.5K-$32K" (only first match; ranges fall back to the low end)
  const match = raw.match(/([d,]+(?:.d+)?)/);
  if (!match) return null;

  const numericStr = match[1];
  const matchStart = match.index ?? 0;
  const matchEnd = matchStart + numericStr.length;

  const target = parseFloat(numericStr.replace(/,/g, ""));
  if (Number.isNaN(target)) return null;

  const hasSeparators = numericStr.includes(",");
  const decimalPart = numericStr.split(".")[1];
  const decimals = decimalPart?.length ?? 0;

  return {
    prefix: raw.slice(0, matchStart),
    target,
    suffix: raw.slice(matchEnd),
    hasSeparators,
    decimals,
  };
}

function formatNumber(
  value: number,
  hasSeparators: boolean,
  decimals: number
): string {
  if (hasSeparators) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return value.toFixed(decimals);
}

/**
 * Animates a stat value's numeric portion from 0 → target when it enters view.
 * Preserves the prefix (e.g. "$") and suffix (e.g. "%", "+", "K") exactly.
 *
 * Falls back to the raw string unchanged if:
 * - the user prefers reduced motion
 * - `animated` is false (edit mode, or explicitly disabled)
 * - the string contains no parseable number
 */
export function AnimatedNumber({
  value,
  animated = true,
  duration = 1.6,
  delay = 0,
}: {
  value: string;
  animated?: boolean;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  const parsed = parseStatValue(value);
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) => {
    if (!parsed) return value;
    return `${parsed.prefix}${formatNumber(latest, parsed.hasSeparators, parsed.decimals)}${parsed.suffix}`;
  });

  useEffect(() => {
    if (!parsed) return;
    if (!animated || reduce) {
      motionValue.set(parsed.target);
      return;
    }
    if (isInView) {
      const controls = animate(motionValue, parsed.target, {
        duration,
        delay,
        ease: "easeOut",
      } as Transition);
      return () => controls.stop();
    }
  }, [animated, reduce, isInView, parsed, duration, delay, motionValue]);

  if (!parsed) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <m.span ref={ref} aria-label={value}>
      {display}
    </m.span>
  );
}