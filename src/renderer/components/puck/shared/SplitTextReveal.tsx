"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Letter-by-letter reveal for headings. Splits children (string only) into
 * spans, animates each one in with a staggered delay.
 *
 * Use only when the underlying text is a plain string. richtext fields
 * with formatting should keep the default `{children}` path — splitting
 * a React tree is out of scope here.
 */
export function SplitTextReveal({
  children,
  mode = "words",
  stagger = 0.04,
  duration = 0.45,
  animated = true,
  className,
  style,
}: {
  children: ReactNode;
  mode?: "letters" | "words";
  stagger?: number;
  duration?: number;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();

  // Only split strings. Anything richer (a rendered richtext tree) falls
  // through and renders verbatim so formatting isn't blown up.
  const text = typeof children === "string" ? children : null;

  if (!text || !animated || reduce) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }

  const tokens =
    mode === "words"
      ? text.split(/(\s+)/) // keep whitespace as its own tokens so layout survives
      : Array.from(text); // letters; Array.from handles surrogate pairs

  return (
    <span
      className={className}
      style={style}
      aria-label={text}
    >
      {tokens.map((token, i) => {
        // Keep whitespace tokens un-animated so lines break naturally.
        if (/^\s+$/.test(token)) return token;
        return (
          <m.span
            key={i}
            initial={{ opacity: 0, y: "0.25em" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration,
              delay: i * stagger,
              ease: "easeOut",
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            aria-hidden="true"
          >
            {token}
          </m.span>
        );
      })}
    </span>
  );
}
