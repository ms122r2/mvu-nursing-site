"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import type { ButtonStyleProps } from "../../../lib/puck/button-fields";

const sizeStyles: Record<string, CSSProperties> = {
  sm: { padding: "6px 16px", fontSize: "13px" },
  md: { padding: "10px 24px", fontSize: "14px" },
  lg: { padding: "14px 32px", fontSize: "16px" },
};

const radiusMap: Record<string, string> = {
  none: "0",
  sm: "6px",
  md: "8px",
  full: "9999px",
};

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

/**
 * Shared styled button used by all CTA components.
 * Reads button style props and renders a properly styled <a> or <button>.
 */
const magneticStrengthMap: Record<string, number> = {
  off: 0,
  subtle: 0.15,
  medium: 0.3,
  strong: 0.5,
};

export function StyledButton({
  label,
  href,
  onClick,
  disabled,
  _btnSize = "md",
  _btnVariant = "solid",
  _btnColor = "#4f46e5",
  _btnRadius = "md",
  _btnHoverColor = "",
  _btnHoverScale = "1.02",
  _btnMagnetic = "off",
}: Partial<ButtonStyleProps> & {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  // Magnetic pointer-follow. useMotionValue + useSpring = buttery physics
  // without re-renders on every mousemove. Strength 0 = off; higher values
  // make the button track the cursor farther before snapping back.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });
  const ref = useRef<HTMLElement>(null);
  const magneticStrength = magneticStrengthMap[_btnMagnetic] ?? 0;

  function handleMove(e: React.PointerEvent) {
    if (!magneticStrength || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * magneticStrength);
    y.set((e.clientY - cy) * magneticStrength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }
  const color = _btnColor || "#4f46e5";
  const textColor = isLight(color) ? "#1e293b" : "#ffffff";
  const size = sizeStyles[_btnSize] ?? sizeStyles.md;
  const radius = radiusMap[_btnRadius] ?? radiusMap.md;

  const baseStyle: CSSProperties = {
    ...size,
    borderRadius: radius,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    transition: "all 150ms ease",
    lineHeight: "1.25",
  };

  let style: CSSProperties;
  switch (_btnVariant) {
    case "solid":
      style = {
        ...baseStyle,
        backgroundColor: color,
        color: textColor,
        border: "none",
      };
      break;
    case "outline":
      style = {
        ...baseStyle,
        backgroundColor: "transparent",
        color: color,
        border: `2px solid ${color}`,
      };
      break;
    case "ghost":
      style = {
        ...baseStyle,
        backgroundColor: "transparent",
        color: color,
        border: "none",
      };
      break;
    case "link":
      style = {
        ...baseStyle,
        backgroundColor: "transparent",
        color: color,
        border: "none",
        padding: "0",
        textDecoration: "underline",
        textUnderlineOffset: "4px",
      };
      break;
    default:
      style = { ...baseStyle, backgroundColor: color, color: textColor };
  }

  const hoverScale = Number(_btnHoverScale) || 1.02;
  const hoverAnim: Record<string, unknown> = { scale: hoverScale };
  if (_btnHoverColor) {
    hoverAnim.backgroundColor = _btnHoverColor;
  }

  // Keyboard-focus visual: mirror the hover animation so tab-navigating feels
  // identical to mouse-hover, plus an explicit focus ring for WCAG 2.4.7.
  // The ring stays even if focus is replaced with a click (Motion's whileFocus
  // only fires on :focus-visible, so mouse clicks won't keep it).
  const focusAnim: Record<string, unknown> = {
    ...hoverAnim,
    outline: "2px solid currentColor",
    outlineOffset: "2px",
  };

  const Tag = href ? m.a : m.button;
  const common: Record<string, unknown> = {
    style: magneticStrength ? { ...style, x: sx, y: sy } : style,
    whileHover: hoverAnim,
    whileTap: { scale: 0.98 },
    whileFocus: focusAnim,
    ref,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
  };
  const motionProps = href ? { href, ...common } : { onClick, disabled, ...common };

  return <Tag {...(motionProps as Record<string, unknown>)}>{label}</Tag>;
}