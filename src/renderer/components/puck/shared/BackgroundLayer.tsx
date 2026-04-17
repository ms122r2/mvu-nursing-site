"use client";

import type { ReactNode, CSSProperties } from "react";
import type { BackgroundProps } from "../../../lib/puck/background-fields";

const gradientDirs: Record<string, string> = {
  "to-r": "to right",
  "to-b": "to bottom",
  "to-br": "to bottom right",
  "to-t": "to top",
};

/**
 * Renders background (color, image, gradient, overlay) behind content.
 * Use as the outer wrapper of any container component.
 *
 * ```tsx
 * <BackgroundLayer {...bgProps}>
 *   <div className="relative z-10">content here</div>
 * </BackgroundLayer>
 * ```
 */
export function BackgroundLayer({
  children,
  className,
  _bgColor,
  _bgImage,
  _bgImagePosition,
  _bgImageSize,
  _bgOverlayColor,
  _bgOverlayOpacity,
  _bgGradient,
  _bgGradientFrom,
  _bgGradientTo,
}: BackgroundProps & { children: ReactNode; className?: string }) {
  const style: CSSProperties = {};

  // Background color
  if (_bgColor) style.backgroundColor = _bgColor;

  // Background image
  if (_bgImage) {
    style.backgroundImage = `url(${_bgImage})`;
    style.backgroundPosition = _bgImagePosition || "center";
    style.backgroundSize = _bgImageSize || "cover";
    style.backgroundRepeat = "no-repeat";
  }

  // Gradient (overrides image if both set — gradient takes priority visually)
  if (
    _bgGradient &&
    _bgGradient !== "none" &&
    _bgGradientFrom &&
    _bgGradientTo
  ) {
    const dir = gradientDirs[_bgGradient] ?? "to right";
    style.background = `linear-gradient(${dir}, ${_bgGradientFrom}, ${_bgGradientTo})`;
  }

  const hasOverlay =
    _bgOverlayOpacity && _bgOverlayOpacity !== "0" && _bgOverlayColor;

  // Determine text color hint: if background is dark, children likely need white text
  const hasBg = _bgColor || _bgImage || (_bgGradient && _bgGradient !== "none");

  return (
    <div className={`relative ${className ?? ""}`} style={style}>
      {hasOverlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: _bgOverlayColor,
            opacity: Number(_bgOverlayOpacity) / 100,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

/**
 * Extract background props from the full props object.
 */
export function extractBackgroundProps(
  props: Record<string, unknown>
): BackgroundProps {
  return {
    _bgColor: (props._bgColor as string) ?? "",
    _bgImage: (props._bgImage as string) ?? "",
    _bgImagePosition: (props._bgImagePosition as string) ?? "center",
    _bgImageSize: (props._bgImageSize as string) ?? "cover",
    _bgOverlayColor: (props._bgOverlayColor as string) ?? "#000000",
    _bgOverlayOpacity: (props._bgOverlayOpacity as string) ?? "0",
    _bgGradient: (props._bgGradient as string) ?? "none",
    _bgGradientFrom: (props._bgGradientFrom as string) ?? "",
    _bgGradientTo: (props._bgGradientTo as string) ?? "",
  };
}