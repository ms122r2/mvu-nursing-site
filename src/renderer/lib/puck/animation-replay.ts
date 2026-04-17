/**
 * Editor-side animation replay channel.
 *
 * In edit mode, Puck renders motion components with `initial="visible"`
 * so designers see the final state. "Play" forces a quick hidden →
 * visible cycle on a single component by toggling a short-lived CSS
 * class. The class uses the exact same transform/opacity values the
 * motion variants target, so it's a visual approximation of the
 * animation — accurate enough to show timing differences.
 */

export const REPLAY_CLASS = "lxs-replay-entry";
export const REPLAY_EVENT = "lxs:replay-entry";

/**
 * Inject the replay CSS into the parent document. Idempotent.
 * Motion runs in the iframe AND the parent for Puck's overlay, so
 * we inject into both when an iframe exists.
 */
export function ensureReplayStyles() {
  if (typeof document === "undefined") return;
  const ID = "lxs-replay-styles";
  if (document.getElementById(ID)) return;
  const css = `
@keyframes ${REPLAY_CLASS} {
  0%   { opacity: 0; transform: translateY(32px) scale(0.95); }
  100% { opacity: 1; transform: none; }
}
.${REPLAY_CLASS} {
  animation: ${REPLAY_CLASS} var(--lxs-replay-duration, 600ms)
             var(--lxs-replay-easing, cubic-bezier(0.16, 1, 0.3, 1))
             var(--lxs-replay-delay, 0ms)
             both;
}
`;
  const style = document.createElement("style");
  style.id = ID;
  style.textContent = css;
  document.head.appendChild(style);

  // Also inject into any existing iframe with the preview
  for (const iframe of Array.from(document.querySelectorAll("iframe"))) {
    try {
      const doc = (iframe as HTMLIFrameElement).contentDocument;
      if (doc && !doc.getElementById(ID)) {
        const s = doc.createElement("style");
        s.id = ID;
        s.textContent = css;
        doc.head.appendChild(s);
      }
    } catch {
      // cross-origin iframe — nothing we can do
    }
  }
}

/**
 * Find every element in the editor matching the target ID (parent +
 * iframes), add REPLAY_CLASS, remove it after the animation ends so a
 * second click replays. Also sets CSS variables from duration/delay/
 * easing so the class respects the user's timing selections.
 */
export function replayEntry(opts: {
  componentId: string;
  durationMs: number;
  delayMs: number;
  easing: string;
}) {
  if (typeof document === "undefined") return;
  ensureReplayStyles();

  const selector = `[data-puck-component][data-puck-id="${opts.componentId}"], [data-responsive-id="${opts.componentId}"]`;

  const hit = (doc: Document) => {
    const nodes = Array.from(doc.querySelectorAll(selector));
    for (const raw of nodes) {
      const node = raw as HTMLElement;
      node.style.setProperty("--lxs-replay-duration", `${opts.durationMs}ms`);
      node.style.setProperty("--lxs-replay-delay", `${opts.delayMs}ms`);
      node.style.setProperty("--lxs-replay-easing", opts.easing);
      node.classList.remove(REPLAY_CLASS);
      // Force reflow so removing + re-adding in one tick triggers the animation
      void node.offsetWidth;
      node.classList.add(REPLAY_CLASS);
      node.addEventListener(
        "animationend",
        () => node.classList.remove(REPLAY_CLASS),
        { once: true }
      );
    }
    return nodes.length;
  };

  let found = hit(document);
  for (const iframe of Array.from(document.querySelectorAll("iframe"))) {
    try {
      const doc = (iframe as HTMLIFrameElement).contentDocument;
      if (doc) found += hit(doc);
    } catch {
      // cross-origin
    }
  }
  return found;
}
