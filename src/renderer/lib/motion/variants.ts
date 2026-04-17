import type { Variants } from "motion/react";

export type AnimationVariant =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "stagger"
  | "none";

// NOTE: Variants intentionally omit a `transition` block so the component's
// `transition` prop (driven by the sidebar's delay/duration/easing fields)
// is what actually runs. If you re-add `transition` here it will override
// those user-selected timing controls.
export const animationVariants: Record<AnimationVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  stagger: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

/** Container variant for staggering children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

/** Scroll-triggered animation props — use with motion components */
export const scrollRevealProps = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-80px" },
};

/**
 * Get motion props for a component that respects the Puck isEditing state.
 * In the editor, animations play immediately; on the public page, they trigger on scroll.
 */
export function getMotionProps(isEditing?: boolean) {
  if (isEditing) {
    return { initial: "visible" as const, animate: "visible" as const };
  }
  // On the deployed site (not in Puck editor), render content visible
  // immediately for SSR/SEO, then use whileInView for scroll animations.
  // Setting initial to false prevents Motion from applying the hidden
  // variant on mount — elements start visible and animate on scroll
  // for elements below the fold.
  return {
    initial: { opacity: 1, transform: "none" },
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-80px" },
  };
}

// Page transition was previously defined here as a Variants object with
// `hidden`/`visible`/`exit` labels. Removed because Motion propagates those
// labels down the tree — applying them to a page-level wrapper would fire
// every child component's entry animation on mount instead of on scroll.
// PageTransition.tsx now uses inline object animation to stay scoped.

/** Animation variant select options for Puck field configs */
export const animationVariantOptions = [
  { label: "Fade up", value: "fadeUp" },
  { label: "Fade in", value: "fadeIn" },
  { label: "Slide in left", value: "slideLeft" },
  { label: "Slide in right", value: "slideRight" },
  { label: "Scale in", value: "scaleIn" },
  { label: "Stagger children", value: "stagger" },
  { label: "None", value: "none" },
];
