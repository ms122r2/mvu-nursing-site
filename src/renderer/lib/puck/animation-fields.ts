/**
 * Enhanced animation fields — delay, duration, easing controls.
 * Spread alongside the existing animationVariant field.
 */

import type { Transition } from "motion/react";
import { SectionDivider } from "../../components/puck/fields/SectionDivider";
import { AnimationPreviewField } from "../../components/puck/fields/AnimationPreviewField";

export const animationEnhancedFields = {
  _sectionAnimation: {
    type: "custom" as const,
    label: "Animation Timing",
    render: SectionDivider,
  },
  _animPreview: {
    type: "custom" as const,
    label: "",
    render: AnimationPreviewField,
  },
  _animDelay: {
    type: "select" as const,
    label: "Animation Delay",
    options: [
      { label: "None", value: "0" },
      { label: "100ms", value: "0.1" },
      { label: "200ms", value: "0.2" },
      { label: "300ms", value: "0.3" },
      { label: "500ms", value: "0.5" },
      { label: "1s", value: "1" },
    ],
  },
  _animDuration: {
    type: "select" as const,
    label: "Animation Speed",
    options: [
      { label: "Fast (200ms)", value: "0.2" },
      { label: "Normal (400ms)", value: "0.4" },
      { label: "Slow (600ms)", value: "0.6" },
      { label: "Very Slow (1s)", value: "1" },
    ],
  },
  _animEasing: {
    type: "select" as const,
    label: "Animation Easing",
    options: [
      { label: "Ease Out", value: "easeOut" },
      { label: "Ease In Out", value: "easeInOut" },
      { label: "Spring", value: "spring" },
      { label: "Linear", value: "linear" },
    ],
  },
};

export const animationEnhancedDefaults = {
  _animDelay: "0",
  _animDuration: "0.4",
  _animEasing: "easeOut",
};

export type AnimationEnhancedProps = typeof animationEnhancedDefaults;

/**
 * Build a Motion transition object from the enhanced animation props.
 */
export function getTransition(props: AnimationEnhancedProps): Transition {
  const delay = Number(props._animDelay) || 0;
  const duration = Number(props._animDuration) || 0.4;
  const ease = props._animEasing || "easeOut";

  if (ease === "spring") {
    return { type: "spring" as const, delay, stiffness: 300, damping: 20 };
  }

  return { duration, delay, ease: ease as "easeOut" | "easeInOut" | "linear" };
}

export function extractAnimationEnhancedProps(
  props: Record<string, unknown>
): AnimationEnhancedProps {
  return {
    _animDelay: (props._animDelay as string) ?? "0",
    _animDuration: (props._animDuration as string) ?? "0.4",
    _animEasing: (props._animEasing as string) ?? "easeOut",
  };
}
