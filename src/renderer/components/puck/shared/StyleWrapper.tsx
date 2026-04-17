"use client";

import type { ReactNode } from "react";
import type { StyleProps } from "../../../lib/puck/style-fields";

const paddingMap: Record<string, string> = {
  "0": "0px",
  "1": "4px",
  "2": "8px",
  "4": "16px",
  "6": "24px",
  "12": "48px",
  "16": "64px",
  "24": "96px",
};

const radiusMap: Record<string, string> = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
};

const shadowMap: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
};

const TABLET_MQ = "(min-width: 768px) and (max-width: 1023px)";
const MOBILE_MQ = "(max-width: 767px)";

/** Build padding/margin CSS declarations for a given breakpoint suffix. */
function buildResponsiveDecls(
  paddingTop: string,
  paddingBottom: string,
  paddingX: string,
  marginTop: string,
  marginBottom: string
): string {
  const decls: string[] = [];
  if (paddingTop && paddingMap[paddingTop]) decls.push(`padding-top: ${paddingMap[paddingTop]}`);
  if (paddingBottom && paddingMap[paddingBottom]) decls.push(`padding-bottom: ${paddingMap[paddingBottom]}`);
  if (paddingX && paddingMap[paddingX]) {
    decls.push(`padding-left: ${paddingMap[paddingX]}`);
    decls.push(`padding-right: ${paddingMap[paddingX]}`);
  }
  if (marginTop) {
    decls.push(`margin-top: ${marginTop === "auto" ? "auto" : (paddingMap[marginTop] ?? "0px")}`);
  }
  if (marginBottom) {
    decls.push(`margin-bottom: ${marginBottom === "auto" ? "auto" : (paddingMap[marginBottom] ?? "0px")}`);
  }
  return decls.join("; ");
}

/**
 * Wraps any Puck component render output with universal style controls.
 * Reads the _prefixed style props and applies them as inline styles.
 *
 * Usage in component render:
 * ```tsx
 * <StyleWrapper {...props}>
 *   <section>...</section>
 * </StyleWrapper>
 * ```
 */
export function StyleWrapper({
  children,
  _componentId,
  _paddingTop,
  _paddingBottom,
  _paddingX,
  _marginTop,
  _marginBottom,
  _borderRadius,
  _shadow,
  _opacity,
  _hideOnMobile,
  _hideOnDesktop,
  _paddingTop_tablet,
  _paddingBottom_tablet,
  _paddingX_tablet,
  _marginTop_tablet,
  _marginBottom_tablet,
  _paddingTop_mobile,
  _paddingBottom_mobile,
  _paddingX_mobile,
  _marginTop_mobile,
  _marginBottom_mobile,
}: StyleProps & { children: ReactNode; _componentId?: string }) {
  const tabletDecls = buildResponsiveDecls(
    _paddingTop_tablet ?? "",
    _paddingBottom_tablet ?? "",
    _paddingX_tablet ?? "",
    _marginTop_tablet ?? "",
    _marginBottom_tablet ?? ""
  );
  const mobileDecls = buildResponsiveDecls(
    _paddingTop_mobile ?? "",
    _paddingBottom_mobile ?? "",
    _paddingX_mobile ?? "",
    _marginTop_mobile ?? "",
    _marginBottom_mobile ?? ""
  );
  const hasResponsive = Boolean(tabletDecls || mobileDecls);

  const hasStyles =
    _paddingTop ||
    _paddingBottom ||
    _paddingX ||
    _marginTop ||
    _marginBottom ||
    _borderRadius !== "none" ||
    _shadow !== "none" ||
    _opacity !== "100" ||
    _hideOnMobile ||
    _hideOnDesktop ||
    hasResponsive;

  if (!hasStyles) return <>{children}</>;

  const style: Record<string, string> = {};
  if (_paddingTop && paddingMap[_paddingTop])
    style.paddingTop = paddingMap[_paddingTop];
  if (_paddingBottom && paddingMap[_paddingBottom])
    style.paddingBottom = paddingMap[_paddingBottom];
  if (_paddingX && paddingMap[_paddingX]) {
    style.paddingLeft = paddingMap[_paddingX];
    style.paddingRight = paddingMap[_paddingX];
  }
  if (_marginTop) {
    style.marginTop = _marginTop === "auto" ? "auto" : (paddingMap[_marginTop] ?? "0px");
  }
  if (_marginBottom) {
    style.marginBottom =
      _marginBottom === "auto" ? "auto" : (paddingMap[_marginBottom] ?? "0px");
  }
  if (_borderRadius && _borderRadius !== "none")
    style.borderRadius = radiusMap[_borderRadius];
  if (_shadow && _shadow !== "none") style.boxShadow = shadowMap[_shadow];
  if (_opacity && _opacity !== "100")
    style.opacity = (Number(_opacity) / 100).toString();

  const classes: string[] = [];
  if (_hideOnMobile) classes.push("hidden md:block");
  if (_hideOnDesktop) classes.push("md:hidden");

  // Stable selector for media-query rules. Falls back to a prop hash if
  // the component doesn't have an id (shouldn't happen in Puck data).
  const selectorId = _componentId || undefined;
  const responsiveCss =
    hasResponsive && selectorId
      ? [
          tabletDecls &&
            `@media ${TABLET_MQ} { [data-responsive-id="${selectorId}"] { ${tabletDecls} } }`,
          mobileDecls &&
            `@media ${MOBILE_MQ} { [data-responsive-id="${selectorId}"] { ${mobileDecls} } }`,
        ]
          .filter(Boolean)
          .join("
")
      : "";

  return (
    <>
      {responsiveCss && (
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: responsiveCss }}
        />
      )}
      <div
        style={style}
        className={classes.join(" ") || undefined}
        data-responsive-id={selectorId}
      >
        {children}
      </div>
    </>
  );
}

/**
 * Extract style props from the full props object.
 * Use to split style props from component-specific props.
 */
export function extractStyleProps(props: Record<string, unknown>): StyleProps & { _componentId?: string } {
  return {
    _componentId: (props.id as string) ?? undefined,
    _paddingTop: (props._paddingTop as string) ?? "",
    _paddingBottom: (props._paddingBottom as string) ?? "",
    _paddingX: (props._paddingX as string) ?? "",
    _marginTop: (props._marginTop as string) ?? "",
    _marginBottom: (props._marginBottom as string) ?? "",
    _borderRadius: (props._borderRadius as string) ?? "none",
    _shadow: (props._shadow as string) ?? "none",
    _opacity: (props._opacity as string) ?? "100",
    _hideOnMobile: (props._hideOnMobile as boolean) ?? false,
    _hideOnDesktop: (props._hideOnDesktop as boolean) ?? false,
    _paddingTop_tablet: (props._paddingTop_tablet as string) ?? "",
    _paddingBottom_tablet: (props._paddingBottom_tablet as string) ?? "",
    _paddingX_tablet: (props._paddingX_tablet as string) ?? "",
    _marginTop_tablet: (props._marginTop_tablet as string) ?? "",
    _marginBottom_tablet: (props._marginBottom_tablet as string) ?? "",
    _paddingTop_mobile: (props._paddingTop_mobile as string) ?? "",
    _paddingBottom_mobile: (props._paddingBottom_mobile as string) ?? "",
    _paddingX_mobile: (props._paddingX_mobile as string) ?? "",
    _marginTop_mobile: (props._marginTop_mobile as string) ?? "",
    _marginBottom_mobile: (props._marginBottom_mobile as string) ?? "",
  };
}