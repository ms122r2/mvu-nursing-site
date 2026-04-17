"use client";

import { domMax, LazyMotion, MotionConfig } from "motion/react";

/**
 * Top-of-tree Motion context. Hoisted out of PuckRenderer so layout-level
 * motion (PageTransition, route-level chrome, future overlays) can use
 * the tree-shaken `m.*` components too — not just the Puck component
 * forest.
 *
 * Why domMax instead of domAnimation: Tabs uses layoutId + layout
 * animations, which live only in the max feature set (~35kb vs ~25kb).
 *
 * Why no strict mode: Puck's own chrome uses motion.* internally and
 * strict would throw on its first render.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
