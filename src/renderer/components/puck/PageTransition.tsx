"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";

/**
 * Client-side route transition wrapper. Keyed on pathname so Next.js
 * App Router page changes trigger an AnimatePresence exit → enter cycle.
 *
 * IMPORTANT: this uses inline object animations (not variant labels like
 * "hidden"/"visible") because Motion propagates variant labels down to
 * every nested motion element. If this component used variants named
 * `hidden` / `visible`, every child component's entry animation would
 * fire on mount instead of on scroll — because children also define
 * `hidden` / `visible` variants and inherit the parent's `animate` state.
 * Inline object animations stay scoped to this element.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // PageTransition lives under <MotionProvider> (layout level), so `m.*`
  // has LazyMotion features available and will animate as expected.
  //
  // `initial={false}` on AnimatePresence would disable ALL child motion
  // elements' `initial` animations on first render — not just this wrapper.
  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}