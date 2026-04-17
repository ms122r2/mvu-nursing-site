/**
 * Design Token System
 *
 * Global tokens are stored in the page root props. Components can reference
 * these tokens, and when tokens change, all components update automatically.
 *
 * Token hierarchy: Tenant brand → Page root tokens → Component overrides
 */

export interface DesignTokens {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  buttonStyle: string;
}

export const defaultTokens: DesignTokens = {
  primaryColor: "#4f46e5",
  secondaryColor: "#1e293b",
  accentColor: "#f59e0b",
  headingFont: "",
  bodyFont: "",
  borderRadius: "md",
  buttonStyle: "solid",
};

/**
 * Extract design tokens from Puck root props.
 * Falls back to defaults for any missing token.
 */
export function extractTokens(
  rootProps: Record<string, unknown> | undefined
): DesignTokens {
  if (!rootProps) return defaultTokens;
  return {
    primaryColor: (rootProps.primaryColor as string) || defaultTokens.primaryColor,
    secondaryColor: (rootProps.secondaryColor as string) || defaultTokens.secondaryColor,
    accentColor: (rootProps.accentColor as string) || defaultTokens.accentColor,
    headingFont: (rootProps.headingFont as string) || defaultTokens.headingFont,
    bodyFont: (rootProps.bodyFont as string) || defaultTokens.bodyFont,
    borderRadius: (rootProps.borderRadius as string) || defaultTokens.borderRadius,
    buttonStyle: (rootProps.buttonStyle as string) || defaultTokens.buttonStyle,
  };
}

/**
 * Apply design tokens to a component's props.
 * Only fills in values that aren't already set (component overrides win).
 */
export function applyTokensToProps(
  props: Record<string, unknown>,
  tokens: DesignTokens
): Record<string, unknown> {
  const updated = { ...props };

  // Button color defaults to primary if not set
  if (!updated._btnColor) updated._btnColor = tokens.primaryColor;

  // Heading font defaults to global if not set
  if (!updated._headingFont) updated._headingFont = tokens.headingFont;

  // Border radius defaults to global if not set
  if (!updated._borderRadius || updated._borderRadius === "none") {
    updated._borderRadius = tokens.borderRadius;
  }

  // Button variant defaults to global
  if (!updated._btnVariant) updated._btnVariant = tokens.buttonStyle;

  return updated;
}