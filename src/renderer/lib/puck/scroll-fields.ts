/**
 * Scroll-triggered interaction fields.
 * Adds parallax, sticky, and scroll-progress effects to components.
 */

import { SectionDivider } from "../../components/puck/fields/SectionDivider";

export const scrollFields = {
  _sectionScroll: {
    type: "custom" as const,
    label: "Scroll Effects",
    render: SectionDivider,
  },
  _scrollEffect: {
    type: "select" as const,
    label: "Scroll Effect",
    options: [
      { label: "None", value: "none" },
      { label: "Parallax (slow)", value: "parallax-slow" },
      { label: "Parallax (fast)", value: "parallax-fast" },
      { label: "Fade on Scroll", value: "fade" },
      { label: "Scale on Scroll", value: "scale" },
      { label: "Slide from Left", value: "slide-left" },
      { label: "Slide from Right", value: "slide-right" },
    ],
  },
  _scrollOnce: {
    type: "radio" as const,
    label: "Animate Once",
    options: [
      { label: "Yes (play once)", value: true },
      { label: "No (repeat)", value: false },
    ],
  },
};

export const scrollDefaults = {
  _scrollEffect: "none",
  _scrollOnce: true,
};

export type ScrollProps = typeof scrollDefaults;

/**
 * Get Motion scroll-triggered props based on the selected effect.
 */
export function getScrollMotionProps(props: ScrollProps) {
  if (props._scrollEffect === "none") return {};

  const viewport = { once: !!props._scrollOnce, margin: "-100px" as const };

  switch (props._scrollEffect) {
    case "parallax-slow":
      return {
        initial: { y: 40 },
        whileInView: { y: 0 },
        viewport,
        transition: { duration: 0.8, ease: "easeOut" as const },
      };
    case "parallax-fast":
      return {
        initial: { y: 80 },
        whileInView: { y: 0 },
        viewport,
        transition: { duration: 0.6, ease: "easeOut" as const },
      };
    case "fade":
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport,
        transition: { duration: 0.6 },
      };
    case "scale":
      return {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport,
        transition: { duration: 0.5, ease: "easeOut" as const },
      };
    case "slide-left":
      return {
        initial: { opacity: 0, x: -60 },
        whileInView: { opacity: 1, x: 0 },
        viewport,
        transition: { duration: 0.6, ease: "easeOut" as const },
      };
    case "slide-right":
      return {
        initial: { opacity: 0, x: 60 },
        whileInView: { opacity: 1, x: 0 },
        viewport,
        transition: { duration: 0.6, ease: "easeOut" as const },
      };
    default:
      return {};
  }
}

export function extractScrollProps(
  props: Record<string, unknown>
): ScrollProps {
  return {
    _scrollEffect: (props._scrollEffect as string) ?? "none",
    _scrollOnce: (props._scrollOnce as boolean) ?? true,
  };
}