/**
 * Shared hover / tap / focus effect fields for interactive components.
 *
 * `whileHover` is mouse-only. `whileTap` gives touch users (phones, tablets)
 * the same "this is pressable" signal, and `whileFocus` does the same for
 * keyboard navigation — which is also the a11y baseline we need for every
 * interactive element.
 */

import { SectionDivider } from "../../components/puck/fields/SectionDivider";

export const hoverFields = {
  _sectionHover: {
    type: "custom" as const,
    label: "Hover / Tap / Focus",
    render: SectionDivider,
  },
  _hoverEffect: {
    type: "select" as const,
    label: "Hover Effect",
    options: [
      { label: "None", value: "none" },
      { label: "Lift (shadow + translate)", value: "lift" },
      { label: "Grow (scale up)", value: "grow" },
      { label: "Glow (shadow only)", value: "glow" },
      { label: "Border highlight", value: "border" },
    ],
  },
  _tapScale: {
    type: "select" as const,
    label: "Tap / Click Feedback",
    options: [
      { label: "None", value: "none" },
      { label: "Subtle press (0.98)", value: "subtle" },
      { label: "Press (0.96)", value: "press" },
      { label: "Strong press (0.94)", value: "strong" },
    ],
  },
  _focusRing: {
    type: "select" as const,
    label: "Focus Ring (keyboard)",
    options: [
      { label: "None", value: "none" },
      { label: "Match hover effect", value: "match" },
      { label: "Outline only", value: "outline" },
    ],
  },
};

export const hoverDefaults = {
  _hoverEffect: "lift",
  _tapScale: "subtle",
  _focusRing: "match",
};

export type HoverProps = typeof hoverDefaults;

type HoverAnimation = {
  y?: number;
  boxShadow?: string;
  scale?: number;
  borderColor?: string;
  outline?: string;
  outlineOffset?: number;
};

/**
 * Get Motion whileHover props for a hover effect.
 */
export function getHoverAnimation(effect: string): HoverAnimation | undefined {
  switch (effect) {
    case "lift":
      return { y: -4, boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)" };
    case "grow":
      return { scale: 1.03 };
    case "glow":
      return { boxShadow: "0 0 20px 2px rgb(79 70 229 / 0.15)" };
    case "border":
      return { borderColor: "#4f46e5" };
    case "none":
    default:
      return undefined;
  }
}

/**
 * Get Motion whileTap props. Scale-only — gives a tactile "pressed" feel
 * on touch devices and click feedback on desktop.
 */
export function getTapAnimation(level: string): { scale: number } | undefined {
  switch (level) {
    case "subtle":
      return { scale: 0.98 };
    case "press":
      return { scale: 0.96 };
    case "strong":
      return { scale: 0.94 };
    case "none":
    default:
      return undefined;
  }
}

/**
 * Get Motion whileFocus props. Defaults to mirroring the hover effect so
 * keyboard users get the same affordance as mouse users. "outline" gives
 * an explicit focus ring (recommended when the hover effect is subtle).
 */
export function getFocusAnimation(
  mode: string,
  hoverEffect: string
): HoverAnimation | undefined {
  if (mode === "none") return undefined;
  if (mode === "outline") {
    return {
      outline: "2px solid #4f46e5",
      outlineOffset: 2,
    };
  }
  // "match" — reuse the hover animation so tab-focus + mouse-hover look alike.
  return getHoverAnimation(hoverEffect);
}

/**
 * Extract all three interaction-state props from a component's rest props.
 */
export function extractInteractionProps(props: Record<string, unknown>): HoverProps {
  return {
    _hoverEffect: (props._hoverEffect as string) ?? hoverDefaults._hoverEffect,
    _tapScale: (props._tapScale as string) ?? hoverDefaults._tapScale,
    _focusRing: (props._focusRing as string) ?? hoverDefaults._focusRing,
  };
}